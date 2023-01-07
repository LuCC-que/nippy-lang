const assert = require("assert");

//for now on this function are build in function
module.exports = (eva) => {
  //+
  assert.strictEqual(eva.evalGlobal([">", 1, 5]), false);
  assert.strictEqual(eva.evalGlobal([">=", 5, ["+", 2, 3]]), true);

  //-
  assert.strictEqual(eva.evalGlobal(["-", 1, 5]), 1 - 5);
  assert.strictEqual(eva.evalGlobal(["-", 5, ["+", 2, 3]]), 5 - (2 + 3));

  //*
  assert.strictEqual(eva.evalGlobal(["*", 1, 5]), 5);
  assert.strictEqual(eva.evalGlobal(["*", 5, ["+", 2, 3]]), 25);

  // /
  assert.strictEqual(eva.evalGlobal(["/", 4, 2]), 2);
  assert.strictEqual(eva.evalGlobal(["/", 5, ["+", 2, 3]]), 1);
};
