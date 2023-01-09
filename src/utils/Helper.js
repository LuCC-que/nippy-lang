const isNumber = (exp) => {
  return typeof exp === "number";
};

const isString = (exp) => {
  return typeof exp === "string" && exp[0] === '"' && exp.slice(-1) === '"';
};

const isVariableName = (exp) => {
  return typeof exp === "string" && /^[+\-*/&|!<>=a-zA-Z0-9_]*$/.test(exp);
};

const arrayOP = (array, index, value, OP) => {
  switch (OP) {
    case "set":
      array[index] = value;
      break;
    case "+=":
      array[index] += value;
      break;
    case "-=":
      array[index] -= value;
      break;
    case "++":
      array[index]++;
      break;
    case "--":
      array[index]--;
      break;
  }
};

//-----------------used by parser------------------

const _isLiteral = (tokenType) => {
  return ["NUMBER", "STRING", "true", "false", "null"].includes(tokenType);
};

const _isAssignmentOperator = (tokenType) => {
  return tokenType === "SIMPLE_ASSIGN" || tokenType === "COMPLEX_ASSIGN";
};

const _checkValidAssignmentTarget = (node, mode) => {
  if (
    node.type === "Identifier" ||
    node.type === "MemberExpression" ||
    mode === "lAST"
  ) {
    return node;
  }
  throw new SyntaxError("Invalide Left-hand side in assignment expression");
};

//
module.exports = {
  isNumber,
  isString,
  isVariableName,
  arrayOP,
  _isLiteral,
  _isAssignmentOperator,
  _checkValidAssignmentTarget,
};
