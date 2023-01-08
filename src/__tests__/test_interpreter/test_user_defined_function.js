const assert = require("assert");

module.exports = (eval) => {
  assert.strictEqual(
    eval.eval([
      "begin",
      ["def", "square", ["x"], ["*", "x", "x"]],
      ["square", 2],
    ]),
    4
  );
  assert.strictEqual(
    eval.eval([
      "begin",
      [
        "def",
        "calc",
        ["x", "y"],
        ["begin", ["var", "z", 30], ["+", ["*", "x", "y"], "z"]],
      ],
      ["calc", 10, 20],
    ]),
    230
  );
  assert.strictEqual(
    eval.eval([
      "begin",
      ["var", "value", 100],
      [
        "def",
        "calc",
        ["x", "y"],
        [
          "begin",
          ["var", "z", ["+", "x", "y"]],
          ["def", "inner", ["foo"], ["+", ["+", "foo", "z"], "value"]],
          "inner",
        ],
      ],
      ["var", "fn", ["calc", 10, 20]],
      ["fn", 30],
    ]),
    160
  );
  assert.strictEqual(
    eval.eval([
      "begin",
      ["var", "value", 100, "data", 30],
      [
        "def",
        "calc",
        ["x", "y"],
        [
          "begin",
          ["var", "z", ["+", "x", "y"]],
          ["def", "inner", ["foo"], ["+", ["+", "foo", "z"], "value"]],
          "inner",
        ],
      ],
      ["var", "fn", ["calc", "data", 20]],
      ["fn", 30],
    ]),
    180
  );
  //recursive call
  assert.strictEqual(
    eval.eval([
      "begin",
      [
        "def",
        "factorial",
        ["x"],
        ["if", ["=", "x", 1], 1, ["*", "x", ["factorial", ["-", "x", 1]]]],
      ],
      ["factorial", 5],
    ]),
    120
  );
};
