module.exports = (test) => {
  test(
    `  
  
    let j = 0;
    for(let i = 0, z=0; i < 10; ++i){
  
      ++j;
      
    }
  
    j;
  
  `,
    10
  );

  test(
    `  
    let j = 0;
    while(j < 10){
      ++j;
    }
    j;
  
  `,
    10
  );
};
