const app = require("./app");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const multerUpload = require("./config/multerUpload");

//test


//end test

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
