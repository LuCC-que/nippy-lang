const assert = require("assert");
module.exports = (eval) => {
  assert.strictEqual(
    eval.eval([
      "begin",
      ["var", "x", 10],
      ["switch", [["=", "x", 10], 100], [[">", "x", 10], 200], ["else", 200]],
    ]),
    100
  );
};
