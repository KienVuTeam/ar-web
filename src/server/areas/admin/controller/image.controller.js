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
  const pathUpload = path.resolve(__dirname, "../../../../uploads");

  return {
    Index: (req, res) => {
      // console.log(__dirname);
      // console.log(pathUpload);
      res.render("img/upload", {
        layout: "layout/layoutAdmin",
        title: "Admin | [Upload",
      });
      // res.send("hrllo")
    },
    Upload: async (req, res) => {
      // console.log("runn");
      try {
        const file = req.file;
        const folder = req.body.folder;
        var currentPath = folder;
        //
        // console.log("folder: "+folder)
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
        const realPath = path.join(pathUpload, currentPath);
        const uploadPath = path.join(realPath, filename);
        console.log("path upload:" +realPath);
        // console
        // 👉 Tạo thư mục cha nếu chưa có
        fs.mkdirSync(realPath, { recursive: true });

        // console.log("path: ", uploadPath);
        fs.writeFileSync(uploadPath, file.buffer);

        res.json({ success: true, file: filename });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi khi xử lý ảnh" });
      }
    },
    ListFolders: (req, res) => {
      try {
        const folders = fs.readdirSync(pathUpload).filter((file) => {
          const fullPath = path.join(pathUpload, file);
          return fs.statSync(fullPath).isDirectory();
        });
        // console.log(folders);
        res.json({ folders });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Không thể đọc thư mục uploads" });
      }
    },
    ListImagesInFolder: (req, res) => {
      // console.log("AAA")
      const folderName = req.params.folder;
      const folderPath = path.join(pathUpload, folderName);

      if (!fs.existsSync(folderPath)) {
        return res.status(404).json({ error: "Thư mục không tồn tại" });
      }

      try {
        const files = fs.readdirSync(folderPath).filter((file) => {
          const ext = path.extname(file).toLowerCase();
          return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
        });

        res.json({
          folder: folderName,
          images: files.map((file) => ({
            name: file,
            url: `/uploads/${folderName}/${file}`,
          })),
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Không thể đọc ảnh trong thư mục" });
      }
    },
  };
};
