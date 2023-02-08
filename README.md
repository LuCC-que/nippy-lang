## NIPPY

---

### The Nippy interpreter is based on JavaScript, making it a type of interpreter that interprets interpreters.

---

### In addition to all the basic programming feature, like condition, funtion and list, it also support lambda, and OOB programming

### Some Examples from test cases:

#### defining function

```
def square(x){
  return x * x;
}

square(2);
```

#### for loop

```
let j = 0;
for(let i = 0, z=0; i < 10; ++i){
  ++j;
  j -= z; //z is always 0
}
j;
```

#### while loop

```
let j = 0;
while(j < 10){
  ++j;
}
j;
```

#### class

```
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
```

---

## how to use it

Download the code and open the following file

```
.\src\run.js
```

put your code inside the code section and use the node.js to run this run.js file
