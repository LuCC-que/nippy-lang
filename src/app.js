const express = require("express");

const app = express();

app.get("/", (_, res) => {
  res.send("Hi hdsi  ddd  hi there");
});

app.listen(8080, () => {
  console.log("listening in 8080");
});
