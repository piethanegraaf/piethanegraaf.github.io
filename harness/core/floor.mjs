// A rung floor that does not trust markers (opencode plan, free models, addition 1). At L2 and L3 a code block in
// the learner's language is help of at least rung 4 (a short block, up to 5 lines) or rung 5 (a longer one),
// whatever marker the model wrote. It holds on every host and for every model, so a model that forgets [trede N]
// still leaves an honest record.
//
// A block counts when its fence names a language of settings.codeExtensions (```csharp for cs), or when it has no
// language and looks like code (a ; or { or =>) rather than a command for the learner. Commands (```bash, lines
// that start with ! or node), output, text, pseudocode and diagrams never count.
import { settingsOf, DEFAULT_SETTINGS } from "./lib.mjs";

// Fence languages per file extension.
const ALIASES = {
  cs: ["cs", "csharp", "c#"], csproj: ["xml", "csproj"], sln: [], slnx: ["xml"], py: ["py", "python"], js: ["js", "javascript", "jsx", "mjs"],
  ts: ["ts", "typescript", "tsx"], java: ["java"], kt: ["kt", "kotlin"], go: ["go", "golang"], rs: ["rs", "rust"], cpp: ["cpp", "c++", "cc", "cxx"],
  c: ["c", "h"], rb: ["rb", "ruby"], php: ["php"], swift: ["swift"], sql: ["sql", "tsql", "plsql", "mysql", "postgresql"], fs: ["fs", "fsharp", "f#"],
  vb: ["vb", "vbnet"], html: ["html"], css: ["css", "scss"], razor: ["razor", "cshtml"], dockerfile: ["dockerfile", "docker"],
};
const COMMAND_LINE = /^\s*(!|\$ |>|PS>|node |dotnet |git |npm |npx |cd |dir |ls )/i;

function languagesOf(data) {
  const v = settingsOf(data).codeExtensions;
  const exts = (Array.isArray(v) ? v : DEFAULT_SETTINGS.codeExtensions).map((e) => String(e).replace(/^\./, "").toLowerCase());
  const out = new Set();
  for (const e of exts) { out.add(e); for (const a of ALIASES[e] ?? []) out.add(a); }
  return out;
}

// { rung, lines }: 0 without a counted block, else 4 or 5 and the size of the largest block.
export function codeFloor(answer, data) {
  const langs = languagesOf(data);
  let lines = 0;
  for (const m of String(answer ?? "").matchAll(/```[ \t]*([^\s`]*)[^\n]*\n([\s\S]*?)```/g)) {
    const tag = m[1].toLowerCase();
    const body = m[2].split(/\r?\n/).filter((l) => l.trim());
    if (!body.length) continue;
    const counts = tag ? langs.has(tag) : !body.every((l) => COMMAND_LINE.test(l)) && /;|\{|=>/.test(m[2]);
    if (counts) lines = Math.max(lines, body.length);
  }
  return { rung: lines === 0 ? 0 : lines <= 5 ? 4 : 5, lines };
}
