module.exports = (test) => {
  test(
    `  
  
    let a = list[0, 1, 2,3,4,5];
    a;
  
  `,
    [0, 1, 2, 3, 4, 5]
  );

  test(
    `
    let a = 10;
    let b = list[0, 1, 2,3,4,5];
    b.push(a);
    b[6];

  `,
    10
  );

  test(
    `

    let b = list[0, 1, 2,3,4,5];

    for(let a = 0; a < 6; ++a){
      if(b[a] >= 0){
        b[a] -= 5;
      }
    }

    b[5];

  `,
    0
  );
};
