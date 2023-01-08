const assert = require("assert");
module.exports = (eval) => {
  assert.strictEqual(
    eval.eval(["begin", ["var", "result", 1], ["--", "result"], "result"]),
    0
  );
  assert.strictEqual(
    eval.eval(["begin", ["var", "result", 5], ["-=", "result", 5], "result"]),
    0
  );
};
