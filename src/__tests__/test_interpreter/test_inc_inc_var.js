const assert = require("assert");
module.exports = (eval) => {
  assert.strictEqual(
    eval.eval(["begin", ["var", "result", 0], ["++", "result"]]),
    1
  );
  assert.strictEqual(
    eval.eval(["begin", ["var", "result", 0], ["+=", "result", 5]]),
    5
  );
};
