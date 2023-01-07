const { isNumber, isString, isVariableName } = require("./utils/Helper");
const { Environment } = require("./utils/Environment");
class Eva {
  constructor(global = GlobalEnvironment) {
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

    if (exp[0] == "if") {
      const [_tag, condition, consequent, alternate] = exp;

      if (this.eval(condition, env)) {
        return this.eval(consequent, env);
      }

      return this.eval(alternate, env);
    }

    if (exp[0] === "while") {
      const [_tag, condition, body] = exp;
      let result;
      while (this.eval(condition, env)) {
        result = this.eval(body, env);
      }

      return result;
    }

    if (exp[0] === "def") {
      const [_tag, name, params, body] = exp;
      // const fn = {
      //   params,
      //   body,
      //   env,
      // };
      // return env.define(name, fn);

      //JIT
      const varExp = ["var", name, ["lambda", params, body]];
      return this.eval(varExp, env);
    }

    if (exp[0] === "lambda") {
      const [_tag, params, body] = exp;

      return {
        params,
        body,
        env,
      };
    }

    if (Array.isArray(exp)) {
      //find the function object in the environment
      const fn = this.eval(exp[0], env);

      //these args maybe anothe experssion, another varable
      //any other things, so we need to eval them and then save
      //in the array, slice skip the first (function),
      const args = exp.slice(1).map((arg) => this.eval(arg, env));

      //pre-defined function will be returned as function
      if (typeof fn === "function") {
        return fn(...args);
      }

      // 2 user-definded function
      const activationRecord = {};

      // assigning the value to the paremeter here
      fn.params.forEach((param, index) => {
        activationRecord[param] = args[index];
      });

      //local env has a lexical scoping
      const activationEnv = new Environment(activationRecord, fn.env);

      return this._evalBody(fn.body, activationEnv);

      // return this._callUserDefinedFunction(fn, args);
    }

    throw `Unimplemented : ${JSON.stringify(exp)}`;
  }

  _evalBody(body, env) {
    if (body[0] === "begin") {
      return this._evalBlock(body, env);
    }

    return this.eval(body, env);
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

const GlobalEnvironment = new Environment({
  null: null,
  true: true,
  false: false,

  VERSION: "0.1",

  //-----------------
  //native function

  // adding operation
  "+"(op1, op2) {
    return op1 + op2;
  },

  "-"(op1, op2 = null) {
    if (op2 == null) {
      return -op1;
    }
    return op1 - op2;
  },
  "*"(op1, op2) {
    return op1 * op2;
  },
  "/"(op1, op2) {
    if (op2 == 0) {
      throw "NIPPY: Zero devision";
    }
    return op1 / op2;
  },
  "%"(op1, op2) {
    return op1 % op2;
  },

  //binary operation:
  ">"(op1, op2) {
    return op1 > op2;
  },

  ">="(op1, op2 = null) {
    return op1 >= op2;
  },
  "<"(op1, op2) {
    return op1 < op2;
  },
  "<="(op1, op2) {
    if (op2 == 0) {
      throw "NIPPY: Zero devision";
    }
    return op1 <= op2;
  },
  "="(op1, op2) {
    return op1 === op2;
  },

  //unary operation:
  "!"(op1) {
    return !op1;
  },

  print(...args) {
    console.log(...args);
  },
});

module.exports = { Eva };
