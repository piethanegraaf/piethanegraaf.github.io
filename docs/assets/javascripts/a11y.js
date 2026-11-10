// Keyboard access to scroll areas (WCAG 2.1.1): wide tables and long code blocks scroll sideways,
// so they must be focusable. Only areas that really overflow get tabindex="0" and a name.
(function () {
  var lang = (document.documentElement.lang || "nl").slice(0, 2);
  var names = { table: lang === "en" ? "Table, scrollable" : "Tabel, scrollbaar", code: lang === "en" ? "Code, scrollable" : "Code, scrollbaar" };
  function mark() {
    var areas = document.querySelectorAll(".md-typeset__scrollwrap, .md-typeset pre > code, .md-typeset pre.mermaid > code");
    for (var i = 0; i < areas.length; i++) {
      var el = areas[i];
      if (el.hasAttribute("data-a11y-scroll")) continue;
      if (el.scrollWidth <= el.clientWidth + 1 && el.scrollHeight <= el.clientHeight + 1) continue;
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "region");
      el.setAttribute("aria-label", el.classList.contains("md-typeset__scrollwrap") ? names.table : names.code);
      el.setAttribute("data-a11y-scroll", "");
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mark); else mark();
  window.addEventListener("resize", mark);
})();
