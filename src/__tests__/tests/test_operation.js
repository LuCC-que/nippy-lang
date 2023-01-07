const assert = require("assert");


module.exports = (eval) => {
  //+
  assert.strictEqual(eval.eval(["+", 1, 5]), 6);
  assert.strictEqual(eval.eval(["+", 5, ["+", 2, 3]]), 10);

  //-
  assert.strictEqual(eval.eval(["-", 1, 5]), 1 - 5);
  assert.strictEqual(eval.eval(["-", 5, ["+", 2, 3]]), 5 - (2 + 3));

  //*
  assert.strictEqual(eval.eval(["*", 1, 5]), 5);
  assert.strictEqual(eval.eval(["*", 5, ["+", 2, 3]]), 25);

  // /
  assert.strictEqual(eval.eval(["/", 4, 2]), 2);
  assert.strictEqual(eval.eval(["/", 5, ["+", 2, 3]]), 1);
};
