const { AST, lAST } = require("./utils/Factory");
const { Tokenizer } = require("./utils/Tokenizer");
const {
  _isLiteral,
  _isAssignmentOperator,
  _checkValidAssignmentTarget,
} = require("./utils/Helper");

class Parser {
  constructor() {
    this._string = "";
    this._tokenizer = new Tokenizer();
  }
  parse(string, mode) {
    this._string = string;
    this._tokenizer.init(string);

    //always prepare the next toekennizer here
    this._lookahead = this._tokenizer.getNextToken();
    this._mod = mode === "AST" ? AST : lAST;

    this.mode = mode;
    return this.Program();
  }

  /**
   * Program
   *  : Literal
   */
  Program() {
    return this._mod.Program(this.StatementList());
  }

  /**
   * StatementList
   *  : Statement
   *  | StatementList Statement
   */

  StatementList(stop = null) {
    const statementList = [this.Statement()];
    while (this._lookahead != null && this._lookahead.type !== stop) {
      statementList.push(this.Statement());
    }
    return statementList;
  }

  /**
   * Statement
   *  : ExpressionStatement
   *  | BlockStatement
   *  | EmptyStatement
   *  | VariableStatement
   *  | IfStatement
   *  | ClassDeclaration
   */

  Statement() {
    switch (this._lookahead.type) {
      case "{":
        return this.BlockStatement();
      case "if":
        return this.IfStatement();
      case ";":
        return this.EmptyStatement();
      case "let":
        return this.VariableStatement();
      case "def":
        return this.FunctionDeclaration();
      case "return":
        return this.ReturnStatement();
      case "class":
        return this.ClassDeclaration();
      case "while":
      case "do":
      case "for":
        return this.IterationStatement();
      default:
        return this.ExpressionStatement();
    }
  }

  /**
   * VariableStatement
   *  : 'let' VariableDeclarationList ';'
   */

  VariableStatement() {
    // const variableStatement = this.VariableStatementInit();
    // this._eat(";");
    // return variableStatement;
    this._eat("let");
    const declarations = this.VariableDeclarationList();
    this._eat(";");
    return this._mod.VariableStatement(declarations);
  }

  /**
   * VariableDeclarationList
   *  : VariableDeclaration
   *  | VariableDeclarationList ',' VariableDeclaration
   */

  VariableDeclarationList() {
    const declarations = [];

    do {
      declarations.push(this.VariableDeclaration());
    } while (this._lookahead.type === "," && this._eat(","));

    return declarations;
  }

  /**
   * VariableDeclaration
   *  : Identifier OptVariableInitializer
   */
  VariableDeclaration() {
    const id = this.Identifier();

    const init =
      this._lookahead.type !== ";" && this._lookahead.type !== ","
        ? this.VariableInitializer()
        : null;

    return this._mod.VariableDeclaration(id, init);
  }

  /**
   * VariableInitializer
   *  : SIMPLE_ASSIGN AssignmentExpression
   *
   */
  VariableInitializer() {
    this._eat("SIMPLE_ASSIGN");

    return this.AssignmentExpression();
  }

  BlockStatement() {
    this._eat("{");
    const body = this._lookahead.type !== "}" ? this.StatementList("}") : [];
    this._eat("}");
    return this._mod.BlockStatement(body);
  }

  /**
   * EmptyStatement
   *  : ';'
   *  ;
   */

  EmptyStatement() {
    this._eat(";");
    return this._mod.EmptyStatement();
  }

  /**
   * ExpressionStatement
   *  : Expression ';'
   */

  ExpressionStatement() {
    const expression = this.Expression();
    this._eat(";");
    return this._mod.ExpressionStatement(expression);
  }

  /**
   * Expression
   *  : Literal
   */

  Expression() {
    return this.AssignmentExpression();
  }

  /**
   * AssignmentExpression
   *  : LogicalORExpression
   *  | LeftHandSideExpression AssignmentOperator AssignmentExpression
   */

  AssignmentExpression() {
    // if (this._lookahead.type == "lambda") {
    //   this._eat("lambda");
    //   this._eat("(");
    //   const params =
    //     this._lookahead.type !== ")" ? this.FormalParameterList() : [];
    //   this._eat(")");
    //   const body = this.BlockStatement();
    //   return this._factory.Lambda(params, body);
    // }

    const left = this.AdditiveExpression();

    if (!_isAssignmentOperator(this._lookahead.type)) {
      return left;
    }

    return this._mod.AssignmentExpression(
      this.AssignmentOperator().value,
      _checkValidAssignmentTarget(left, this.mode),
      this.AssignmentExpression()
    );
  }

