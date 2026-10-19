"""Build a Code Lab page from a lab folder.

Usage:
    python build.py <lab_folder> <output.html>

The lab folder holds:
    lab.json      {"title", "subtitle", "storage_key", "pass_message"}   required
    lessons.html  the <section class="lesson"> blocks, in order          required
    quiz.js       var QUIZ = {...};                                        required
    decks.js      var DECKS = [...];                                       required
    names.js      var NAMES = {...};                  optional (defaults to {})
    widgets.js    lesson code: flowNodes, bugs, fab, simulators   optional
    extra.css     any extra CSS                                    optional

See ../reference.md for every format and helper.
"""

import json
import pathlib
import re
import sys

ENGINE = pathlib.Path(__file__).parent
REQUIRED = ("title", "subtitle", "storage_key", "pass_message")


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 2
    lab, out = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])

    def read(name, default=None):
        p = lab / name
        if p.exists():
            return p.read_text(encoding="utf-8").rstrip("\n")
        if default is None:
            sys.exit(f"Missing {p}")
        return default

    meta = json.loads(read("lab.json"))
    missing = [k for k in REQUIRED if not meta.get(k)]
    if missing:
        sys.exit(f"lab.json is missing: {', '.join(missing)}")

    html = (ENGINE / "template.html").read_text(encoding="utf-8")
    parts = {
        "TITLE": meta["title"],
        "SUBTITLE": meta["subtitle"],
        "STORAGE_KEY": meta["storage_key"],
        "PASS_MESSAGE": meta["pass_message"],
        "EXTRA_CSS": read("extra.css", ""),
        "LESSONS_HTML": read("lessons.html"),
        "NAMES_JS": read("names.js", "  var NAMES = {};"),
        "QUIZ_JS": read("quiz.js"),
        "WIDGETS_JS": read("widgets.js", ""),
        "DECKS_JS": read("decks.js"),
    }
    for key, value in parts.items():
        html = html.replace("{{" + key + "}}", value)

    left = re.findall(r"\{\{[A-Z_]+\}\}", html)
    if left:
        sys.exit(f"Unfilled placeholders: {sorted(set(left))}")
    if 'data-id="cards"' in parts["LESSONS_HTML"] or 'data-id="final"' in parts["LESSONS_HTML"]:
        sys.exit("lessons.html must not include the Flashcards or Final check sections; the template adds them.")

    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print(f"Built {out} ({len(html):,} characters)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
