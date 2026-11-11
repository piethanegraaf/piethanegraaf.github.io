// Recognition patterns: Dutch and English are both always active.
import { test } from "node:test";
import assert from "node:assert/strict";
import * as P from "../hooks/patterns.mjs";

const cases = {
  HINT: {
    yes: ["ik zit vast", "hoe doe ik dit", "wat doe ik fout", "ik snap het niet", "I'm stuck", "how do I loop over a list",
      "why doesn't it compile", "I don't understand the constructor", "can't figure it out", "help"],
    no: ["dank je", "thanks", "why is encapsulation useful in general"],
  },
  SOLUTION: {
    yes: ["geef me de code", "schrijf het maar", "just write it", "give me the answer", "show me the solution", "do it for me"],
    no: ["ik wil het zelf doen", "I want to write it myself"],
  },
  SOLVED_STRONG: {
    yes: ["alle tests slagen", "tests zijn groen", "de test slaagt nu", "all tests pass", "all the tests are green", "the tests pass now", "tests are passing"],
    no: ["de tests falen", "the tests fail"],
  },
  SOLVED_WEAK: { yes: ["gelukt!", "het werkt", "it works", "fixed it", "got it working"], no: ["bijna", "almost"] },
  NOT_SOLVED: { yes: ["werkt nog niet", "niet gelukt", "doesn't work", "still failing", "not fixed"], no: ["het werkt"] },
  END: {
    yes: ["klaar voor vandaag", "ik stop", "doei", "done for today", "I'm done", "that's it for today", "see you tomorrow", "bye"],
    no: ["is de lus klaar?", "the loop is done when i reaches n"],
  },
  RESUME: { yes: ["toch niet", "ga door", "never mind", "keep going", "not done yet"], no: ["klaar"] },
  ATTEMPT: {
    yes: ["```int x = 1;```", "error CS0161", "Expected: 3 But was: 2", "ik denk dat de lus fout is", "ik heb geprobeerd",
      "I think the index is wrong", "I tried a while loop", "my guess is the constructor", "the test fails"],
    no: ["hoi", "hello"],
  },
  CHECKING: { yes: ["kun je kijken of het werkt", "check if it works", "see if the test passes"], no: ["het werkt"] },
  CAUSAL: {
    yes: ["omdat", "doordat de lus", "zodat", "because", "so that", "otherwise", "instead of", "therefore", "that's why"],
    no: ["het werkt gewoon", "it just works"],
  },
};

for (const [name, { yes, no }] of Object.entries(cases)) {
  test(`${name}: Dutch and English`, () => {
    for (const s of yes) assert.ok(P[name].test(s), `${name} should match: ${s}`);
    for (const s of no) assert.ok(!P[name].test(s), `${name} should not match: ${s}`);
  });
}

test("markers in both languages", () => {
  const rungs = [..."[trede 2] en [rung 4]".matchAll(P.RUNG_MARK)].map((m) => m[1]);
  assert.deepEqual(rungs, ["2", "4"]);
  const ex = [..."[uitleg-ok a1] [uitleg-nee b2] [explain-ok c3] [explain-no d4]".matchAll(P.EXPLAIN_MARK)].map((m) => `${m[1]}:${m[2]}`);
  assert.deepEqual(ex, ["ok:a1", "nee:b2", "ok:c3", "no:d4"]);
  assert.ok(P.sessionMarker("abc-1").test("<!-- sessie: abc-1 -->"));
  assert.ok(P.sessionMarker("abc-1").test("<!-- session: abc-1 -->"));
  assert.ok(!P.sessionMarker("abc-1").test("<!-- session: abc-12 -->"));
});

test("promotionAnswer: 'ja, doorzetten' (with an optional id) confirms, a bare 'nee' declines", () => {
  assert.deepEqual(P.promotionAnswer("ja, doorzetten"), { answer: "yes", id: null });
  assert.deepEqual(P.promotionAnswer("Ja doorzetten ood.klassen-properties"), { answer: "yes", id: "ood.klassen-properties" });
  assert.deepEqual(P.promotionAnswer("ja, zet maar door #demo.l2"), { answer: "yes", id: "demo.l2" });
  assert.deepEqual(P.promotionAnswer("yes, promote demo.l2"), { answer: "yes", id: "demo.l2" });
  for (const s of ["nee", "Nee.", "later", "nee, later", "niet doorzetten", "no", "not now"]) assert.deepEqual(P.promotionAnswer(s), { answer: "no", id: null }, s);
  for (const s of ["ja", "nee, de test faalt nog", "kun je ja, doorzetten uitleggen?", "doorzetten?", "no idea how"]) assert.equal(P.promotionAnswer(s), null, s);
});

test("TRANSFER_MARK: start, ok and nee/no with a skill id", () => {
  const found = [..."[transfer-start ood.x] [transfer-ok ood.x] [transfer-nee ood.x] [transfer-no a.b-c]".matchAll(P.TRANSFER_MARK)].map((m) => `${m[1]}:${m[2]}`);
  assert.deepEqual(found, ["start:ood.x", "ok:ood.x", "nee:ood.x", "no:a.b-c"]);
});
