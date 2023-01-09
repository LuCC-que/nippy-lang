const assert = require("assert");
const { Eval } = require("../Eval");
const { Parser } = require("../Parser");

//================================== INTERPRETER ====================================
const InterpreterTests = [
  require("./test_interpreter/test_operation"),
  require("./test_interpreter/test_scope"),
  require("./test_interpreter/test_variable"),
  require("./test_interpreter/test_if_condition"),
  require("./test_interpreter/test_while"),
  require("./test_interpreter/test_function"),
  require("./test_interpreter/test_user_defined_function"),
  require("./test_interpreter/test_lambda"),
  require("./test_interpreter/test_switch"),
  require("./test_interpreter/test_for"),
  require("./test_interpreter/test_inc_inc_var"),
  require("./test_interpreter/tests_dec_dec_var"),
  require("./test_interpreter/test_class"),
];

const eval = new Eval();
eval.evalGlobal(["print", '"test Interpreter----------------"', '"start!"']);
//basic test
assert.deepEqual(eval.eval(["list", [1, 2, 3, 4]]), [1, 2, 3, 4]);
assert.strictEqual(eval.evalGlobal(["var", "x", 10, "y", 10]), 10);
assert.deepEqual(eval.evalGlobal("x"), 10);
assert.deepEqual(
  eval.evalGlobal(
    ["var", "x", 10, "y", 10],
    ["var", "l", ["list", [1, 2, 3, 4, "x", "y"]]]
  ),
  [1, 2, 3, 4, 10, 10]
);
assert.deepEqual(eval.evalGlobal("l"), [1, 2, 3, 4, 10, 10]);
assert.deepEqual(
  eval.evalGlobal(["prop", "l", "push", 5]),
  [1, 2, 3, 4, 10, 10, 5]
);
assert.deepEqual(eval.evalGlobal(["find", "l", 3]), 4);
assert.deepEqual(
  eval.evalGlobal([
    "begin",
    ["var", "a", 10],
    ["var", "b", ["list", [0, 1, 2, 3, 4, 5]]],
    ["prop", "b", "push", ["a"]],
    ["find", "b", 6],
  ]),
  10
);
assert.deepEqual(
  eval.evalGlobal([
    "begin",
    ["var", "b", ["list", [0, 1, 2, 3, 4, 5]]],
    ["find", "b", 3],
    ["+=", ["find", "b", 3], 1],
    ["find", "b", 3],
  ]),
  4
);
// assert.strictEqual(eval.evalGlobal(1), 1);

// assert.strictEqual(eval.evalGlobal("x"), 10);

InterpreterTests.forEach((test) => test(eval));
//varible test
eval.evalGlobal(["print", '"all test Interpreter----------"', '" passed!"']);

//================================== Parser ====================================
const ParserTests = [
  require("./test_parser/literals-test.js"),
  require("./test_parser/statement-list-test.js"),
  require("./test_parser/block-test.js"),
  require("./test_parser/empty-statement-test.js"),
  require("./test_parser/math-test.js"),
  require("./test_parser/assignment-test.js"),
  require("./test_parser/variable-test.js"),
  require("./test_parser/if-test.js"),
  require("./test_parser/relational-test.js"),
  require("./test_parser/equality-test.js"),
  require("./test_parser/logical-test.js"),
  require("./test_parser/unary-test.js"),
  require("./test_parser/while-test.js"),
  require("./test_parser/do-while-test.js"),
  require("./test_parser/for-test.js"),
  require("./test_parser/function-declaration-test.js"),
  require("./test_parser/member-test.js"),
  // require("./test_parser/call-test.js"),
  // require("./test_parser/class-test.js"),
];

const testAST = (program, expected) => {
  const ast = parser.parse(program, "AST");
  assert.deepEqual(ast, expected);
};

const parser = new Parser();
eval.evalGlobal(["print", '"test parser----------------"', '"start!"']);

//---------self defined tests--------------
const program = `  


class Point {
  def constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  def calc() {
    return this.x + this.y;
  }
}


  `;
const ast = parser.parse(program, "AST");
ParserTests.forEach((testRun) => testRun(testAST));

console.log(JSON.stringify(ast, null, 2));
eval.evalGlobal(["print", '"all test parser----------"', '" passed!"']);

//================================== BOTH ====================================
const parser1 = new Parser();
const eval1 = new Eval();
//42;
//"Hello, world";

const Bothtests = [
  require("./test_both/test_single"),
  require("./test_both/test_math"),
  require("./test_both/test_block"),
  require("./test_both/test_variable"),
  require("./test_both/test_if_condition"),
  require("./test_both/test_logical"),
  require("./test_both/test_unary"),
  require("./test_both/test_loop"),
  require("./test_both/test_function"),
  // require("./test_both/test_list"),
];

const testBoth = (CODE, expected) => {
  const parser = new Parser();
  const eval = new Eval();
  const parseRst = parser.parse(CODE, "lAST");
  const evalRst = eval.evalGlobal(parseRst);

  assert.deepEqual(evalRst, expected);
};

Bothtests.forEach((test) => test(testBoth));

const CODE = `

class Point {
  def constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  def calc() {
    return this.x + this.y;
  }
}

class Point3D extends Point {
  def constructor(x, y, z) {
    super(x, y);
    this.z = z;
  }

  def calc() {
    return super() + this.z;
  }
}

let x = new Point3D(4,3,1);
x.calc();


  `;

const ParseRst = parser1.parse(CODE, "lAST");
console.log("running code", JSON.stringify(ParseRst, null, 2));
// console.log("running result", eval1.evalGlobal(ParseRst));
