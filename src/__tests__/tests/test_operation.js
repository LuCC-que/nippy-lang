const assert = require("assert");
const { Eva } = require("../../Eva");

//+
assert.strictEqual(eva.eval(["+", 1, 5]), 6);
assert.strictEqual(eva.eval(["+", 5, ["+", 2, 3]]), 10);

//-
assert.strictEqual(eva.eval(["-", 1, 5]), 1 - 5);
assert.strictEqual(eva.eval(["-", 5, ["+", 2, 3]]), 5 - (2 + 3));

//*
assert.strictEqual(eva.eval(["+", 1, 5]), 6);
assert.strictEqual(eva.eval(["+", 5, ["+", 2, 3]]), 10);

// +
assert.strictEqual(eva.eval(["+", 1, 5]), 6);
assert.strictEqual(eva.eval(["+", 5, ["+", 2, 3]]), 10);
