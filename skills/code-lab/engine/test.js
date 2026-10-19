// Smoke test for a built Code Lab page.
// Usage: node test.js <page.html>     (needs jsdom: npm install jsdom in the folder you run from)
//
// Checks: no script errors, every lesson opens, every quiz renders, the final test has 12
// questions, task ids are unique, flashcards flip and grade, and no plain name is written
// twice. Exit code 1 on any failure.
const { JSDOM, VirtualConsole } = require("jsdom");
const fs = require("fs");

const html = fs.readFileSync(process.argv[2], "utf8");
const vc = new VirtualConsole(), errs = [], out = [];
vc.on("jsdomError", e => errs.push(e.message));
vc.on("error", e => errs.push(String(e)));
const dom = new JSDOM("<!doctype html><html><head></head><body>" + html + "</body></html>",
  { runScripts: "dangerously", url: "https://example.org/", virtualConsole: vc, pretendToBeVisual: true });
const w = dom.window, d = w.document;
w.scrollTo = () => {};
w.print = () => {};
const $ = s => d.querySelector(s), $$ = s => [...d.querySelectorAll(s)];
const fail = m => errs.push("FAIL: " + m);

setTimeout(() => {
  try {
    const lessons = $$("section.lesson");
    out.push("lessons: " + lessons.length + " | " + $("#ptext").textContent + " | plain names shown: " + $$(".hn").length);
    if ($$("#rail [data-go]").length !== lessons.length) fail("rail buttons do not match lessons");
    lessons.forEach(s => {
      d.querySelector('#rail [data-go="' + s.dataset.id + '"]').click();
      if (s.hidden) fail("lesson did not open: " + s.dataset.id);
    });
    const ids = $$("[data-task]").map(t => t.dataset.task);
    const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
    if (dup.length) fail("duplicate data-task ids: " + dup.join(", "));
    out.push("quiz tasks: " + $$(".task.quiz").length + " | questions: " + $$(".task.quiz .qz").length + " | final: " + $$("#finalHost .qz").length);
    if ($$("#finalHost .qz").length !== Math.min(12, $$(".task.quiz .qz").length)) fail("final test did not get 12 questions");
    // flashcards
    if ($$("#fcDecks .deck").length) {
      $$("#fcDecks .deck")[0].click(); $("#fcReveal").click(); $("#fcGot").click();
      out.push("decks: " + $$("#fcDecks .deck").length);
      // printable deck: two sheets (fronts, backs) per 8 cards
      const nCards = +$$("#fcDecks .deck")[0].querySelector(".dk").textContent.split("/")[1];
      $("#fcPrint").click();
      const sheets = $$("#fcPrintBox .fcp-sheet").length;
      out.push("print sheets: " + sheets + " for " + nCards + " cards");
      if (sheets !== 2 * Math.ceil(nCards / 8)) fail("print sheets do not match the deck size");
      if ($$("#fcPrintBox .fcp-card:not(.blank)").length !== 2 * nCards) fail("print cards do not match the deck size");
    } else fail("no flashcard decks");
    // every quiz question renders a body
    $$(".task.quiz .qz").forEach((q, i) => { if (!q.querySelector(".qz-body").children.length) fail("empty quiz question " + i); });
    // annotate never leaves a plain name before its own code (doubled names)
    $$(".hn").forEach(h => {
      const prev = h.previousSibling, name = h.querySelector("b").textContent;
      if (prev && prev.nodeType === 3 && prev.textContent.trim().endsWith(name)) fail("plain name written twice before " + h.textContent);
    });
  } catch (e) { errs.push("TEST: " + e.stack); }
  console.log(out.join("\n"));
  console.log(errs.length ? "PROBLEMS:\n" + errs.join("\n") : "OK: no problems");
  process.exit(errs.length ? 1 : 0);
}, 500);
