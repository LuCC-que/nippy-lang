const assert = require("assert");
const { Eva } = require("../Eva");
const { Environment } = require("../utils/Environment");

// const test = [require("./tests")];

const eva = new Eva(
  new Environment({
    null: null,
    true: true,
    false: false,

    VERSION: "0.1",
  })
);
// assert.strictEqual(eva.eval(1), 1);
// assert.strictEqual(eva.eval('"string"'), "string");

// //+
// assert.strictEqual(eva.eval(["+", 1, 5]), 6);
// assert.strictEqual(eva.eval(["+", 5, ["+", 2, 3]]), 10);

// //-
// assert.strictEqual(eva.eval(["-", 1, 5]), 1 - 5);
// assert.strictEqual(eva.eval(["-", 5, ["+", 2, 3]]), 5 - (2 + 3));

// //*
// assert.strictEqual(eva.eval(["+", 1, 5]), 6);
// assert.strictEqual(eva.eval(["+", 5, ["+", 2, 3]]), 10);

// // +
// assert.strictEqual(eva.eval(["+", 1, 5]), 6);
// assert.strictEqual(eva.eval(["+", 5, ["+", 2, 3]]), 10);

// //varible test
// assert.strictEqual(eva.eval(["var", "x", 5]), 5);
// assert.strictEqual(eva.eval("x"), 5);
// assert.strictEqual(eva.eval(["var", "x", ["+", 5, ["+", 2, 3]]]), 10);
// assert.strictEqual(eva.eval("x"), 10);

// assert.strictEqual(eva.eval("VERSION"), "0.1");
// assert.strictEqual(eva.eval(["var", "isUser", "true"]), true);

// //block:
// assert.strictEqual(
//   eva.eval([
//     "begin",
//     ["var", "x", 10],
//     ["var", "y", 20],
//     ["+", ["*", "x", "y"], 10],
//   ]),
//   210
// );

assert.strictEqual(
  eva.eval(["begin", ["var", "x", 10], ["begin", ["var", "x", 20], "x"], "x"]),
  10
);
console.log("all assertion passed!");
