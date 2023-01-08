const AST = {
  Program(body) {
    return {
      type: "Program",
      body,
    };
  },

  BlockStatement(body) {
    return {
      type: "BlockStatement",
      body,
    };
  },

  EmptyStatement() {
    return {
      type: "EmptyStatement",
    };
  },
  ExpressionStatement(expression) {
    return {
      type: "ExpressionStatement",
      expression,
    };
  },
  NumericLiteral(value) {
    return {
      type: "NumericLiteral",
      value: Number(value),
    };
  },
  StringLiteral(value) {
    return { type: "StringLiteral", value: value.slice(1, -1) };
  },
  AdditiveExpression(operator, left, right) {
    return {
      type: "BinaryExpression",
      operator: operator.value,
      left,
      right,
    };
  },
  MultiplicativeExpression(operator, left, right) {
    return {
      type: "BinaryExpression",
      operator: operator.value,
      left,
      right,
    };
  },
};
const lAST = {
  Program(body) {
    return ["begin", ...body];
  },

  BlockStatement(body) {
    return ["begin", ...body];
  },

  ExpressionStatement(expression) {
    return expression;
  },

  NumericLiteral(value) {
    return Number(value);
  },

  StringLiteral(value) {
    return value;
  },
  AdditiveExpression(operator, left, right) {
    return [operator.value, left, right];
  },
  MultiplicativeExpression(operator, left, right) {
    return [operator.value, left, right];
  },
};

module.exports = { AST, lAST };
