// Splits a shell command (bash or PowerShell) into simple commands, so the guard judges each
// command by WHAT IT RUNS, not by words that happen to be in its arguments (setup review 3.4:
// "msbuild" in a grep pattern was taken for a build, and so was `sed -n 1p .claude/hooks/check.mjs`).
//
//   parseCommand('cd 06 && dotnet --list-sdks | grep -i "msbuild"')
//   -> { opaque: false, commands: [ {argv:["cd","06"]}, {argv:["dotnet","--list-sdks"]}, {argv:["grep","-i","msbuild"]} ] }
//
// - Separators: && || ; | & newline ( ) { }. $(...) and `...` are parsed as commands of their own.
// - Redirects: > >> 2> &> *> give a file target; 2>&1 and the like are not files.
// - Wrappers are looked through: sudo, time, env VAR=x, xargs, npx, Start-Process, cmd /c,
//   bash -c "...", powershell -Command "...". Leading VAR=value assignments are dropped.
// - opaque: the command runs text the guard cannot see (eval, iex, Invoke-Expression,
//   powershell -EncodedCommand). The guard refuses those.
// No dependencies, no shell: this only reads the text.

const SHELLS = new Set(["bash", "sh", "zsh", "dash", "ksh", "fish"]);
const POWERSHELL = new Set(["powershell", "pwsh"]);
const OPAQUE = new Set(["eval", "iex", "invoke-expression"]);
// Commands that run the command after them. Their own options are skipped.
const WRAPPERS = new Set(["sudo", "time", "nohup", "exec", "command", "builtin", "nice", "env", "xargs", "npx", "bunx",
  "start", "start-process", "saps", "call", ".", "source", "strace", "timeout", "watch"]);
const MAX_DEPTH = 4;

// "C:\Program Files\dotnet\dotnet.exe" -> "dotnet"
export function commandName(word) {
  const base = String(word ?? "").split(/[\\/]/).pop() ?? "";
  return base.replace(/\.(exe|cmd|bat|com|ps1)$/i, "").toLowerCase();
}

// Finds the end of $( ... ) or ( ... ) starting at index i (the "(" itself), respecting quotes.
function matchParen(s, i) {
  let depth = 0, q = null;
  for (let k = i; k < s.length; k++) {
    const c = s[k];
    if (q) { if (c === q) q = null; continue; }
    if (c === "'" || c === '"') q = c;
    else if (c === "(") depth++;
    else if (c === ")" && --depth === 0) return k;
  }
  return -1;
}

