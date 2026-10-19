# Code Lab

A Claude Code plugin that turns a codebase into an interactive training page, so a new team
member can learn how the code works by doing things with it.

Each lab is a single HTML page with:

- lessons in the order the code runs, each with a time estimate
- a plain name beside every real file, table and setting ("The Tidier" for `tidy_csv.py`)
- a clickable run diagram and a searchable "Who's who"
- hands-on tasks: put steps in order, predict outcomes, and simulators of the code's rules
- a quiz per lesson (multiple choice, select all, drag to match, drag to order, typed)
- a bug hunt built from the repo's real history
- "do it for real" tasks with copyable commands
- flashcards with spaced repeats, and a final test
- progress saved in the browser, light and dark themes, and layouts that work on a phone

## Install

```
/plugin marketplace add ChrisJClark160/code-lab
/plugin install code-lab@code-lab
```

## Use

Ask Claude Code for a lab, for example:

> Make a code lab for this repo for a new data engineer.

Claude reads the code, writes the lab content into a folder in your project, builds the page
and tests it. Keep that folder: you rebuild the page from it whenever the code changes.

## Build by hand

```
python skills/code-lab/engine/build.py <lab_folder> <page.html>
npm install jsdom
node skills/code-lab/engine/test.js <page.html>
```

To start a new lab, copy `skills/code-lab/starter/`. Every format and helper is described in
`skills/code-lab/reference.md`.

## Layout

```
.claude-plugin/          plugin and marketplace manifests
skills/code-lab/
  SKILL.md               how Claude builds a lab
  reference.md           lab folder formats, HTML conventions, JS helpers
  engine/template.html   the shared page: layout, quizzes, flashcards, final test
  engine/build.py        fills the template from a lab folder
  engine/test.js         jsdom smoke test
  starter/               a two-lesson example that uses every widget
```
