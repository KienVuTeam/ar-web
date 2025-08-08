const fs = require("fs");
const path = require("path");
const Category = require("../../../model/Category");

const stringValue = require("../../../stringValue");
// const baseUploadPath = path.join(__dirname, "../uploads");
const baseUploadPath = stringValue.BASEURLUPLOAD; // Đường dẫn đến thư mục uploads

class NewsControler {
  Index(req, res) {
    res.send("blog controller");
  }
  async AddNewCategory(req, res) {
    // const { name, slug, status, description } = req.body;
    //hung data
    try {
      const name = req.body.name;
      const slug = req.body.slug;
      const status = true;
      const desc = "Mo ta";

      // Giả sử bạn lưu vào database ở đây
      console.log("Dữ liệu nhận được:", name, slug, status, desc);
      var ct = new Category({
        name: name,
        slug: slug,
        status: status,
        description: desc,
      });
      await ct.save();
      console.log("Danh mục đã được tạo!");
      res.redirect("/admin/news/form-create-category");
    } catch (error) {
      console.log("" + error);
      res.status(500).send("Lỗi khi tạo danh mục");
    }
  }
  async FormCreateCategory(req, res) {
    //chu y thu tu tham so
    const categories = await Category.find(); // Lấy tất cả category
    // res.render('admin/category/index', { categories }); // Gửi sang view EJS
    res.render("admin/news/FormCreateCategory", {
      layout: "layout/layoutAdmin",
      categories,
    });
    // res.send("hello");
  }

  //
  async FormCreatePost(req, res) {
    // console.log("path: "+stringValue.BASEURLUPLOAD);
    try {
      // Lấy danh sách thư mục trong thư mục uploads
      const folders = fs
        .readdirSync(baseUploadPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
      // console.log("folders: "+folders);
      const images = null;
      res.render("admin/news/FormCreatePost", {
        layout: "layout/layoutAdmin",
        folders: folders,
        images: images,
        folderName: null, // Chưa có thư mục nào được chọn
      });
    } catch (error) {
      console.log("Lỗi khi lấy danh sách thư mục:", error);
      res.status(500).send("Lỗi khi lấy danh sách thư mục");
    }
  }

  //

  //common func not action
  ShowImage(req, res) {
    console.log("running");
    const folderName = req.params.name;
    console.log("folderName: " + folderName);
    const folderPath = path.join(baseUploadPath, folderName);

    if (!fs.existsSync(folderPath))
      return res.status(404).send("Thư mục không tồn tại");

    const images = fs
      .readdirSync(folderPath)
      .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));
    console.log("images: " + images);
    res.json({ folderName, images });
  }
  
  async ShowImagePartial(req, res) {
    const folderName = req.params.name;
    const folderPath = path.join(baseUploadPath, folderName);

    if (!fs.existsSync(folderPath)) {
      return res.status(404).send("Thư mục không tồn tại");
    }

    const images = fs
      .readdirSync(folderPath)
      .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));

    res.render("partials/imgList", { folderName, images, layout: false });
  }
}

module.exports = new NewsControler();
