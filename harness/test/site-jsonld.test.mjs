// site-jsonld.mjs: FAQPage and DefinedTermSet from the page's own HTML, added to its JSON-LD.
import { test } from "node:test";
import assert from "node:assert/strict";
import { enrich, faqItems, termItems, textOf } from "../site-jsonld.mjs";

const ld = (mainEntity) => `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": [
  { "@type": "WebSite", "@id": "https://x.test/#website" },
  { "@type": "WebPage", "@id": "https://x.test/p/#webpage", url: "https://x.test/p/", name: "Key terms", inLanguage: "en", isPartOf: { "@id": "https://x.test/#website" }, ...(mainEntity ? { mainEntity } : {}) },
] })}</script>`;
const page = (body, mainEntity) => `<html><head>${ld(mainEntity)}</head><body>
<nav><h2 id="frequently-asked-questions">not the article</h2></nav>
<article class="md-content__inner md-typeset">${body}</article></body></html>`;
const graphOf = (html) => JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1].replace(/\\u003c/g, "<"))["@graph"];

const FAQ = `<h1>Title</h1><p>Intro.</p>
<h2 id="frequently-asked-questions">Frequently asked questions<a class="headerlink" href="#frequently-asked-questions">&para;</a></h2>
<h3 id="is-it-free">Is it free?<a class="headerlink" href="#is-it-free">&para;</a></h3>
<p>Yes. The code is <code>AGPL-3.0</code> &amp; open.</p><p>No account.</p>
<h3 id="does-it-block">Does it block <code>Write</code>?</h3><ul><li>At L1&ndash;L3.</li></ul>
<h2 id="get-started">Get started</h2><h3 id="not-a-question">Not a question</h3><p>Install.</p>`;

test("textOf drops tags and the permalink, decodes entities and keeps paragraphs apart", () => {
  assert.equal(textOf(`<p>a <code>b</code>.</p><p>c &amp; d&nbsp;e</p><a class="headerlink" href="#x">&para;</a>`), "a b. c & d e");
  assert.equal(textOf("L1&ndash;L3 &#8211; &#x2013;"), "L1–L3 – –");
});

test("faqItems: the h3s of the FAQ section in the article, up to the next h2", () => {
  assert.deepEqual(faqItems(page(FAQ)), [
    { question: "Is it free?", answer: "Yes. The code is AGPL-3.0 & open. No account." },
    { question: "Does it block Write?", answer: "At L1–L3." },
  ]);
  assert.equal(faqItems(page(FAQ.replace(/frequently-asked-questions/g, "veelgestelde-vragen"))).length, 2, "Dutch id");
  assert.deepEqual(faqItems(page("<h2 id=\"other\">Other</h2><h3 id=\"q\">Q?</h3><p>A.</p>")), []);
});

test("termItems: every h2 of the article with its first paragraph", () => {
  const body = `<p>Intro.</p><h2 id="never-skilling">Never-skilling<a class="headerlink" href="#never-skilling">&para;</a></h2>
<p><strong>Never-skilling</strong> is not building a skill.</p><p>Second.</p><h2 id="empty">Empty</h2><h2 id="hint-ladder">Hint ladder</h2><p>Help in rungs.</p>`;
  assert.deepEqual(termItems(page(body)), [
    { id: "never-skilling", name: "Never-skilling", description: "Never-skilling is not building a skill." },
    { id: "hint-ladder", name: "Hint ladder", description: "Help in rungs." },
  ]);
});

test("enrich adds a FAQPage, and a DefinedTermSet only when the WebPage asks for #terms", () => {
  const graph = graphOf(enrich(page(FAQ)));
  const faq = graph.find((n) => n["@type"] === "FAQPage");
  assert.equal(faq["@id"], "https://x.test/p/#faq");
  assert.equal(faq.mainEntity.length, 2);
  assert.equal(faq.mainEntity[0].acceptedAnswer["@type"], "Answer");
  assert.ok(!graph.some((n) => n["@type"] === "DefinedTermSet"));

  const terms = graphOf(enrich(page(`<h2 id="t">T</h2><p>A term.</p>`, { "@id": "https://x.test/p/#terms" })));
  const set = terms.find((n) => n["@type"] === "DefinedTermSet");
  assert.equal(set.name, "Key terms");
  assert.deepEqual(set.hasDefinedTerm[0], { "@type": "DefinedTerm", "@id": "https://x.test/p/#t", url: "https://x.test/p/#t", name: "T", description: "A term.", inDefinedTermSet: { "@id": "https://x.test/p/#terms" } });

  assert.equal(enrich(page("<p>Nothing.</p>")), null, "unchanged pages are left alone");
  assert.equal(enrich("<html><head></head><body></body></html>"), null, "no JSON-LD: nothing to do");
});

test("text from the page cannot close the script: <, > and & are escaped", () => {
  const out = enrich(page(`<h2 id="frequently-asked-questions">FAQ</h2><h3 id="q">Q?</h3><p>&lt;/script&gt;&lt;b&gt; &amp;</p>`));
  const json = out.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
  assert.ok(!json.includes("</script"));
  assert.ok(json.includes("\\u003c/script\\u003e"));
});
