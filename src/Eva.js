const { isNumber, isString, isVariableName } = require("./utils/Helper");
const { Environment } = require("./utils/Environment");
class Eva {
  constructor(global = new Environment()) {
    this.global = global;
  }
  eval(exp, env = this.global) {
    if (isNumber(exp)) {
      return exp;
    }

    if (isString(exp)) {
      return exp.slice(1, -1);
    }

    if (isVariableName(exp)) {
      return env.lookup(exp);
    }

    if (exp[0] === "begin") {
      const blockEnv = new Environment({}, env);
      return this._evalBlock(exp, blockEnv);
    }

    if (exp[0] == "var") {
      const [_, name, value] = exp;

      //make a new env
      //eval the value
      return env.define(name, this.eval(value, env));
    }

    if (exp[0] === "set") {
      const [_, name, value] = exp;
      return env.assign(name, this.eval(value, env));
    }

    if (exp[0] === "+") {
      return this.eval(exp[1], env) + this.eval(exp[2], env);
    }
    if (exp[0] === "*") {
      return this.eval(exp[1], env) * this.eval(exp[2], env);
    }

    if (exp[0] === "-") {
      return this.eval(exp[1], env) - this.eval(exp[2], env);
    }

    if (exp[0] === "/") {
      return this.eval(exp[1], env) / this.eval(exp[2], env);
    }
    if (exp[0] === "%") {
      return this.eval(exp[1]) % this.eval(exp[2]);
    }
  }

  _evalBlock(block, blockEnv) {
    let result;
    const [_tag, ...expressions] = block;

    expressions.forEach((exp) => {
      result = this.eval(exp, blockEnv);
    });

    return result;
  }
}

module.exports = { Eva };
