---
name: code-lab
description: Build an interactive "Code Lab" web page that teaches someone how a codebase works - lessons in the order the code runs, plain-English names beside real file names, simulators, quizzes, a bug hunt, hands-on tasks, flashcards and a final test. Use when the user asks for a lab, course, tutorial, onboarding or training page for a repo, pipeline, workspace or system, or says "do the same as the code lab for X".
---

# Code Lab

A Code Lab is one self-contained HTML page. The engine (layout, progress, quizzes, flashcards,
final test) is in `engine/template.html`. You write only the lab's content into a folder, then
`engine/build.py` slots it in. Read `reference.md` before writing any content: it has every
file format, HTML convention and JS helper.

## Process

1. **Research the code first.** Read the repo's README, docs, handover notes and recent commits,
   then the code behind every claim you plan to make. Note real names (files, tables, functions,
   settings, status codes) and real rules, and the comments that say why a rule exists. Every
   fact in the lab must be checked against the code or docs. Leave out anything you can't check.
2. **Find out who it is for.** Their role and what they already know set the starting level.
   If the user hasn't said, ask once.
3. **Plan 6 to 10 lessons in the order the code runs.** A typical shape:
   - the run end to end (an entry point and every stage)
   - state and status (how work is queued, retried, logged)
   - one lesson per stage or layer
   - environments, config, secrets and safe running
   - a bug hunt
   - "do it for real": hands-on tasks on the real system
   Write each lesson's time estimate in its eyebrow.
4. **Teach before testing.** In each lesson, open with a lede, then teaching cards: steps,
   tables, a short code snippet, and the rule and why it exists. Then 1 to 3 hands-on tasks,
   then the quiz the engine adds from `QUIZ`. Never test something the lesson hasn't taught.
5. **Give everything a plain name.** In `NAMES`, give each real file, table, setting or function
   a plain name for the job it does ("The Tidier" for `tidy_csv.py`). Write only the real name
   in `<code>`, and the engine adds the plain name in front. Never write the plain name yourself
   just before the code, or it appears twice.
6. **Make tasks interactive and true to the code.** Use the built-in widgets (order chips,
   predict tables, multiple choice, a clickable run diagram, the bug hunt, hands-on checklists).
   Where a rule is logic, build a small simulator in `widgets.js` that runs a JS copy of the
   rule, and keep the copy faithful to the real code. Each task completes with `complete(id)`.
7. **Make the bug hunt real.** Use bugs from the repo's history (commit messages, comments such
   as "fixed", "was", "seen on"), simplified, and say they are simplified.
8. **Write the hands-on tasks against the real system, safely.** Use test or dev environments
   only, read-only queries, exact commands, and what the learner should see afterwards. Use
   placeholders for anything you don't know, such as a server address.
9. **Write the quiz and the decks.** Each lesson gets 5 to 7 questions in mixed types. The final
   test picks 12 at random, and 10 right is a pass. Each lesson gets a flashcard deck with the
   same `id` as the lesson, so its Revise button appears. The engine adds the "Who's who" deck
   from `NAMES` (both names on both sides) and the mixed deck, and a "Print this deck" button
   for black and white, double-sided cards to cut out (see reference.md).
10. **Build and test.**
    ```
    python engine/build.py <lab_folder> <output.html>
    node engine/test.js <output.html>        # needs: npm install jsdom
    ```
    Fix everything the test reports. Then script-click every task once in jsdom and check that
    each one completes. Take one screenshot of a busy lesson (headless Chrome) and fix any
    layout problems.
11. **Publish or hand over** the built page. If the host has an Artifact tool, publish it. Keep
    the lab folder with the user's project, not in this plugin, so it can be rebuilt later.

## Rules

- **No secrets, ever.** No keys, passwords, tokens or connection strings. Don't include personal
  data from the system: use invented examples such as "Sam Example".
- **Write in plain English.** Use short sentences in active voice, and say "you". No marketing
  tone. Follow the user's own style preferences, such as spelling or no em dashes.
- **Use code snippets that are short, real and labelled.** Keep them under about 30 lines, give
  the path in the caption, and mark them "(simplified)" when you have trimmed them. Use the real
  line number as the start where you know it.
- **Keep warnings specific.** If a command is dangerous, say exactly what it would do and why.
- **Change only the content.** Don't edit `template.html` for one lab. If a lab needs something
  new, add it to `widgets.js` and `extra.css`. If it would help every lab, change the engine and
  re-run the tests on an existing lab.
- **Give every lab its own `storage_key`,** because progress is saved in the browser under that
  key.

## Starting a new lab

Copy `starter/` to the user's project as the lab folder. It is a two-lesson example that uses
every widget. Replace its content lesson by lesson.
