module.exports = (test) => {
  test(
    `

    let b = lambda(x, y){
      return x + y;
    };

    def IneedFunction(func){
      return func(2, 3);
    }

    IneedFunction(b);

  `,
    5
  );
};
