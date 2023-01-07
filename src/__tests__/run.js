const assert = require("assert");
const { Eva } = require("../Eva");
const { Environment } = require("../utils/Environment");

const tests = [
  require("./tests/test_operation"),
  require("./tests/test_scope"),
  require("./tests/test_variable"),
  require("./tests/test_if_condition"),
  require("./tests/test_while"),
];

const eva = new Eva();

//basic test
assert.strictEqual(eva.eval(1), 1);
assert.strictEqual(eva.eval('"string"'), "string");

tests.forEach((test) => test(eva));
//varible test

console.log("all assertion passed!");
