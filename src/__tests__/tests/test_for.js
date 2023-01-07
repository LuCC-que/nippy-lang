const assert = require("assert");

module.exports = (eva) => {
  assert.strictEqual(
    eva.eval([
      "begin",
      ["var", "result", 0],
      [
        "for",
        ["var", "i", 0],
        ["<", "i", 5],
        ["set", "i", ["+", "i", 1]],
        ["set", "result", ["+", "result", "i"]],
      ],
      "result",
    ]),
    10
  );
};
