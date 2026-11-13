// Scaffolding from an official template, unchanged (review of 13 Nov, night, #55).
//
//   node .claude/hooks/scaffold.mjs arc42 <folder> [--lang nl|en] [--with-help] [--from <zip>]
//
// In graded work Claude writes no content (OER art. 7.11, AI level 1). An official template is not AI
// content: this script downloads the arc42 template (GitHub Markdown, one file per chapter) from the
// release of the arc42 project on GitHub, checks its sha256 against the value pinned below, and
// unpacks it as it is into a new or empty folder. Nothing is added or changed. The guard allows this
// script (only this copy, in .claude/hooks/) in graded work and the AI-use log gets a row for it.
//
// --with-help: the version with the explanation per chapter (arc42 "withhelp"); without it the plain one.
// --from <zip>: a zip the learner downloaded; it must have the same sha256 as the official one.
// Source and licence: https://arc42.org, https://github.com/arc42/arc42-template (CC BY-SA 4.0).
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { t, loadSkills, settingsOf } from "./lib.mjs";

export const ARC42_RELEASE = "2026.10.19";
// sha256 of the release assets (GitHub API, "digest"), checked on 13 November 2026.
export const ARC42_DIGESTS = {
  "arc42-template-NL-plain-gitHubMarkdownMP.zip": "59e19893f4eeaf84afaea27a2151fe40867e1ed2f43bcb7856ee2bf9164535aa",
  "arc42-template-NL-withhelp-gitHubMarkdownMP.zip": "68f6cee14e264b5ec39ca6056e58c906ae8bca7ff853189777769e277cf87f7a",
  "arc42-template-EN-plain-gitHubMarkdownMP.zip": "959ec93647b9a03c1eeacb4251830264febff0fdb44eb63fc5814cda4c8dda5e",
  "arc42-template-EN-withhelp-gitHubMarkdownMP.zip": "80626bc7d333a6c1fba97c00ff8b803d35bac71a414f4820654bd1f9ac33ce00",
};
export const arc42Asset = (lang, withHelp) => `arc42-template-${lang === "en" ? "EN" : "NL"}-${withHelp ? "withhelp" : "plain"}-gitHubMarkdownMP.zip`;
export const arc42Url = (asset, release = ARC42_RELEASE) => `https://github.com/arc42/arc42-template/releases/download/${release}/${asset}`;

const MAX_ENTRIES = 500;
const MAX_BYTES = 20 * 1024 * 1024;

// The entries of a zip file (store and deflate; no zip64, no encryption). A name may not leave the
// target folder: no absolute path, no drive, no "..", no backslash.
export function readZip(buf) {
  const eocdSig = 0x06054b50;
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 22 - 65535); i--) if (buf.readUInt32LE(i) === eocdSig) { eocd = i; break; }
  if (eocd < 0) throw new Error("no zip");
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  if (count > MAX_ENTRIES) throw new Error("too many entries");
  const out = [];
  let total = 0;
  for (let k = 0; k < count; k++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error("bad central directory");
    const flags = buf.readUInt16LE(p + 8), method = buf.readUInt16LE(p + 10);
    const csize = buf.readUInt32LE(p + 20), usize = buf.readUInt32LE(p + 24);
    const nlen = buf.readUInt16LE(p + 28), elen = buf.readUInt16LE(p + 30), clen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.toString("utf8", p + 46, p + 46 + nlen);
    p += 46 + nlen + elen + clen;
    if (flags & 1) throw new Error("encrypted");
    if (!name || name.includes("\\") || name.startsWith("/") || /^[a-z]:/i.test(name) || name.split("/").includes("..")) throw new Error(`unsafe name: ${name}`);
    if (name.endsWith("/")) { out.push({ name, dir: true }); continue; }
    if (buf.readUInt32LE(local) !== 0x04034b50) throw new Error("bad local header");
    const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const raw = buf.subarray(start, start + csize);
    const data = method === 0 ? Buffer.from(raw) : method === 8 ? zlib.inflateRawSync(raw) : null;
    if (!data) throw new Error(`unsupported method ${method}`);
    if (data.length !== usize) throw new Error(`size mismatch: ${name}`);
    total += data.length;
    if (total > MAX_BYTES) throw new Error("too large");
    out.push({ name, data });
  }
  return out;
}

// Unpack into `dir`, which must not exist yet or be empty. Returns the number of files.
export function extractTo(entries, dir) {
  if (fs.existsSync(dir) && fs.readdirSync(dir).length) throw Object.assign(new Error("not empty"), { code: "NOT_EMPTY" });
  fs.mkdirSync(dir, { recursive: true });
  const root = path.resolve(dir);
  let files = 0;
  for (const e of entries) {
    const abs = path.resolve(root, e.name);
    const r = path.relative(root, abs);
    if (!r || r.startsWith("..") || path.isAbsolute(r)) throw new Error(`unsafe name: ${e.name}`);
    if (e.dir) { fs.mkdirSync(abs, { recursive: true }); continue; }
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, e.data);
    files++;
  }
  return files;
}

const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

// Get the template (download, or the learner's own zip), check it, unpack it. `fetchZip` and `digests`
// can be replaced in a test; the command line always uses the pinned values.
export async function scaffoldArc42({ dir, lang = "nl", withHelp = false, from = null, digests = ARC42_DIGESTS, fetchZip = null }) {
  const asset = arc42Asset(lang, withHelp);
  const url = arc42Url(asset);
  const want = digests[asset];
  if (!want) throw new Error(`no digest for ${asset}`);
  let buf;
  if (from) buf = fs.readFileSync(from);
  else if (fetchZip) buf = await fetchZip(url);
  else {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}`), { code: "DOWNLOAD" });
    buf = Buffer.from(await res.arrayBuffer());
  }
  const got = sha256(buf);
  if (got !== want) throw Object.assign(new Error(`sha256 ${got} ≠ ${want}`), { code: "DIGEST" });
  const files = extractTo(readZip(buf), dir);
  return { asset, url, sha256: got, files, release: ARC42_RELEASE };
}

async function main(argv) {
  const [kind, folder, ...rest] = argv;
  if (kind !== "arc42" || !folder || folder.startsWith("-")) { console.log(t("cli.scaffold.usage")); process.exit(kind === "--help" || kind === "-h" ? 0 : 1); }
  let lang = null, withHelp = false, from = null;
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === "--lang") lang = rest[++i];
    else if (a === "--with-help" || a === "--help") withHelp = true;
    else if (a === "--from") from = rest[++i];
    else { console.error(t("cli.scaffold.usage")); process.exit(1); }
  }
  if (lang === null) { try { lang = settingsOf(loadSkills()).language; } catch { lang = "nl"; } }
  if (!["nl", "en"].includes(lang)) { console.error(t("cli.scaffold.usage")); process.exit(1); }
  const dir = path.resolve(process.cwd(), folder);
  try {
    const r = await scaffoldArc42({ dir, lang, withHelp, from });
    console.log(t("cli.scaffold.done", { files: r.files, dir: folder, release: r.release, asset: r.asset, url: r.url, sha: r.sha256 }));
  } catch (e) {
    const key = e.code === "NOT_EMPTY" ? "cli.scaffold.notEmpty" : e.code === "DIGEST" ? "cli.scaffold.digest" : e.code === "DOWNLOAD" ? "cli.scaffold.download" : "cli.scaffold.failed";
    console.error(t(key, { dir: folder, error: String(e.message).slice(0, 200) }));
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main(process.argv.slice(2));
