module.exports = (test) => {
  test(
    `  
  
    def square(x){
      return x * x;
    }

    square(2);
  
  `,
    4
  );

  test(
    `  

    def addTen(x){
      if(x > 1){
        x = x + 10;
      }
    }

    addTen(3);
  
  `,
    13
  );

  test(
    `

    def addToTen(x){

      for(let b = 0; b < 4; ++b){
        if(x[b] > 0){
          x[b] -= 1;
        }
        else{
          x[b] = b;
        }

      }

      return x;
    }

    addToTen(list[0, 1, 2, 3, 4]);

  `,
    [0, 0, 1, 2, 4]
  );
  test(
    `

    let b = Lambda(x, y){
      return x + y;
    };

    def IneedFunction(func){
      return func(2, 3);
    }

    IneedFunction(b);

  `,
    5
  );
  test(
    `

    def addToTen(x, y){

      for(let b = 0; b < 4; ++b){
        if(x[b] > 0){
          x[b] -= 1;
        }
        else{
          x[b] = b;
        }
    
      }
    
      return x[y];
    }
    
    addToTen(list[0, 1, 2, 3, 4], 3);

  `,
    2
  );
};
