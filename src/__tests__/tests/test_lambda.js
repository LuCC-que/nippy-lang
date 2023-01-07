const assert = require("assert");
module.exports = (eva) => {
  assert.strictEqual(
    eva.eval([
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

  assert.strictEqual(eva.eval([["lambda", ["x"], ["*", "x", "x"]], 2]), 4);

  assert.strictEqual(
    eva.eval([
      "begin",
      ["var", "square", ["lambda", ["x"], ["*", "x", "x"]]],
      ["square", 2],
    ]),
    4
  );
};
