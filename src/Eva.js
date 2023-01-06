const { isNumber, isString } = require("./utils/Helper");

class Eva {
  eval(exp) {
    if (isNumber(exp)) {
      return exp;
    }

    if (isString(exp)) {
      return exp.slice(1, -1);
    }

    if (exp[0] === "+") {
      return this.eval(exp[1]) + this.eval(exp[2]);
    }
    if (exp[0] === "-") {
      return this.eval(exp[1]) - this.eval(exp[2]);
    }
    if (exp[0] === "*") {
      return this.eval(exp[1]) * this.eval(exp[2]);
    }
    if (exp[0] === "/") {
      return this.eval(exp[1]) / this.eval(exp[2]);
    }
    if (exp[0] === "%") {
      return this.eval(exp[1]) % this.eval(exp[2]);
    }
  }
}

module.exports = { Eva };
