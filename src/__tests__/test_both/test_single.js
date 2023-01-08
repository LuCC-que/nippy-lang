module.exports = (test) => {
  test(
    `  
  
  42;  
  
  `,
    42
  );

  test(
    `  
  
  "hello";  
  
  `,
    "hello"
  );

  test(
    `
    {
      "hello";

    }

    43;
    "43";
    
    `,
    "43"
  );

  test(
    `
    (2);
    
    `,
    2
  );
};
