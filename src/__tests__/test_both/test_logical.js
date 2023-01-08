module.exports = (test) => {
  test(
    `  
  
    let x = 3, y = 5, z= 3;
    x > 2 && y < 2 || z == 2;
  
  `,
    false
  );

  test(
    `  
    let x = 3, y = 1, z= 3;
    x > 2 && y < 2 || z == 2;
  
  `,
    true
  );
};
