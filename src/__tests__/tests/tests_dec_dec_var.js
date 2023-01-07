const assert = require("assert");
module.exports = (eva) => {
  assert.strictEqual(
    eva.eval(["begin", ["var", "result", 1], ["--", "result"], "result"]),
    0
  );
  assert.strictEqual(
    eva.eval(["begin", ["var", "result", 5], ["-=", "result", 5], "result"]),
    0
  );
};
