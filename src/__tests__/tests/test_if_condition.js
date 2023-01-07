const assert = require("assert");
const { Eva } = require("../../Eva");

module.exports = (eva) => {
  assert.strictEqual(
    eva.eval([
      "begin",
      ["var", "x", 10],
      ["var", "y", 0],
      ["if", [">", "x", 10], ["set", "y", 20], ["set", "y", 30]],
      "y",
    ]),
    30
  );
};
