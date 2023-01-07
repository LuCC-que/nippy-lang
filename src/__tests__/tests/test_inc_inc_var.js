const assert = require("assert");
module.exports = (eva) => {
  assert.strictEqual(
    eva.eval(["begin", ["var", "result", 0], ["++", "result"]]),
    1
  );
  assert.strictEqual(
    eva.eval(["begin", ["var", "result", 0], ["+=", "result", 5]]),
    5
  );
};
