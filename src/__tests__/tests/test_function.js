const assert = require("assert");

//for now on this function are build in function
module.exports = (eval) => {
  //+
  assert.strictEqual(eval.evalGlobal([">", 1, 5]), false);
  assert.strictEqual(eval.evalGlobal([">=", 5, ["+", 2, 3]]), true);

  //-
  assert.strictEqual(eval.evalGlobal(["-", 1, 5]), 1 - 5);
  assert.strictEqual(eval.evalGlobal(["-", 5, ["+", 2, 3]]), 5 - (2 + 3));

  //*
  assert.strictEqual(eval.evalGlobal(["*", 1, 5]), 5);
  assert.strictEqual(eval.evalGlobal(["*", 5, ["+", 2, 3]]), 25);

  // /
  assert.strictEqual(eval.evalGlobal(["/", 4, 2]), 2);
  assert.strictEqual(eval.evalGlobal(["/", 5, ["+", 2, 3]]), 1);
};
