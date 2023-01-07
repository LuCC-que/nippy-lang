const assert = require("assert");
module.exports = (eva) => {
  assert.strictEqual(
    eva.evalGlobal(
      [
        "class",
        "Point",
        "null",
        [
          "begin",
          [
            "def",
            "constructor",
            ["this", "x", "y"],
            [
              "begin",
              ["set", ["prop", "this", "x"], "x"],
              ["set", ["prop", "this", "y"], "y"],
            ],
          ],
          [
            "def",
            "calc",
            ["this"],
            ["+", ["prop", "this", "x"], ["prop", "this", "y"]],
          ],
        ],
      ],
      ["var", "p", ["new", "Point", 10, 20]],
      [["prop", "p", "calc"], "p"]
    ),
    30
  );

  //inheretance
  assert.strictEqual(
    eva.evalGlobal(
      [
        "class",
        "Point3D",
        "Point",
        [
          "begin",
          [
            "def",
            "constructor",
            ["this", "x", "y", "z"],
            [
              "begin",
              [["prop", ["super", "Point3D"], "constructor"], "this", "x", "y"],
              ["set", ["prop", "this", "z"], "z"],
            ],
          ],
          [
            "def",
            "calc",
            ["this"],
            [
              "+",
              [["prop", ["super", "Point3D"], "calc"], "this"],
              ["prop", "this", "z"],
            ],
          ],
        ],
      ],
      ["var", "p", ["new", "Point3D", 10, 20, 30]],
      [["prop", "p", "calc"], "p"]
    ),
    60
  );
};
