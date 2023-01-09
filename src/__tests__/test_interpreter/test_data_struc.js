const assert = require("assert");

module.exports = (eval) => {
  assert.deepEqual(eval.eval(["list", [1, 2, 3, 4]]), [1, 2, 3, 4]);
  assert.deepEqual(
    eval.evalGlobal(
      ["var", "x", 10, "y", 10],
      ["var", "l", ["list", [1, 2, 3, 4, "x", "y"]]]
    ),
    [1, 2, 3, 4, 10, 10]
  );
  assert.deepEqual(eval.evalGlobal("l"), [1, 2, 3, 4, 10, 10]);
  // assert.deepEqual(eval.eval(["map", [1, 2, 3, 4]]), [1, 2, 3, 4]);
};
