  // ================= LESSON 1 =================
  var flowNodes = [
    { t: "Script", n: "tidy_csv.py", d: "<p>Reads <code>settings.yml</code>, opens the input file and loops over its rows.</p>" },
    { t: "Function", n: "clean_row", nb: true, d: "<p>Trims every value and lower-cases the email. Returns None for a blank row, which is then skipped.</p>" },
    { t: "Output", n: "tidy.csv", h: "The tidy file", d: "<p>One row per cleaned input row, same columns.</p>" }
  ];
  code("#codeClean", [
    "def clean_row(row: dict) -> dict | None:",
    "    row = {k: (v or \"\").strip() for k, v in row.items()}",
    "    if not any(row.values()):",
    "        return None",
    "    row[\"email\"] = row[\"email\"].lower()",
    "    return row"
  ], 12);
  orderTask("#orderPool", "#orderPicked", "#orderFb",
    ["Read settings.yml", "Open the input file", "Clean each row", "Skip blank rows", "Write tidy.csv"],
    "flow-order", "All five in order.");
  predictTable("#rowPredict", "row-predict", ["Written, email lower-cased", "Skipped"], [
    ["<code>name=\" Sam \", email=\"SAM@EXAMPLE.ORG\"</code>", 0, "Trimmed and lower-cased."],
    ["<code>name=\"\", email=\"\"</code>", 1, "Every value is blank, so clean_row returns None."]
  ]);

  // ================= LESSON 2 =================
  var bugs = [
    { id: "bug-lower", title: "An email crash", start: 12, line: [1],
      src: ["def clean_row(row):", "    row[\"email\"] = row.get(\"email\", \"\").lower()", "    return row"],
      why: "A CSV cell can be read as None. The default only applies when the key is missing, so None.lower() crashes. Fix: <code>(row.get(\"email\") or \"\").lower()</code>." }
  ];
  var fab = [
    { id: "real-run", title: "Run it", how: "Run the script on the sample file.", lang: "PowerShell",
      code: "python tidy_csv.py", after: "Open tidy.csv and check that the blank rows are gone." }
  ];