// Splits text into segments of words. Each segment: { words: [...], redirects: [...], raw }.
// Substitutions ($(...) and backticks) are returned separately in `inner`.
function lex(s) {
  const segments = [];
  const inner = [];
  let words = [], redirects = [], word = null, raw = "", pendingRedirect = false;
  const pushWord = () => {
    if (word === null) return;
    if (pendingRedirect) { redirects.push(word); pendingRedirect = false; }
    else words.push(word);
    word = null;
  };
  const endSegment = () => {
    pushWord();
    pendingRedirect = false;
    if (words.length || redirects.length) segments.push({ words, redirects, raw: raw.trim() });
    words = []; redirects = []; raw = "";
  };
  const add = (c) => { word = (word ?? "") + c; };

  for (let i = 0; i < s.length; i++) {
    const c = s[i], n = s[i + 1];
    // Quotes: the content is one word, without the quotes.
    if (c === "'" || c === '"') {
      const end = s.indexOf(c, i + 1);
      const body = end === -1 ? s.slice(i + 1) : s.slice(i + 1, end);
      if (c === '"') {
        // Command substitution also works inside double quotes.
        for (const m of body.matchAll(/\$\(/g)) {
          const close = matchParen(body, m.index + 1);
          if (close !== -1) inner.push(body.slice(m.index + 2, close));
        }
        for (const m of body.matchAll(/`([^`\n]+)`/g)) inner.push(m[1]);
      }
      add(body.replace(/\\"/g, '"'));
      raw += s.slice(i, end === -1 ? s.length : end + 1);
      i = end === -1 ? s.length : end;
      continue;
    }
    if (c === "$" && n === "(") {
      const close = matchParen(s, i + 1);
      if (close !== -1) {
        inner.push(s.slice(i + 2, close));
        add("$()");
        raw += s.slice(i, close + 1);
        i = close;
        continue;
      }
    }
    if (c === "`") {
      const close = s.indexOf("`", i + 1);
      const nl = s.indexOf("\n", i + 1);
      if (close !== -1 && (nl === -1 || close < nl)) {
        inner.push(s.slice(i + 1, close));
        add("``");
        raw += s.slice(i, close + 1);
        i = close;
        continue;
      }
    }
    // Arrows are not redirects: => (C# lambda in a grep pattern) and -> (text).
    if (c === ">" && (s[i - 1] === "=" || s[i - 1] === "-")) { add(c); raw += c; continue; }
    // Redirects: [n]> [n]>> &> *> ; >&n is a file descriptor, not a file.
    if (c === ">" ||((c === "&" || c === "*") && n === ">") || (/\d/.test(c) && n === ">" && word === null)) {
      pushWord();
      let k = i;
      if (c !== ">") k++;
      while (s[k] === ">") k++;
      if (s[k] === "&" && /\d|-/.test(s[k + 1] ?? "")) { k += 2; i = k - 1; raw += " "; continue; } // 2>&1
      pendingRedirect = true;
      raw += s.slice(i, k);
      i = k - 1;
      continue;
    }
    if (c === "<") { pushWord(); raw += c; continue; } // input redirect or heredoc: reading
    // Separators.
    if (c === "\n" || c === "\r" || c === ";" || c === "|" || c === "(" || c === ")" || c === "{" || c === "}") {
      endSegment();
      if ((c === "|") && n === "|") i++;
      continue;
    }
    if (c === "&") {
      endSegment();
      if (n === "&") i++;
      continue;
    }
    if (c === " " || c === "\t") { pushWord(); raw += c; continue; }
    add(c);
    raw += c;
  }
  endSegment();
  return { segments, inner };
}

// Turns one segment into the command it really runs, looking through wrappers and nested shells.
function resolve(seg, depth, out) {
  let argv = seg.words.filter((w) => w !== "");
  // Leading VAR=value assignments (bash) are not the command.
  while (argv.length && /^[A-Za-z_][A-Za-z0-9_]*=/.test(argv[0])) argv = argv.slice(1);
  for (let guard = 0; argv.length && guard < 10; guard++) {
    const name = commandName(argv[0]);
    if (OPAQUE.has(name)) { out.opaque = true; return; }
    if (WRAPPERS.has(name)) {
      let rest = argv.slice(1);
      if (name === "start-process" || name === "saps" || name === "start") {
        // Start-Process dotnet -ArgumentList "test" -NoNewWindow: keep the file and its arguments.
        rest = rest.filter((w, k) => !/^-/.test(w) && !/^-(workingdirectory|wd|redirectstandard\w*|verb|windowstyle)$/i.test(rest[k - 1] ?? ""));
      } else {
        // Options, VAR=value and numbers of the wrapper itself (timeout 60, xargs -n 1).
        while (rest.length && (/^-/.test(rest[0]) || /^[A-Za-z_][A-Za-z0-9_]*=/.test(rest[0]) || /^\d+[smh]?$/.test(rest[0]))) rest = rest.slice(1);
      }
      argv = rest;
      continue;
    }
    if (SHELLS.has(name)) {
      const k = argv.findIndex((w, idx) => idx > 0 && /^-[a-z]*c[a-z]*$/i.test(w));
      if (k !== -1 && argv[k + 1] !== undefined) { parseInto(argv[k + 1], depth + 1, out); return; }
    }
    if (name === "cmd") {
      const k = argv.findIndex((w, idx) => idx > 0 && /^\/[ck]$/i.test(w));
      if (k !== -1) { parseInto(argv.slice(k + 1).join(" "), depth + 1, out); return; }
    }
    if (POWERSHELL.has(name)) {
      const opts = argv.slice(1);
      if (opts.some((w) => /^-e(c|ncodedcommand|ncodedc?o?m?m?a?n?d?)?$/i.test(w))) { out.opaque = true; return; }
      const k = opts.findIndex((w) => /^-c(o(m(m(a(n(d)?)?)?)?)?)?$/i.test(w));
      if (k !== -1) { parseInto(opts.slice(k + 1).join(" "), depth + 1, out); return; }
      const f = opts.findIndex((w) => /^-f(ile)?$/i.test(w));
      if (f === -1) {
        // powershell "dotnet test" runs its first non-option argument as a command.
        const firstArg = opts.findIndex((w) => !/^-/.test(w));
        if (firstArg !== -1) { parseInto(opts.slice(firstArg).join(" "), depth + 1, out); return; }
      }
    }
    break;
  }
  if (argv.length || seg.redirects.length) out.commands.push({ argv, redirects: seg.redirects, raw: seg.raw });
}

function parseInto(text, depth, out) {
  if (depth > MAX_DEPTH) { out.opaque = true; return; }
  const { segments, inner } = lex(String(text ?? ""));
  for (const seg of segments) resolve(seg, depth, out);
  for (const sub of inner) parseInto(sub, depth + 1, out);
}

export function parseCommand(cmd) {
  const out = { commands: [], opaque: false };
  parseInto(cmd, 0, out);
  return out;
}
