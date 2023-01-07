const assert = require("assert");
const { Eva } = require("../../Eval");

module.exports = (eval) => {
  assert.strictEqual(eval.eval(["var", "x", 5]), 5);
  assert.strictEqual(eval.eval("x"), 5);
  assert.strictEqual(eval.eval(["var", "x", ["+", 5, ["+", 2, 3]]]), 10);
  assert.strictEqual(eval.eval("x"), 10);

  assert.strictEqual(eval.eval("VERSION"), "0.1");
  assert.strictEqual(eval.eval(["var", "isUser", "true"]), true);
};
