const assert = require("assert");
const { Eval } = require("../Eval");

const tests = [
  require("./tests/test_operation"),
  require("./tests/test_scope"),
  require("./tests/test_variable"),
  require("./tests/test_if_condition"),
  require("./tests/test_while"),
  require("./tests/test_function"),
  require("./tests/test_user_defined_function"),
  require("./tests/test_lambda"),
  require("./tests/test_switch"),
  require("./tests/test_for"),
  require("./tests/test_inc_inc_var"),
  require("./tests/tests_dec_dec_var"),
  require("./tests/test_class"),
];

const eval = new Eval();
eval.evalGlobal(["print", '"test "', '"start!"']);
//basic test
assert.strictEqual(eval.evalGlobal(1), 1);
assert.strictEqual(eval.evalGlobal('"string"'), "string");

tests.forEach((test) => test(eval));
//varible test
eval.evalGlobal(["print", '"all "', '"assertions passed!"']);
