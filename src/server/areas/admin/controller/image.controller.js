// controller/imageController.js
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const FileType = require("file-type");
const { title } = require("process");

module.exports = () => {
  // const pathUpload ='C:\Workspaces\Nodejs\access-race\src\upload';
  //C:\Workspaces\Nodejs\access-race\src\server\areas\admin\controller\image.controller.js

  // const pathUpload = "C:\\Workspaces\\Nodejs\\access-race\\src\\uploads";
  // Tạo đường dẫn tuyệt đối đến thư mục uploads
const pathUpload = path.resolve(__dirname, '../../../../uploads');

  return {
    Index: (req, res) => {
      console.log(__dirname)
      console.log(pathUpload)
      res.render("img/upload", {
        layout: "layout/layoutAdmin",
        title: "Admin | [Upload",
      });
      // res.send("hrllo")
    },
    Upload: async (req, res) => {
      console.log("runn");
      try {
        const file = req.file;
        var currentPath = 'event';
        if (!file)
          return res
            .status(400)
            .json({ error: "Không có file nào được upload" });
        const type = await FileType.fromBuffer(file.buffer);
        // const type = await FileType.fileTypeFromBuffer(file.buffer);
        if (
          !type ||
          !["jpg", "jpeg", "png", "gif", "webp"].includes(type.ext)
        ) {
          return res.status(400).json({ error: "File không hợp lệ" });
        }
        const filename = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}.${type.ext}`;
        //custom targetDir
        const realPath = path.join(pathUpload, currentPath)
        const uploadPath = path.join(realPath, filename);
        // console
        // 👉 Tạo thư mục cha nếu chưa có
        fs.mkdirSync(realPath, { recursive: true });

        console.log("path: ", uploadPath);
        fs.writeFileSync(uploadPath, file.buffer);

        res.json({ success: true, file: filename });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi khi xử lý ảnh" });
      }
    },
  };
};
