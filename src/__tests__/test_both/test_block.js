module.exports = (test) => {
  test(
    `  
  
    {
      2 + 2;
    }

    //return line
    4 * 1;
  
  `,
    4
  );

  test(
    `  
   {
    5 + 3 - 1;
    2;
   }
   //return line
   7;
  
  `,
    7
  );

  test(
    `  
    {
      {
        {
          2 + 4 * 2;
        }
        1;
      }
      //return line
      10;
    }
    
  
  `,
    10
  );
  test(
    `  
    {
      {
        {
          2 + 4 / 2;
        }
        1 * 3;
      }
      10 - 5;
    }
    //return line
    (5 + 5) / 1;
  
  `,
    10
  );
};