  /**
   *
   * AdditiveExpression
   *  : Literal
   *  | AdditiveExpression ADDITIVE_OPERATOR Literal
   *
   */

  AdditiveExpression() {
    // let left = this.MultiplicativeExpression();
    // while (this._lookahead.type === "ADDITIVE_OPERATOR") {
    //   const operator = this._eat("ADDITIVE_OPERATOR");
    //   const right = this.MultiplicativeExpression();
    //   left = this._mod.AdditiveExpression(operator, left, right);
    // }
    // return left;
    return this.BinaryExpression(
      "MultiplicativeExpression",
      "ADDITIVE_OPERATOR"
    );
  }

  /**
   *
   * MultiplicativeExpression
   *  : PrimayExpression
   *  | MultiplicativeExpression MULTIPLICATIVE_OPERATOR Literal
   *
   */

  MultiplicativeExpression() {
    // let left = this.PrimaryExpression();
    // while (this._lookahead.type === "MULTIPLICATIVE_OPERATOR") {
    //   const operator = this._eat("MULTIPLICATIVE_OPERATOR");
    //   const right = this.PrimaryExpression();
    //   left = this._mod.MultiplicativeExpression(operator, left, right);
    // }
    // return left;
    return this.BinaryExpression(
      "PrimaryExpression",
      "MULTIPLICATIVE_OPERATOR"
    );
  }

  //A helper function
  BinaryExpression(builderName, operatorToken) {
    let left = this[builderName]();
    while (this._lookahead.type === operatorToken) {
      const operator = this._eat(operatorToken);
      const right = this[builderName]();

      left = this._mod.BinaryExpression(operator, left, right);
    }

    return left;
  }

  /**
   * PrimayExpression
   *  : Literal
   *  | ParenthesizedExpression
   *  | this
   */

  PrimaryExpression() {
    if (_isLiteral(this._lookahead.type)) {
      return this.Literal();
    }
    switch (this._lookahead.type) {
      case "(":
        return this.ParenthesizedExpression();
      case "IDENTIFIER":
        return this.Identifier();
      case "this":
        return this.ThisExpression();
      case "new":
        return this.NewExpression();
      default:
        return this.LeftHandSideExpression();
    }
  }

  /**
   * AssignmentOperator
   *  : SIMPLE_ASSIGN
   *  | COMPLEX_ASSIGN
   */

  AssignmentOperator() {
    if (this._lookahead.type === "SIMPLE_ASSIGN") {
      return this._eat("SIMPLE_ASSIGN");
    }
    return this._eat("COMPLEX_ASSIGN");
  }

  /**
   * LeftHandSideExpression
   *  : MemberExpression
   *  ;
   */
  LeftHandSideExpression() {
    return this.Identifier();
  }

  /**
   * Identifier
   *  : IDENTIFIER
   *  ;
   */

  Identifier() {
    const name = this._eat("IDENTIFIER").value;
    return this._mod.Identifier(name);
  }

  /**
   * ParenthesizedExpression
   *  : "(" Expression ")"
   *  ;
   *
   *
   */

  ParenthesizedExpression() {
    this._eat("(");
    const expression = this.Expression();

    this._eat(")");
    return expression;
  }

  /**
   * Literal
   *  : NumericLiteral
   *  | StringLiteral
   *  | BooleanLiteral
   *  | BooleanLiteral
   */

  Literal() {
    switch (this._lookahead.type) {
      case "NUMBER":
        return this.NumericLiteral();
      case "STRING":
        return this.StringLiteral();
    }

    throw new SyntaxError(
      `Literal: unexpected literal production ${this._lookahead.type}`
    );
  }

  /**
   * NumericLiteral
   *  : NUMBER
   */

  NumericLiteral() {
    const token = this._eat("NUMBER");

    return this._mod.NumericLiteral(token.value);
  }

  /**
   * StringLiteral
   *  : STRING
   */

  StringLiteral() {
    const token = this._eat("STRING");
    return this._mod.StringLiteral(token.value);
  }

  _eat(tokenType) {
    const token = this._lookahead;

    if (token == null) {
      throw new SyntaxError(
        `Unexpected end of input, expected: "${tokenType}"`
      );
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Unexpected token "${token.value}", expected "${tokenType}"`
      );
    }
    //advance
    this._lookahead = this._tokenizer.getNextToken();

    return token;
  }
}

module.exports = {
  Parser,
};
