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
  BinaryExpression(operator, left, right) {
    return {
      type: "BinaryExpression",
      operator: operator.value,
      left,
      right,
    };
  },

  Identifier(name) {
    return {
      type: "Identifier",
      name,
    };
  },

  AssignmentExpression(operator, left, right) {
    return {
      type: "AssignmentExpression",
      operator,
      left,
      right,
    };
  },
  VariableStatement(declarations) {
    return {
      type: "VariableStatement",
      declarations,
    };
  },

  VariableDeclaration(id, init) {
    return {
      type: "VariableDeclaration",
      id,
      init,
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
  BinaryExpression(operator, left, right) {
    return [operator.value, left, right];
  },
  Identifier(name) {
    return name;
  },

  AssignmentExpression(_, left, right) {
    return ["set", left, right];
  },
  VariableStatement(declarations) {
    let list = ["var"];
    declarations.forEach((declaration) => {
      list.push(...declaration);
    });
    return list;
  },

  VariableDeclaration(id, init) {
    return [id, init == null ? "null" : init];
  },
};

module.exports = { AST, lAST };
