const assert = require("assert");
const { Eva } = require("../../Eva");

module.exports = (eva) => {
  //+
  assert.strictEqual(eva.eval(["+", 1, 5]), 6);
  assert.strictEqual(eva.eval(["+", 5, ["+", 2, 3]]), 10);

  //-
  assert.strictEqual(eva.eval(["-", 1, 5]), 1 - 5);
  assert.strictEqual(eva.eval(["-", 5, ["+", 2, 3]]), 5 - (2 + 3));

  //*
  assert.strictEqual(eva.eval(["*", 1, 5]), 5);
  assert.strictEqual(eva.eval(["*", 5, ["+", 2, 3]]), 25);

  // /
  assert.strictEqual(eva.eval(["/", 4, 2]), 2);
  assert.strictEqual(eva.eval(["/", 5, ["+", 2, 3]]), 1);
};
