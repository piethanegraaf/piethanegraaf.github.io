// GoatCounter counts visits without cookies and without personal data. This file only says where
// count.js sends the page views; it has to load before count.js (see extra_javascript in mkdocs.yml).
// count.js itself is self-hosted: CI downloads a pinned, integrity-checked copy (build-deploy.yml).
window.goatcounter = { endpoint: "https://piethanegraaf.goatcounter.com/count" };
