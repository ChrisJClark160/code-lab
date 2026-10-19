# Code Lab reference

Everything a lab folder can contain, and every helper the engine gives you. The `starter/`
folder uses all of it.

## Lab folder

| File | Required | Contents |
|---|---|---|
| `lab.json` | yes | `{"title", "subtitle", "storage_key", "pass_message"}` |
| `lessons.html` | yes | The lesson `<section>` blocks, in order. Don't add Flashcards or Final check: the template adds them. |
| `quiz.js` | yes | `var QUIZ = { <lessonId>: [ ...questions ] };` |
| `decks.js` | yes | `var DECKS = [ { id, name, cards: [[front, back], ...] } ];` |
| `names.js` | no | `var NAMES = { "<real name>": ["<plain name>", "<job>", "<group>"] };` |
| `widgets.js` | no | Lesson code: `flowNodes`, `bugs`, `fab`, code snippets, simulators, task wiring |
| `extra.css` | no | Extra CSS. Use the theme tokens, such as `var(--panel)` and `var(--ok)` |

The JS files are pasted inside one function, so write them as plain statements (`var`,
`function`) indented two spaces. Don't wrap them in a module.

## HTML conventions

```html
<section class="lesson" data-id="flow" data-title="Rail label" hidden>
  <div class="lesson-head">
    <div class="eyebrow">Lesson 1 · About 30 minutes</div>
    <h2>Lesson heading</h2>
    <p class="lede">One or two sentences: what this part of the code does.</p>
  </div>

  <div class="card"><h3>Teaching card</h3><div class="prose"><p>...</p></div></div>

  <div class="task" data-task="unique-id">
    <div class="task-h"><span class="tag">Do it</span><h3>Task title</h3><span class="tick">Done</span></div>
    ...widget markup...
    <div class="fb" data-fb="unique-id"></div>
  </div>
</section>
```

- `data-id` must be unique. The first lesson's id is the default page. Don't use `cards` or `final`.
- Each `data-task` counts towards the progress bar, and its id must be unique across the page.
- Useful classes: `card`, `prose`, `steps` (an `<ol>` with numbered markers), `note`, `scroll` (wraps a wide table),
  `table.t`, `td.wrap`, `pill p-3` (green), `p-1` (red), `p-0` (amber), `p-4` (grey), `codecap`, `code`,
  `out` (dark output box), `row`, `btn`, `btn ghost sm`, `two` (two columns), `svgwrap` and SVG classes
  `box`, `box o`, `box src`, `box empty`, `ln`, `ln dash`, `hd`, `sm`, `on-o`, and `<marker id="ah">`.
- `<code>real_name</code>` anywhere outside a `.code` block gets its plain name from `NAMES`.

## Built-in widget hosts

| Put this in lessons.html | Define in widgets.js | Result |
|---|---|---|
| `<div class="flowgrid"><div class="flow" id="flow"></div><div class="card detail" id="flowDetail">...</div></div>` | `var flowNodes = [{ t: "Type", n: "real name", h: "plain name (optional)", nb: true, d: "<p>detail html</p>" }]` | A clickable run diagram. `nb: true` draws a dashed box. |
| `<div class="cast" id="cast"></div>` | (uses `NAMES`) | A searchable "Who's who", grouped by the third field |
| `<div id="bugList" style="display:grid;gap:22px"></div>` | `var bugs = [{ id, title, start, line: [i, ...], src: [lines], why: "html" }]` | Click the bad line. `line` is 0-based within `src`. The answer is shown after 2 misses. |
| `<div id="fabTasks" style="display:grid;gap:18px"></div>` | `var fab = [{ id, title, how: "html", lang, code, after }]` | Hands-on tasks with a copy button and an "I have done this" tick |
| `<div class="mcq" data-mcq="q1">` with `<p class="q">`, `<button>`s (one with `data-right`) and `<div class="fb">`, inside a `.task` | nothing | Multiple choice. The task completes when every `.mcq` in it is right. |

## Helpers you can call in widgets.js

| Helper | Does |
|---|---|
| `$(sel, root)`, `$$(sel, root)` | querySelector, and querySelectorAll as an array |
| `esc(s)` | HTML-escape |
| `fb(el, "ok" or "bad" or "info", html)` | Show a feedback box |
| `complete(taskId)` | Mark a task done, save, and repaint the progress |
| `state.done[id]` | Whether a task is done. `save()` persists `state`. |
| `code(sel, [lines], startLine)` | Render a highlighted Python-style snippet with line numbers |
| `renderCode(el, src, start)` | The same, from a string |
| `orderTask(poolSel, pickedSel, fbSel, steps, taskId, okMsg)` | Click-in-order chips. A wrong click resets. Needs `<div class="row" id=...>` for the pool and the picked list, plus a `.fb`. |
| `predictTable(hostSel, taskId, options, rows)` | A dropdown per row. `rows = [[html, correctIndex, why], ...]` |
| `shuffle(arr)` | Shuffled copy |
| `nm(real)` | HTML for "plain name [real name]" |

Write widget code as `(function () { ... })();` blocks, so each one's variables stay private.

## Quiz question types

```js
{ id: "q1", type: "mc", q: "...", options: ["a", "b"], answer: 1, why: "..." }
{ id: "q2", type: "multi", q: "...", options: [...], answers: [0, 2], why: "..." }
{ id: "q3", type: "match", q: "...", pairs: [["left", "right"], ...], why: "..." }   // 3 to 5 pairs
{ id: "q4", type: "order", q: "...", items: ["first", "second", ...], why: "..." }  // items in correct order
{ id: "q5", type: "text", q: "...", accept: ["answer", "alt"], hint: "...", why: "..." }  // case, spaces and quotes ignored
```

Question ids must be unique across the whole lab. `why` is shown when the answer is right, and
`hint` after a wrong try.

## Flashcards

`[front, back]`. Text in backticks renders as code, and a real name from `NAMES` gets its plain
name. A deck whose `id` matches a lesson's `data-id` adds a "Revise with flashcards" card to
that lesson.

Don't write the plain name yourself before a backticked real name ("Step list `CONFIG.Processes`").
The engine adds it, so it would show twice. `test.js` fails on this.

The engine adds two decks. "Who's who" has one card per `NAMES` entry, showing
"Plain name [real name]" on both sides; the front asks "What does it do?" and the back gives the
job. "Everything, mixed" holds every card.

**Printing.** "Print this deck" sits under the deck picker. It prints the chosen deck in black and
white on A4, 8 cards a page (95 x 68 mm) with dashed cut lines. Each fronts sheet is followed by
its backs sheet with the columns swapped, so a double-sided print with "flip on long edge" puts
every answer behind its question. Every card shows its deck and number on both sides. Long
answers get a smaller font.

The claude.ai viewer frames the page and ignores `window.print()`. So when
`claude.use("downloads")` resolves, the button saves a standalone print-ready HTML file
("<lab> - <deck> flashcards.html") that opens the print window when the learner opens it.
Publish the page with `capabilities: {downloads: true}` for this to work. Anywhere else (a local
file, another host) the button prints in place. The card CSS lives in `<style id="fcpCss">` so
the saved file can carry it: keep every `.fcp` rule there.

## Theme

Every colour is a token on `:root`, with a dark set under `prefers-color-scheme` and
`[data-theme]`. The defaults are an orange masthead (`--orange`) and dark blue (`--blue`). To
rebrand a lab, override the tokens in `extra.css`. Redefine both the light and the dark values.
