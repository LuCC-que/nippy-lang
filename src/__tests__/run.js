const assert = require("assert");
const { Eva } = require("../Eva");

// const test = [require("./tests")];

const eva = new Eva();
assert.strictEqual(eva.eval(1), 1);
assert.strictEqual(eva.eval('"string"'), "string");

console.log("all assertion passed!");
