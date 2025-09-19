// \Workspaces\Nodejs\access-race\src\server\config
const path = require("path");
module.exports = {
  root: path.join(__dirname, "../../../"),
  root2: path.resolve(__dirname, "../", "../", "../"),
  uploads: path.resolve(__dirname, "../../../src/uploads"),
};
