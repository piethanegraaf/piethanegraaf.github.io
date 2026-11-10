// Old links pointed to the cheat sheet at https://piethanegraaf.github.io/#<section>.
// The cheat sheet now lives at /cheatsheet/. On the home page, an anchor that does not exist there goes to it.
(function () {
  var path = location.pathname;
  if (!location.hash || !(path === "/" || path === "/index.html")) return;
  var id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch (e) { return; }
  if (document.getElementById(id)) return;
  location.replace("/cheatsheet/" + location.hash);
})();
