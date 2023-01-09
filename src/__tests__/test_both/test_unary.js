module.exports = (test) => {
  test(
    `  
    let x = false;
    if(!x){
      x = 5;
    }
    ++x;
  
  `,
    6
  );

  test(
    `  
  
    let x = false;
    if(!x){
      x = 5;
    }
    --x; 
  
  `,
    4
  );

  test(
    `
    let x = true;
    if(x){
      x = !x;
    }
    x;
    `,
    false
  );

  test(
    `
    let x = true;
    if(x){
      x = !x;
    }
    if(!x){
      x = 1;
    }
    x;
    
    `,
    1
  );
};
