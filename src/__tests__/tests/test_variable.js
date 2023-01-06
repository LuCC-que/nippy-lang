const assert = require("assert");
const { Eva } = require("../../Eva");

module.exports = (eva) => {
  assert.strictEqual(eva.eval(["var", "x", 5]), 5);
  assert.strictEqual(eva.eval("x"), 5);
  assert.strictEqual(eva.eval(["var", "x", ["+", 5, ["+", 2, 3]]]), 10);
  assert.strictEqual(eva.eval("x"), 10);

  assert.strictEqual(eva.eval("VERSION"), "0.1");
  assert.strictEqual(eva.eval(["var", "isUser", "true"]), true);
};
