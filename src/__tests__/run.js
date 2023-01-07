const assert = require("assert");
const { Eva } = require("../Eva");
const { Environment } = require("../utils/Environment");

const tests = [
  require("./tests/test_operation"),
  require("./tests/test_scope"),
  require("./tests/test_variable"),
  require("./tests/test_if_condition"),
  require("./tests/test_while"),
  require("./tests/test_function"),
  require("./tests/test_user_defined_function"),
  require("./tests/test_lambda"),
];

const eva = new Eva();
eva.eval(["print", '"test "', '"start!"']);
//basic test
assert.strictEqual(eva.eval(1), 1);
assert.strictEqual(eva.eval('"string"'), "string");

tests.forEach((test) => test(eva));
//varible test
eva.eval(["print", '"all "', '"assertions passed!"']);
