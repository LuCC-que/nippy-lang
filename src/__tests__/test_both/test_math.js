module.exports = (test) => {
  test(
    `  
  
    2 + 2;
  
  `,
    4
  );

  test(
    `  
   5 + 3 - 1;
  
  `,
    7
  );

  test(
    `  
    2 + 4 * 2;
  
  `,
    10
  );
  test(
    `  
    (2 + 3) * 2;
  
  `,
    10
  );
};
