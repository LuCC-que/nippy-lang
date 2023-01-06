const { isNumber, isString } = require("./utils/Helper");

class Eva {
  eval(exp) {
    if (isNumber(exp)) {
      return exp;
    }

    if (isString(exp)) {
      return exp.slice(1, -1);
    }
  }
}

module.exports = { Eva };
