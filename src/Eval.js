const { isNumber, isString, isVariableName } = require("./utils/Helper");
const { Transformer } = require("./utils/Transfomer");
const { Environment } = require("./utils/Environment");
class Eval {
  constructor(global = GlobalEnvironment) {
    this.global = global;
    this._transformer = new Transformer();
  }

  evalGlobal(experssions, ...args) {
    return this._evalBlock(["begin", experssions, ...args], this.global);
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
      if (exp.length > 3) {
        let [_, ...list] = exp;
        let result;
        while (list.length > 0) {
          const [name, value, ...temp] = list;
          list = temp;
          result = env.define(name, this.eval(value, env));
        }

        return result;
      }
      const [_, name, value] = exp;

      //make a new env
      //eval the value
      return env.define(name, this.eval(value, env));
    }

    if (exp[0] === "set") {
      const [_, ref, value] = exp;

      if (ref[0] === "prop") {
        const [_tag, instance, propName] = ref;
        const instanceEnv = this.eval(instance, env);

        return instanceEnv.define(propName, this.eval(value, env));
      }

      return env.assign(ref, this.eval(value, env));
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

    //----------------------
    //do-while
    if (exp[0] == "do-while") {
      const whileExp = this._transformer.transformDoWhileToWhile(exp);
      return this.eval(whileExp, env);
    }

    //-------------------------
    //for-expression to-do

    if (exp[0] == "for") {
      const whileExp = this._transformer.transformForToWhile(exp);
      return this.eval(whileExp, env);
    }

    //-------------------------
    //Increment: (++ foo) to-do

    if (exp[0] == "++") {
      const whileExp = this._transformer.transformIncToSet(exp);
      return this.eval(whileExp, env);
    }

    //-------------------------
    //Increment: (-- foo) to-do
    if (exp[0] == "--") {
      const whileExp = this._transformer.transformDecToSet(exp);
      return this.eval(whileExp, env);
    }

    //-------------------------
    //Increment: (-= foo dec) to-do

    if (exp[0] == "-=") {
      const whileExp = this._transformer.transformDecEqToSet(exp);
      return this.eval(whileExp, env);
    }

    //-------------------------
    //Increment: (+= foo) to-do
    if (exp[0] == "+=") {
      const whileExp = this._transformer.transformIncEqToSet(exp);
      return this.eval(whileExp, env);
    }

    if (exp[0] === "def") {
      // const [_tag, name, params, body] = exp;
      // // const fn = {
      // //   params,
      // //   body,
      // //   env,
      // // };
      // // return env.define(name, fn);

      // //JIT
      // const varExp = ["var", name, ["lambda", params, body]];

      const varExp = this._transformer.transformDefToVarLambda(exp);
      return this.eval(varExp, env);
    }

    if (exp[0] === "switch") {
      const ifExp = this._transformer.transformSwitchToIf(exp);
      return this.eval(ifExp, env);
    }

    if (exp[0] === "lambda") {
      const [_tag, params, body] = exp;

      return {
        params,
        body,
        env,
      };
    }
    //----------------------------------
    // OOB module
    if (exp[0] === "class") {
      const [_tag, name, parent, body] = exp;

      //null return null
      const parentEnv = this.eval(parent, env) || env;
      const classEnv = new Environment({}, parentEnv);

      this._evalBody(body, classEnv);
      return env.define(name, classEnv);
    }

    if (exp[0] === "super") {
      const [_tag, className] = exp;
      return this.eval(className, env).parent;
    }

    if (exp[0] === "new") {
      const classEnv = this.eval(exp[1], env);
      const instanceEnv = new Environment({}, classEnv);

      const args = exp.slice(2).map((arg) => this.eval(arg, env));

      this._callUserDefinedFunction(classEnv.lookup("constructor"), [
        instanceEnv,
        ...args,
      ]);

      return instanceEnv;
    }

    // property access
    if (exp[0] === "prop") {
      const [_tag, instance, name] = exp;
      const instanceEnv = this.eval(instance, env);

      return instanceEnv.lookup(name);
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

      return this._callUserDefinedFunction(fn, args);
    }

    throw `Unimplemented : ${JSON.stringify(exp)}`;
  }

  _callUserDefinedFunction(fn, args) {
    // 2 user-definded function
    const activationRecord = {};

    // assigning the value to the paremeter here
    fn.params.forEach((param, index) => {
      activationRecord[param] = args[index];
    });

    //local env has a lexical scoping
    const activationEnv = new Environment(activationRecord, fn.env);

    return this._evalBody(fn.body, activationEnv);
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

module.exports = { Eval };
