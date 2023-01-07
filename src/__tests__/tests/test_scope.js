const assert = require("assert");

module.exports = (eval) => {
  //block:
  assert.strictEqual(
    eval.eval([
      "begin",
      ["var", "x", 10],
      ["var", "y", 20],
      ["+", ["*", "x", "y"], 10],
    ]),
    210
  );

  assert.strictEqual(
    eval.eval([
      "begin",
      ["var", "x", 10],
      ["begin", ["var", "x", 20], "x"],
      "x",
    ]),
    10
  );

  assert.strictEqual(
    eval.eval([
      "begin",
      ["var", "value", 10],
      ["var", "result", ["begin", ["var", "x", ["+", "value", 10]], "x"]],
      "result",
    ]),
    20
  );

  assert.strictEqual(
    eval.eval([
      "begin",
      ["var", "data", 10],
      ["begin", ["set", "data", ["+", 5, 10]]],
      "data",
    ]),
    15
  );
};
