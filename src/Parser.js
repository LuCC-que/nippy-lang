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
    const rlt = this._mod.Program(this.StatementList());
    return rlt;
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
      case "Lambda":
        return this.LambdaDeclaration();
      case "List":
        return this.ListDeclaration();
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
   * ClassDeclaration
   *  : "class" Identifier OptClassExtends BlockStatement
   *
   */

  ClassDeclaration() {
    this._eat("class");
    const id = this.Identifier();

    const superClass =
      this._lookahead.type === "extends" ? this.ClassExtends() : null;

    const body = this.BlockStatement();

    return this._mod.ClassDeclaration(id, superClass, body);
  }

  /**
   * ClassExtends
   *  : "extends" Identifier
   *
   */
  ClassExtends() {
    this._eat("extends");
    return this.Identifier();
  }

  /**
   * IterationStatement
   *  : WhileStatment
   *  | DoWhileStatement
   *  | ForStatement;
   */

  IterationStatement() {
    switch (this._lookahead.type) {
      case "while":
        return this.WhileStatement();
      case "do":
        return this.DoWhileStatement();
      case "for":
        return this.ForStatement();
    }
  }

  /**
   * WhileStatement()
   *  : 'while' '(' Expression ')' Statement
   */
  WhileStatement() {
    this._eat("while");
    this._eat("(");
    const test = this.Expression();
    this._eat(")");
    const body = this.Statement();

    return this._mod.WhileStatement(test, body);
  }

  /**
   * WhileStatement()
   *  : 'while' '(' Expression ')' Statement
   */
  DoWhileStatement() {
    this._eat("do");
    const body = this.Statement();
    this._eat("while");
    this._eat("(");
    const test = this.Expression();
    this._eat(")");
    this._eat(";");

    return this._mod.DoWhileStatement(body, test);
  }

  /**
   * ForStatement()
   *  : 'for' '('init;test; update ')' body
   */
  ForStatement() {
    this._eat("for");
    this._eat("(");
    const init = this._lookahead.type !== ";" ? this.ForStatementInit() : null;
    this._eat(";");

    const test = this._lookahead.type !== ";" ? this.Expression() : null;
    this._eat(";");

    const update = this._lookahead.type !== ")" ? this.Expression() : null;
    this._eat(")");

    const body = this.Statement();

    return this._mod.ForStatement(init, test, update, body);
  }

  /**
   * ForStatementInit
   *  : VariableStatementInit
   *  | Expression
   *
   */
  ForStatementInit() {
    if (this._lookahead.type === "let") {
      return this.VariableStatementInit();
    }
    return this.Expression();
  }

  /**
   * IfStatement
   *  : 'if' '(' Expression ')' Statement
   *  | 'if' '(' Expression ')' Statement 'else' Statement
   */

  IfStatement(to_eat = null) {
    this._eat(to_eat == null ? "if" : to_eat);
    this._eat("(");
    const test = this.Expression();
    this._eat(")");
    const consequent = this.Statement();
    let alternate;
    if (this._lookahead != null && this._lookahead.type === "elif") {
      alternate = this.IfStatement("elif");
    } else {
      alternate =
        this._lookahead != null && this._lookahead.type === "else"
          ? this._eat("else") && this.Statement()
          : null;
    }

    return this._mod.IfStatement(test, consequent, alternate);
  }

  /**
   * VariableStatement
   *  : 'let' VariableDeclarationList ';'
   */

  VariableStatement() {
    const variableStatement = this.VariableStatementInit();
    this._eat(";");
    return variableStatement;
  }

  /**
   * VariableStatementInit
   *  : 'let' VariableDeclarationList ';'
   */

  VariableStatementInit() {
    this._eat("let");
    const declarations = this.VariableDeclarationList();
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
    if (this._lookahead.type == "Lambda" || this._lookahead.type == "List") {
      return this.Statement();
    }
    return this.AssignmentExpression();
  }
  /**
   *
   * LambdaDeclaration;
   *  : List[item, item....];
   */
  ListDeclaration() {
    this._eat("List");
    this._eat("[");
    const params = this._lookahead.type !== "]" ? this.ArgumentList() : [];
    this._eat("]");
    return this._mod.ListDeclaration(params);
  }

  /**
   *
   * LambdaDeclaration;
   *  : Lambda Parameter body;
   */

  LambdaDeclaration() {
    this._eat("Lambda");
    this._eat("(");
    const params =
      this._lookahead.type !== ")" ? this.FormalParameterList() : [];
    this._eat(")");
    const body = this.BlockStatement();
    return this._mod.LambdaDeclaration(params, body);
  }
  /**
   * FunctionDeclaration
   *  : "def" Identifier '(' OptFormaParameterList ')' BlockStatement
   */
  FunctionDeclaration() {
    this._eat("def");
    const name = this.Identifier();
    this._eat("(");
    const params =
      this._lookahead.type !== ")" ? this.FormalParameterList() : [];
    this._eat(")");
    const body = this.BlockStatement();
    return this._mod.FunctionDeclaration(name, params, body);
  }

  /**
   * FormalParameterList
   *  : Identifier
   *  | FormalParameterList ',' Identifier
   */

  FormalParameterList() {
    const params = [];

    do {
      params.push(this.Identifier());
    } while (this._lookahead.type === "," && this._eat(","));

    return params;
  }

  /**
   * ReturnStatement()
   *  : 'Return' OptExpression ';'
   */
  ReturnStatement() {
    this._eat("return");
    const argument = this._lookahead.type !== ";" ? this.Expression() : null;
    this._eat(";");

    return this._mod.ReturnStatement(argument);
  }

  /**
   * BlockStatement
   *  : '{' OptStatementList '}'
   */

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

    const left = this.LogicalORExpression();

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
   * LogicalORExpression
   *  : LogicalANDExpression LOGICAL_OR LogicalORExpression
   *  | LogicalORExpression
   *  ;
   */

  LogicalORExpression() {
    return this.LogicalExpression("LogicalANDExpression", "LOGICAL_OR");
  }

  /**
   * LogicalORExpression
   *  : EqualityExpression LOGICAL_AND LogicalORExpression
   *  | EqualityExpression
   *  ;
   */

  LogicalANDExpression() {
    return this.LogicalExpression("EqualityExpression", "LOGICAL_AND");
  }

  /**
   * EqualityExpression
   *  : RelationalExpression EQUALITY_OPERATOR EqualityExpression
   *  | RelationalExpression
   *  ;
   */

  EqualityExpression() {
    return this.BinaryExpression("RelationalExpression", "EQUALITY_OPERATOR");
  }

  /**
   * RelationalExpression: >, >=, <, <=
   *  : AdditiveExpression
   *  | AdditiveExpression RELATIONAL_OPERATOR RelationalExpression
   *
   */

  RelationalExpression() {
    return this.BinaryExpression("AdditiveExpression", "RELATIONAL_OPERATOR");
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
    return this.BinaryExpression("UnaryExpression", "MULTIPLICATIVE_OPERATOR");
  }

  //A helper function
  BinaryExpression(builderName, operatorToken) {
    let left = this[builderName]();
    while (this._lookahead.type === operatorToken) {
      const operator = this._eat(operatorToken);
      const right = this[builderName]();

      //push to the left, add new as top
      left = this._mod.BinaryExpression(operator, left, right);
    }

    return left;
  }

  LogicalExpression(BuilderName, operatorToken) {
    let left = this[BuilderName]();
    while (this._lookahead.type === operatorToken) {
      const operator = this._eat(operatorToken);
      const right = this[BuilderName]();
      left = this._mod.LogicalExpression(operator, left, right);
    }

    return left;
  }

  /**
   * UnaryExpression
   *  : LeftHandSideExpression
   *  | ADDITIVE_OPERATOR UnaryExpression
   *  | LOGICAL_NOT UnaryExpression
   */

  UnaryExpression() {
    let operator;
    switch (this._lookahead.type) {
      case "ADDITIVE_OPERATOR":
        operator = this._eat("ADDITIVE_OPERATOR").value;
        break;
      case "LOGICAL_NOT":
        operator = this._eat("LOGICAL_NOT").value;
        break;
      case "++":
        operator = this._eat("++").value;
        break;
      case "--":
        operator = this._eat("--").value;
        break;
    }

    if (operator != null) {
      return this._mod.UnaryExpression(operator, this.UnaryExpression());
    }

    return this.LeftHandSideExpression();
  }
  /**
   * PrimayExpression
   *  : Literal
   *  | ParenthesizedExpression
   *  | Identifier
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
   * LeftHandSideExpression
   *  : MemberExpression
   *  ;
   */
  LeftHandSideExpression() {
    return this.CallMemberExpression();
  }

  /**
   * CallMemberExpression
   *  : MemberExpression
   *  | CallExpression
   *  ;
   */

  CallMemberExpression() {
    if (this._lookahead.type === "super") {
      return this._CallExpression(this.Super());
    }

    const member = this.MemberExperssion();

    if (this._lookahead.type === "(") {
      return this._CallExpression(member);
    }

    return member;
  }

  /**
   * CallExpression
   *  : Callee Arguments
   *  ;
   *
   * Callee
   *  : MemberExpression
   *  | CallExpression
   *  ;
   */

  _CallExpression(callee) {
    let callExpression = this._mod._CallExpression(callee, this.Arguments());

    if (this._lookahead.type === "(") {
      callExpression = this._CallExpression(callExpression);
    }

    return callExpression;
  }

  /**
   * Arguments
   *  : '(' Expression ')'
   *  ;
   */

  Arguments() {
    this._eat("(");
    const argumentList =
      this._lookahead.type !== ")" ? this.ArgumentList() : [];
    // let argumentList;
    // if (this._lookahead.type == "List" || this._lookahead.type == "Lambda") {
    //   argumentList = this._lookahead.type !== ")" ? [this.Statement()] : [];
    // } else {
    //   argumentList = this._lookahead.type !== ")" ? this.ArgumentList() : [];
    // }

    this._eat(")");

    return argumentList;
  }
  /**
   * ArgumentList
   *  : AssignmentExpression
   *  | ArgumentList ',' AssignmentExpression
   *  ;
   */
  ArgumentList() {
    const argumentList = [];
    do {
      //if the parameter is List or Lambda, we call the statement first
      if (this._lookahead.type == "List" || this._lookahead.type == "Lambda") {
        argumentList.push(this.Statement());
      } else {
        argumentList.push(this.AssignmentExpression());
      }
    } while (this._lookahead.type === "," && this._eat(","));

    return argumentList;
  }

  /**
   * MemberExpression
   *  : PrimaryExpression
   *  | MemberExpression '.' Idebtifier
   *  | MemberExpression '[ Expression ']'
   *  ;
   */

  MemberExperssion() {
    let object = this.PrimaryExpression();
    while (this._lookahead.type === "." || this._lookahead.type === "[") {
      if (this._lookahead.type === ".") {
        this._eat(".");
        const property = this.Identifier();
        if (this._lookahead.type == "(") {
          const value = this.Arguments();
          object = this._mod.MemberExperssion(false, object, property, value);
        } else {
          object = this._mod.MemberExperssion(false, object, property);
        }
      }

      if (this._lookahead.type === "[") {
        this._eat("[");
        const property = this.Expression();
        this._eat("]");
        object = this._mod.MemberExperssion(true, object, property);
      }
    }

    return object;
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
      case "true":
        return this.BooleanLiteral(true);
      case "false":
        return this.BooleanLiteral(false);
      case "null":
        return this.NullLiteral(null);
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

  /**
   * BooleanLiteral
   *  : 'true'
   *  | 'false'
   *  ;
   */

  BooleanLiteral(value) {
    this._eat(value ? "true" : "false");
    return this._mod.BooleanLiteral(value);
  }

  /**
   * NullLiteral
   *  : 'null'
   *  ;
   */

  NullLiteral(value) {
    this._eat("null");
    return this._mod.NullLiteral(value);
  }

  /**
   * NewExpression
   *  | 'new' MemberExpression Arguments
   */

  NewExpression() {
    this._eat("new");
    return this._mod.NewExpression(this.MemberExperssion(), this.Arguments());
  }

  /**
   * ThisExpression
   *  | 'this'
   */

  ThisExpression() {
    this._eat("this");
    return this._mod.ThisExpression();
  }

  /**
   * Super
   *  | 'super'
   */
  Super() {
    this._eat("super");

    return this._mod.Super();
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
