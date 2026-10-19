  // types: mc, multi, match, order, text
  var QUIZ = {
    flow: [
      { id: "f1", type: "match", q: "Match each plain name to its real name.", pairs: [["The Tidier", "tidy_csv.py"], ["Clean one row", "clean_row"], ["Settings", "settings.yml"]], why: "The plain name says what the thing does." },
      { id: "f2", type: "mc", q: "What does clean_row return for a blank row?", options: ["An empty dict", "None", "False"], answer: 1, why: "None, and the caller skips it." },
      { id: "f3", type: "text", q: "Type the method that makes the email lower case.", accept: ["lower", ".lower()", "lower()"], why: ".lower()." }
    ],
    bugs: [
      { id: "b1", type: "multi", q: "Which of these can crash .lower()? Tick all that apply.", options: ["None", "\"\"", "\"ABC\""], answers: [0], why: "Only None has no .lower()." },
      { id: "b2", type: "order", q: "Put the fix in order.", items: ["Read the value", "Fall back to \"\" if it is None", "Call .lower()"], why: "(value or \"\").lower()." }
    ]
  };
