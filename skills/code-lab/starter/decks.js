  var DECKS = [
    { id: "flow", name: "The run", cards: [
      ["What does `tidy_csv.py` do?", "Reads a CSV, cleans each row and writes tidy.csv."],
      ["What does `clean_row` return for a blank row?", "None. The row is skipped."]
    ] },
    { id: "bugs", name: "Bugs", cards: [
      ["Why can row.get(\"email\", \"\").lower() crash?", "The value can be None. Use (row.get(\"email\") or \"\").lower()."]
    ] }
  ];
