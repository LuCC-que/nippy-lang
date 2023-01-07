const assert = require("assert");
const { Eva } = require("../../Eva");

module.exports = (eva) => {
  assert.strictEqual(
    eva.eval([
      "begin",
      ["var", "counter", 10],
      ["var", "result", 0],
      [
        "while",
        [">", "counter", 0],
        [
          "begin",
          ["set", "result", ["+", "result", 1]],
          ["set", "counter", ["-", "counter", 1]],
        ],
      ],
      "result",
    ]),
    10
  );
};
