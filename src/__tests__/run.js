const assert = require("assert");
const { Eva } = require("../Eva");
const { Environment } = require("../utils/Environment");

const tests = [
  require("./tests/test_operation"),
  require("./tests/test_scope"),
  require("./tests/test_variable"),
];

const eva = new Eva(
  new Environment({
    null: null,
    true: true,
    false: false,

    VERSION: "0.1",
  })
);

//basic test
assert.strictEqual(eva.eval(1), 1);
assert.strictEqual(eva.eval('"string"'), "string");

tests.forEach((test) => test(eva));
//varible test

console.log("all assertion passed!");
