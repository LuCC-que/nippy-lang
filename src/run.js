const assert = require("assert");
const { Eval } = require("./Eval");
const { Parser } = require("./Parser");
const parser1 = new Parser();
const eval1 = new Eval();
const CODE = `

class Person {

  def constructor(n, a) {
    this.name = n;
    this.age = a;
  }

  def GetName(){
    return this.name;
  }

  def GetAge(){
    return this.age;
  }

  def SetAge(num){
    this.age += num;
  }
}

let p = new Person("Lu Chen", 4);

p.GetAge();
p.GetName();

  `;

const ParseRst = parser1.parse(CODE, "lAST");
console.log("running code", JSON.stringify(ParseRst, null, 2));
console.log("running result", eval1.evalGlobal(ParseRst));
