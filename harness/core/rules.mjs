// Static deny rules from the record (opencode plan, Security model layer 2). An adapter that can set final
// deny rules per session (opencode: ctx.session.update({ permissions })) writes these, so no other plugin can
// undo them. The evaluate hook (core/guard.mjs) stays the judge for everything a pattern cannot express.
//
// A final deny cannot be corrected when it fires, so this list only holds rules that are certainly right:
//   - code files in the paths of a skill whose effective level is L2 or L3, without an override;
//   - graded work and its AI-use log (no writes there, at any level).
// It leaves out L1 (the TODO(human) rule needs the diff), unmapped files (defaultLevel), and every path that
// may overlap with a skill at another level or with an override: there a missing rule is safe, because the
// evaluate hook still decides. The record files and the harness are protected by the installer's policies
// (layer 1), not here.
//
// Result: { rules: [{ action: "edit", pattern, why: "skill" | "graded", skill? }], hash, validUntil }.
// Patterns are globs, project-relative for skills and absolute (forward slashes) for graded work. `hash` changes
// whenever the rules change; `validUntil` (ms) is when they must be recomputed even if the record did not change
// (the next local midnight, for reviews that fall due, or the end of the first active override).
import crypto from "node:crypto";
import { settingsOf, DEFAULT_SETTINGS, effectiveLevel, PROTECTED, gradedOf, loadOverrides } from "./lib.mjs";

// The literal start of a glob, up to its first wildcard: two patterns may overlap when one starts the other.
const literal = (pat) => String(pat).split(/[*?[{]/)[0].toLowerCase();
const mayOverlap = (a, b) => { const x = literal(a), y = literal(b); return x.startsWith(y) || y.startsWith(x); };

function codeExtensions(data) {
  const v = settingsOf(data).codeExtensions;
  return (Array.isArray(v) ? v : DEFAULT_SETTINGS.codeExtensions).map((e) => String(e).replace(/^\./, "")).filter((e) => /^[\w-]+$/.test(e));
}

function nextMidnight(now) {
  const d = new Date(now);
  d.setHours(24, 0, 0, 0);
  return d.getTime();
}

export function staticDenyRules(data, now = Date.now()) {
  const overrides = loadOverrides();
  const all = overrides.some((o) => o.skill === "*");
  const overridden = new Set(overrides.map((o) => o.skill));
  const skills = Array.isArray(data?.skills) ? data.skills : [];
  const level = new Map(skills.map((s) => [s.id, effectiveLevel(data, s)]));
  const exts = codeExtensions(data);
  const rules = [];

  if (!all) {
    for (const s of skills) {
      const lv = level.get(s.id);
      if (lv !== "L2" && lv !== "L3") continue;
      if (overridden.has(s.id)) continue;
      for (const pat of s.paths ?? []) {
        if (typeof pat !== "string" || !pat.trim()) continue;
        // Another skill that may share these files and is not protected the same way: leave it to the hook.
        const clash = skills.some((o) => o !== s && (o.paths ?? []).some((q) => typeof q === "string" && mayOverlap(pat, q))
          && (!PROTECTED.has(level.get(o.id)) || level.get(o.id) === "L1" || overridden.has(o.id)));
        if (clash) continue;
        if (/\*\*$/.test(pat)) for (const e of exts) rules.push({ action: "edit", pattern: `${pat}/*.${e}`, why: "skill", skill: s.id });
        else if (exts.some((e) => pat.toLowerCase().endsWith(`.${e.toLowerCase()}`))) rules.push({ action: "edit", pattern: pat, why: "skill", skill: s.id });
      }
    }
  }

  const G = gradedOf(data);
  if (G) {
    for (const p of [...G.paths, G.logDir]) {
      rules.push({ action: "edit", pattern: /[*?]/.test(p) ? p : `${p}/**`, why: "graded" });
      if (!/[*?]/.test(p)) rules.push({ action: "edit", pattern: p, why: "graded" });
    }
  }

  const ends = overrides.map((o) => Date.parse(o.until)).filter((t) => t > now);
  const validUntil = Math.min(nextMidnight(now), ...ends);
  const hash = crypto.createHash("sha256").update(JSON.stringify(rules)).digest("hex").slice(0, 16);
  return { rules, hash, validUntil };
}
