module.exports = (test) => {
  test(
    `  
  
    let x, y = 5;
    y;
  
  `,
    5
  );

  test(
    `  
   let x, y = 10;
   x = 5;
    x;
  `,
    5
  );

  test(
    `  
    let x, y = 10;
    x = 5;
    y;
  `,
    10
  );
  test(
    `  
    let x, y = 10;
    x = 5;
    y = x + y;
  
  `,
    15
  );
  test(
    `  


    let x , y = 5;
    x = y * 3;
    x + y -(10 / 5);

  `,
    18
  );
};
