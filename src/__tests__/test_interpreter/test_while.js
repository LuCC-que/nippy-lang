const assert = require("assert");

module.exports = (eval) => {
  assert.strictEqual(
    eval.eval([
      "begin",
      ["var", "counter", 10],
      ["var", "result", 0],
      [
        "while",
        [">", "counter", 0],
        [
          "begin",
          ["set", "result", ["+", "result", 1]],
          ["set", "counter", ["-", "counter", 1]],
        ],
      ],
      "result",
    ]),
    10
  );
};
