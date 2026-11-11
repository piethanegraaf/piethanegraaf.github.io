// The poll on the home page. The question, the answers and the texts are in the page itself (docs/*/index.md),
// so search engines and AI assistants can read them. This script only:
// - counts a vote as an anonymous GoatCounter event (count.js, no cookies), one vote per browser;
// - shows the totals from GoatCounter's public counter, which caches them for up to four hours, so the
//   visitor's own vote is added on screen as long as the counter does not show it yet;
// - then asks for the visitor's role, counted the same way.
// Text goes into the page with textContent only. Without GoatCounter or storage the poll still works.
(function () {
  var poll = document.querySelector(".poll[data-poll]");
  if (!poll) return;

  var id = poll.getAttribute("data-poll");
  var COUNTER = "https://piethanegraaf.goatcounter.com/counter/";
  var KEY = "poll:" + id, ROLE_KEY = "poll:" + id + ":role";
  var answers = [].slice.call(poll.querySelectorAll(".poll__answers button[data-answer]"));
  var roles = [].slice.call(poll.querySelectorAll(".poll__roles button[data-role]"));
  var roleBox = poll.querySelector(".poll__role");
  var result = poll.querySelector(".poll__result");
  var t = function (name) { return poll.getAttribute("data-t-" + name) || ""; };

  function load(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } }
  function save(key, value) { try { window.localStorage.setItem(key, value); } catch (e) { /* private mode */ } }

  // count.js is deferred; at the moment of a click it has normally loaded. Blocked or missing: no count.
  function count(path, title) {
    var gc = window.goatcounter;
    if (gc && typeof gc.count === "function") gc.count({ path: path, title: title, event: true });
  }
  function answerPath(a) { return "poll-" + id + "-" + a; }

  function fetchCount(a) {
    return fetch(COUNTER + encodeURIComponent(answerPath(a)) + ".json", { credentials: "omit" })
      .then(function (r) {
        if (r.status === 404) return 0;  // no votes for this answer yet
        if (!r.ok) throw new Error("counter " + r.status);
        return r.json();
      })
      .then(function (j) { return j ? parseInt(String(j.count).replace(/[^0-9]/g, ""), 10) || 0 : 0; });
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  // The counter is cached for hours. The vote that was just cast is added once; on a later visit the
  // visitor's own vote is added as long as the counter still shows 0 for that answer.
  function showResults(mine, justVoted) {
    answers.forEach(function (b) { b.disabled = true; b.setAttribute("aria-pressed", b.getAttribute("data-answer") === mine ? "true" : "false"); });
    poll.classList.add("poll--voted");
    result.hidden = false;
    while (result.firstChild) result.removeChild(result.firstChild);
    result.appendChild(el("p", "poll__status", t("loading")));
    Promise.all(answers.map(function (b) { return fetchCount(b.getAttribute("data-answer")); }))
      .then(function (counts) {
        counts = counts.map(function (n, i) {
          return answers[i].getAttribute("data-answer") === mine && (justVoted || n === 0) ? n + 1 : n;
        });
        var total = counts.reduce(function (a, b) { return a + b; }, 0);
        while (result.firstChild) result.removeChild(result.firstChild);
        if (!total) { result.appendChild(el("p", "poll__status", t("unavailable"))); return; }
        result.appendChild(el("p", "poll__status", total === 1 && t("results-one") ? t("results-one") : t("results").replace("{n}", String(total))));
        var list = el("ul", "poll__bars");
        answers.forEach(function (b, i) {
          var pct = Math.round((counts[i] / total) * 100);
          var item = el("li", b.getAttribute("data-answer") === mine ? "poll__bar poll__bar--mine" : "poll__bar");
          item.appendChild(el("span", "poll__label", b.textContent + (b.getAttribute("data-answer") === mine ? " (" + t("yours") + ")" : "")));
          var track = el("span", "poll__track");
          var fill = el("span", "poll__fill");
          fill.style.width = pct + "%";
          track.appendChild(fill);
          item.appendChild(track);
          item.appendChild(el("span", "poll__pct", pct + "% (" + counts[i] + ")"));
          list.appendChild(item);
        });
        result.appendChild(list);
        result.appendChild(el("p", "poll__note", t("delay")));
      })
      .catch(function () {
        while (result.firstChild) result.removeChild(result.firstChild);
        result.appendChild(el("p", "poll__status", t("unavailable")));
      });
    if (roleBox && !load(ROLE_KEY)) roleBox.hidden = false;
  }

  answers.forEach(function (b) {
    b.addEventListener("click", function () {
      if (load(KEY)) return;
      var a = b.getAttribute("data-answer");
      count(answerPath(a), "Poll " + id + ": " + b.textContent);
      save(KEY, a);
      showResults(a, true);
      if (roleBox && !roleBox.hidden) { var first = roleBox.querySelector("button"); if (first) first.focus({ preventScroll: true }); }
    });
  });

  roles.forEach(function (b) {
    b.addEventListener("click", function () {
      var r = b.getAttribute("data-role");
      count("poll-" + id + "-role-" + r, "Poll " + id + ", role: " + b.textContent);
      save(ROLE_KEY, r);
      while (roleBox.firstChild) roleBox.removeChild(roleBox.firstChild);
      roleBox.appendChild(el("p", "poll__thanks", t("thanks")));
    });
  });

  var earlier = load(KEY);
  if (earlier) showResults(earlier, false);
})();
