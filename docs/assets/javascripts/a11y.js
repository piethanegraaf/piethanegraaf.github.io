// Accessibility fixes on top of MkDocs Material.
(function () {
  var lang = (document.documentElement.lang || "nl").slice(0, 2);
  var en = lang === "en";
  var T = {
    table: en ? "Table, scrollable" : "Tabel, scrollbaar",
    code: en ? "Code, scrollable" : "Code, scrollbaar",
    menu: "Menu",
    back: en ? ", back to the menu" : ", terug naar het menu"
  };

  // 1. Keyboard access to scroll areas (WCAG 2.1.1): wide tables and long code blocks scroll sideways,
  //    so they must be focusable. Only areas that really overflow get tabindex="0" and a name.
  function markScrollAreas() {
    var areas = document.querySelectorAll(".md-typeset__scrollwrap, .md-typeset pre > code, .md-typeset pre.mermaid > code");
    for (var i = 0; i < areas.length; i++) {
      var el = areas[i];
      if (el.hasAttribute("data-a11y-scroll")) continue;
      if (el.scrollWidth <= el.clientWidth + 1 && el.scrollHeight <= el.clientHeight + 1) continue;
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "region");
      el.setAttribute("aria-label", el.classList.contains("md-typeset__scrollwrap") ? T.table : T.code);
      el.setAttribute("data-a11y-scroll", "");
    }
  }

  // 2. Current page in the menu (WCAG 1.3.1 and 1.4.1): aria-current, so a screen reader says it,
  //    and a11y.css shows it with more than colour alone.
  function markCurrentPage() {
    var links = document.querySelectorAll(".md-nav--primary a.md-nav__link--active");
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      if (a.closest(".md-nav--secondary")) continue; // table of contents, not pages
      if (a.pathname === location.pathname) a.setAttribute("aria-current", "page");
    }
  }

  // 3. The menu on narrow screens (phone, or a desktop zoomed to 200-400%): Material shows it as a drawer
  //    that slides in, with a submenu per section. Its buttons are <label> elements without a name that the
  //    keyboard cannot reach, while Tab does walk through the links of the closed, invisible drawer
  //    (WCAG 2.1.1, 2.4.3, 2.4.7, 4.1.2). Here the labels become named buttons, and whatever is out of view
  //    becomes inert, so Tab only reaches what you can see.
  var narrow = window.matchMedia("(max-width: 76.234375em)");
  var drawer = document.getElementById("__drawer");
  var opener = document.querySelector('label.md-header__button[for="__drawer"]');
  var sidebar = document.querySelector(".md-sidebar--primary");
  var root = sidebar && sidebar.querySelector(".md-nav--primary");

  // The toggles that open a submenu: one per section, plus the table of contents of the current page.
  function menuToggles() {
    var out = [];
    var all = root ? root.querySelectorAll(".md-nav__item > input.md-nav__toggle") : [];
    for (var i = 0; i < all.length; i++) if (all[i].parentElement.querySelector(":scope > nav.md-nav")) out.push(all[i]);
    return out;
  }

  // Only on a narrow screen, and only if the submenu is shown at this width at all.
  function applies(t) {
    var sub = t.parentElement.querySelector(":scope > nav.md-nav");
    return narrow.matches && !!sub && getComputedStyle(sub).display !== "none";
  }

  function setButton(label, on, name) {
    if (on) {
      label.setAttribute("tabindex", "0");
      label.setAttribute("role", "button");
      if (name) label.setAttribute("aria-label", name);
    } else {
      label.removeAttribute("tabindex");
      label.removeAttribute("role");
      label.removeAttribute("aria-label");
      label.removeAttribute("aria-expanded");
    }
  }

  function setInert(el, on) {
    if (!el) return;
    if (on) { el.inert = true; el.setAttribute("data-a11y-inert", ""); }
    else if (el.hasAttribute("data-a11y-inert")) { el.inert = false; el.removeAttribute("data-a11y-inert"); }
  }

  function clearInert() {
    var els = document.querySelectorAll("[data-a11y-inert]");
    for (var i = 0; i < els.length; i++) setInert(els[i], false);
  }

  // One level of the drill-down menu: if a submenu is open, only that submenu can be reached.
  function syncLevel(nav) {
    var items = nav.querySelectorAll(":scope > .md-nav__list > .md-nav__item");
    var open = null;
    for (var i = 0; i < items.length; i++) {
      var t = items[i].querySelector(":scope > input.md-nav__toggle");
      var sub = items[i].querySelector(":scope > nav.md-nav");
      if (!t || !sub) continue;
      if (t.checked && getComputedStyle(sub).display !== "none") open = items[i];
      else setInert(sub, true);
    }
    setInert(nav.querySelector(":scope > .md-nav__title"), !!open);
    for (var j = 0; j < items.length; j++) {
      var item = items[j];
      if (item === open) {
        setInert(item.querySelector(":scope > label.md-nav__link"), true);
        setInert(item.querySelector(":scope > a.md-nav__link"), true);
        var child = item.querySelector(":scope > nav.md-nav");
        setInert(child, false);
        syncLevel(child);
      } else {
        setInert(item, !!open);
      }
    }
  }

  function syncMenu() {
    if (!drawer || !opener || !sidebar || !root) return;
    clearInert();
    var small = narrow.matches;
    setButton(opener, true, T.menu);
    opener.setAttribute("aria-expanded", drawer.checked ? "true" : "false");
    var toggles = menuToggles();
    for (var i = 0; i < toggles.length; i++) {
      var t = toggles[i];
      var on = applies(t);
      var label = t.parentElement.querySelector(":scope > label.md-nav__link");
      var back = t.parentElement.querySelector(":scope > nav.md-nav > label.md-nav__title");
      if (label) {
        setButton(label, on);
        if (on) label.setAttribute("aria-expanded", t.checked ? "true" : "false");
      }
      if (back) setButton(back, on, on ? back.textContent.trim() + T.back : null);
    }
    if (!small) return;
    if (!drawer.checked) { setInert(sidebar, true); return; }
    // The open drawer covers the page like a dialog: the page behind it is out of reach until it closes.
    var behind = document.querySelectorAll('[data-md-component="skip"], .md-header, .md-container > :not(main), .md-main > :not(.md-main__inner), .md-main__inner > :not(.md-sidebar--primary)');
    for (var b = 0; b < behind.length; b++) setInert(behind[b], true);
    syncLevel(root);
  }

  function firstFocusable() {
    var els = sidebar.querySelectorAll('a[href], [tabindex="0"]');
    for (var i = 0; i < els.length; i++) {
      if (!els[i].closest("[inert]") && els[i].getClientRects().length) return els[i];
    }
    return null;
  }

  // Enter and Space press the button. Material also clicks a focused label on Enter (on window), so the
  // event stops here: otherwise the toggle would flip twice.
  function pressable(label) {
    label.addEventListener("keydown", function (e) {
      if (label.getAttribute("role") !== "button") return;
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); label.click(); }
    });
  }

  // Move focus after the key event is done, so no other key handler acts on the new element. Without
  // preventScroll the browser scrolls the drawer sideways to a submenu that is still sliding in.
  function focusLater(get) {
    setTimeout(function () { var el = get(); if (el) el.focus({ preventScroll: true }); }, 0);
  }

  function setupMenu() {
    if (!drawer || !opener || !sidebar || !root) return;
    if (!sidebar.id) sidebar.id = "a11y-drawer";
    opener.setAttribute("aria-controls", sidebar.id);
    pressable(opener);
    var toggles = menuToggles();
    for (var i = 0; i < toggles.length; i++) {
      (function (t) {
        var label = t.parentElement.querySelector(":scope > label.md-nav__link");
        var back = t.parentElement.querySelector(":scope > nav.md-nav > label.md-nav__title");
        if (label) pressable(label);
        if (back) pressable(back);
        t.addEventListener("change", function () {
          syncMenu();
          if (!applies(t)) return;
          // Opened a submenu: go to its first item. Closed it: back to the section button.
          if (t.checked) focusLater(firstFocusable);
          else if (label) focusLater(function () { return label; });
        });
      })(toggles[i]);
    }
    drawer.addEventListener("change", function () {
      syncMenu();
      if (drawer.checked && narrow.matches) focusLater(firstFocusable);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.checked && narrow.matches) { opener.click(); focusLater(function () { return opener; }); }
    });
    if (narrow.addEventListener) narrow.addEventListener("change", syncMenu); else narrow.addListener(syncMenu);
    syncMenu();
  }

  function init() {
    markScrollAreas();
    markCurrentPage();
    setupMenu();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  window.addEventListener("resize", markScrollAreas);
})();
