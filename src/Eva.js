const asser = require("assert");
const { isNumber } = require("./utils/Helper");

class Eva {
  eval(exp) {
    if (isNumber(exp)) {
      return exp;
    }
  }
}

module.exports = { Eva };
