module.exports = (test) => {
  test(
    `  
  
    let x = 5;
    if(x == 5){
      x -= 1;
    }
    x;
  
  `,
    4
  );

  test(
    `  
   let x, y =6;
   if(y == 6 == true){
    x = y / 2;
   }
   if(x == 3 != false){
    x = y + x * 2;
   }
   x;
  
  `,
    12
  );

  test(
    `  
    let x, y = 6;
    if(y == 6 == true){
      x = y / 2;
    }
    else if(x == 3 != false){
      x = y + x * 2;
    }
    x;
  `,
    3
  );
  test(
    `  
    let x, y = 6;
    if(y == 6 == false){
      x = y / 2;
    }
    else if(x != null){
      x = y + x * 2;
    }
    else if(y > 0){
      x = 1;
    }

    if(x > 0){
      x -= 1;
    }
    x;
  
  `,
    0
  );
};
