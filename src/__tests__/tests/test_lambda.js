const assert = require("assert");
module.exports = (eval) => {
  assert.strictEqual(
    eval.eval([
      "begin",
      [
        "def",
        "onClick",
        ["callback"],
        [
          "begin",
          ["var", "x", 10],
          ["var", "y", 20],
          ["callback", ["+", "x", "y"]],
        ],
      ],

      ["onClick", ["lambda", ["data"], ["*", "data", 10]]],
    ]),
    300
  );

  assert.strictEqual(eval.eval([["lambda", ["x"], ["*", "x", "x"]], 2]), 4);

  assert.strictEqual(
    eval.eval([
      "begin",
      ["var", "square", ["lambda", ["x"], ["*", "x", "x"]]],
      ["square", 2],
    ]),
    4
  );
};
