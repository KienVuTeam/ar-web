const fs = require("fs");
const path = require("path");

const baseUploadPath = path.join(__dirname, "../uploads");

class HandleFolderController {
  //hien thi danh sach thu muc
  Index(req, res) {
    // res.send('HandleFolderController Action: Index');
    const folders = fs
      .readdirSync(baseUploadPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    res.render("img/index", { folders, layout: false, title: "Image Upload" });
  }
}

module.exports = new HandleFolderController();
