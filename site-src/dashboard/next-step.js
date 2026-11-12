// The step to the next level, for the dashboard: the same criteria and the same tasks as the harness
// (harness/hooks/lib.mjs: promotionWindow and stepUp). harness/test/next-step.test.mjs checks on
// exported data that this file and the harness agree, so the dashboard never promises a proposal the
// harness does not make. No DOM here: app.js draws it.
(function (root) {
  "use strict";
  var LEVELS = ["L0", "L1", "L2", "L3", "L4"];
  var rung = function (x) { return x.maxRung || 0; };
  var solved = function (x) { return Boolean(x.success) && rung(x) <= 2; };

  // The moment of the last level change. Newer exports give it as windowSince (the harness's own
  // lastLevelChange); older exports give changedAt per history entry, or only the day.
  function lastChange(s) {
    if (s.windowSince !== undefined) return s.windowSince;
    var h = (s.history || []).filter(function (x) { return x.to; })
      .map(function (x) { return x.changedAt || x.atIso || x.at; }).filter(Boolean).sort();
    return h.length ? h[h.length - 1] : null;
  }

  // The evidence: the last 10 explained tasks of the family since the last level change, plus the task
  // that placed the skill (setup review of 12 Nov, #36 a).
  function windowOf(s, tasks, family) {
    var since = lastChange(s);
    var placed = s.placementTask || null;
    return tasks.filter(function (x) {
      return family.has(x.skill) && x.explained && !x.lapsed && !x.void && (!since || String(x.at) > since || (placed && x.id === placed));
    }).slice(-10);
  }

  // L2 -> L3: at least 5 tasks, about 85% solved (rung <= 2), and at least half with hint 0-1.
  function l2(tasks, target) {
    var n = tasks.length;
    var ok = tasks.filter(solved).length;
    var low = tasks.filter(function (x) { return x.success && rung(x) <= 1; }).length;
    return { n: n, ok: ok, low: low, enough: n >= 5, rate: n > 0 && ok / n >= target, half: n > 0 && low * 2 >= n,
      met: n >= 5 && ok / n >= target && low * 2 >= n };
  }

  // { kind: "placement" | "maintain" | "count" | "rate", to, since, met, ... } or null (a zone).
  function nextStep(s, opts) {
    var tasks = opts.tasks || [], transfers = opts.transfers || [], family = opts.family, target = opts.target || 0.85;
    if (!s || s.kind === "zone") return null;
    if (s.placement === "pending") return { kind: "placement" };
    if (s.level === "L4" || LEVELS.indexOf(s.level) < 0) return { kind: "maintain" };
    var since = lastChange(s);
    var win = windowOf(s, tasks, family);
    var to = LEVELS[LEVELS.indexOf(s.level) + 1];
    if (s.level === "L0") {
      // Two examples explained and predicted correctly: two explained, successful tasks.
      var ex = win.filter(function (x) { return x.success; }).length;
      return { kind: "count", to: to, since: since, have: Math.min(ex, 2), need: 2, met: ex >= 2 };
    }
    if (s.level === "L1") {
      // Three gaps filled with at most one hint each: three tasks at rung 0-1.
      var gaps = win.filter(function (x) { return x.success && rung(x) <= 1; }).length;
      return { kind: "count", to: to, since: since, have: Math.min(gaps, 3), need: 3, met: gaps >= 3 };
    }
    if (s.level === "L2") {
      var r = l2(win, target);
      // How many more tasks with hint 0-1 it takes (older tasks drop out of the last 10).
      var more = 0;
      for (var k = 1; !r.met && k <= 10; k++) {
        var sim = win.concat(Array.from({ length: k }, function () { return { success: true, maxRung: 0 }; })).slice(-10);
        if (l2(sim, target).met) { more = k; break; }
      }
      return { kind: "rate", to: to, since: since, n: r.n, ok: r.ok, low: r.low, enough: r.enough, rate: r.rate, half: r.half,
        target: target, more: more, met: r.met };
    }
    // L3 -> L4: three times independent (rung 0) on at least 2 days, the passed transfer task being one
    // of the three, and its day a day (#36 b). Without it, two tasks without a hint are enough to do it.
    var solo = win.filter(function (x) { return x.success && rung(x) === 0; });
    var days = {};
    solo.forEach(function (x) { days[String(x.at).slice(0, 10)] = true; });
    var passed = transfers.filter(function (tr) { return tr.passed && tr.skill === s.id && (!since || String(tr.at) > since); }).pop();
    if (passed) days[String(passed.at).slice(0, 10)] = true;
    var nDays = Object.keys(days).length;
    var n = solo.length + (passed ? 1 : 0);
    return { kind: "count", to: to, since: since, have: Math.min(n, 3), need: 3, solo: solo.length, days: nDays,
      transfer: Boolean(passed), transferNext: !passed && solo.length >= 2, met: Boolean(passed) && n >= 3 && nDays >= 2 };
  }

  root.NextStep = { nextStep: nextStep, lastChange: lastChange, windowOf: windowOf };
})(typeof window !== "undefined" ? window : globalThis);
