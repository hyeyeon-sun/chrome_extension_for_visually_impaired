const tr = require("googletrans").default;

tr(["Hello", "world"], "ko")
  .then(function (result) {
    console.log(result.textArray); 
    console.log(result.src); 
  })
  .catch(function (error) {
    console.log(error);
  });