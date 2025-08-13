const app = require("./app");
require("dotenv").config();
// const PORT = process.env.PORT || 3000;
//const HOST ='0.0.0.0';


app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
