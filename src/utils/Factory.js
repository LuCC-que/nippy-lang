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
  LogicalExpression(operator, left, right) {
    return {
      type: "LogicalExpression",
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

  IfStatement(test, consequent, alternate) {
    return {
      type: "IfStatement",
      test,
      consequent,
      alternate,
    };
  },

  BooleanLiteral(value) {
    return {
      type: "BooleanLiteral",
      value,
    };
  },

  NullLiteral(value) {
    return {
      type: "NullLiteral",
      value,
    };
  },
  UnaryExpression(operator, argument) {
    return {
      type: "UnaryExpression",
      operator,
      argument,
    };
  },
  WhileStatement(test, body) {
    return { type: "WhileStatement", test, body };
  },
  DoWhileStatement(body, test) {
    return {
      type: "DoWhileStatement",
      body,
      test,
    };
  },
  ForStatement(init, test, update, body) {
    return {
      type: "ForStatement",
      init,
      test,
      update,
      body,
    };
  },
  FunctionDeclaration(name, params, body) {
    return { type: "FunctionDeclaration", name, params, body };
  },
  LambdaDeclaration(params, body) {
    return { type: "LambdaDeclaration", params, body };
  },
  ListDeclaration(params) {
    return {
      type: "ListDeclaration",
      params,
    };
  },
  ReturnStatement(argument) {
    return {
      type: "ReturnStatement",
      argument,
    };
  },
  MemberExperssion(computed, object, property, value) {
    if (!value) {
      return {
        type: "MemberExpression",
        computed,
        object,
        property,
      };
    }
    return {
      type: "MemberExpression",
      computed,
      object,
      property,
      arguments: value,
    };
  },

  _CallExpression(callee, arguments) {
    return {
      type: "CallExpression",
      callee,
      arguments,
    };
  },
  ClassDeclaration(id, superClass, body) {
    return {
      type: "ClassDeclaration",
      id,
      superClass,
      body,
    };
  },
  NewExpression(callee, arguments) {
    return {
      type: "NewExpression",
      callee,
      arguments,
    };
  },
  ThisExpression() {
    return {
      type: "ThisExpression",
    };
  },
  Super() {
    return {
      type: "Super",
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
  EmptyStatement() {
    return;
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

  LogicalExpression(operator, left, right) {
    return [operator.value, left, right];
  },
  Identifier(name) {
    return name;
  },

  AssignmentExpression(operator, left, right) {
    return [operator === "=" ? "set" : operator, left, right];
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

  IfStatement(test, consequent, alternate) {
    return ["if", test, consequent, alternate];
  },

  BooleanLiteral(value) {
    return value;
  },

  NullLiteral(value) {
    return value;
  },
  UnaryExpression(operator, argument) {
    return [operator, argument];
  },
  WhileStatement(test, body) {
    return ["while", test, body];
  },
  DoWhileStatement(body, test) {
    return ["do", body, test];
  },
  ForStatement(init, test, update, body) {
    return ["for", init, test, update, body];
  },
  FunctionDeclaration(name, params, body) {
    return ["def", name, params, body];
  },
  ListDeclaration(params) {
    return ["list", params];
  },
  ReturnStatement(argument) {
    return argument;
  },
  LambdaDeclaration(params, body) {
    return ["lambda", params, body];
  },
  MemberExperssion(computed, object, property, value) {
    if (!computed) {
      let answer = ["prop", object, property];
      if (value != null) {
        answer.push(value);
      }
      return answer;
    }
    return ["find", object, property];
  },
  _CallExpression(callee, arguments) {
    if (Array.isArray(arguments)) {
      return [callee, ...arguments];
    }
    return [callee, arguments];
  },
  ClassDeclaration(id, superClass, body) {
    return ["class", id, superClass, body];
  },
  NewExpression(callee, arguments) {
    return ["new", callee, ...arguments];
  },
  ThisExpression() {
    return "this";
  },
  Super() {
    return "super";
  },
};

module.exports = { AST, lAST };
