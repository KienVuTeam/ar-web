const fs = require("fs");
const path = require("path");
const Category = require("../../../model/Category");
const Post = require('../../../model/Post');
const mongoose  = require('mongoose');

const stringValue = require("../../../stringValue");
// const baseUploadPath = path.join(__dirname, "../uploads");
const baseUploadPath = stringValue.BASEURLUPLOAD; // Đường dẫn đến thư mục uploads

class NewsController {


  //
  Index(req, res) {
    res.send("blog controller");
  }
  async AddCategory(req, res) {
    try {
      const name = req.body.name;
      const nameEN = req.body.nameEN;
      const slug = req.body.slug;
      var isActive =null;
      if(typeof(req.body.isActive) === "boolean"){
        isActive= req.body.isActive
      }
      console.log(name, nameEN, slug, isActive);
      console.log(typeof(isActive))
      const desc = "Mo ta"; //filed ko co tren ui

      // Giả sử bạn lưu vào database ở đây
      // console.log("Dữ liệu nhận được:", name, slug, status, desc);
      var ct = new Category({
        name: name,
        slug: slug,
        status: isActive,
        description: desc,
      });
      await ct.save();
      const result =await Category.find();
      res.json(result);
      // res.redirect("/admin/news/form-create-category");
    } catch (error) {
      console.log("loi them moi category" + error);
      res.status(500).send("Lỗi khi tạo danh mục");
    }
  }
  async FormCreateCategory(req, res) {
    const categories = await Category.find();
    // res.render('admin/category/index', { categories }); // Gửi sang view EJS
    res.render("admin/news/FormCreateCategory", {
      layout: "layout/layoutAdmin",
      categories,
    });
  }
  //
  async UpdateCategory(req, res){
    console.log("running")
    try{
      const id =req.params.id;
      const name = req.body.name;
      const nameEN = req.body.nameEN;
      const slug = req.body.slug;
      var isActive =null;
      if(typeof(req.body.isActive) === "boolean"){
        isActive= req.body.isActive
      }
      console.log("UpdateCategory: ", id, name, nameEN, slug, isActive);
      //entity
      const c=new Category({
        _id: id,
        name: name,
        slug: slug,
        status: isActive,
        description: "Mo ta", //filed ko co tren ui
      });
      console.log(name, nameEN, slug, isActive, id);
      await Category.findByIdAndUpdate(id, c );
      const categories = await Category.find();
      res.json(categories);
    }catch(error){
      console.error("Error updating category:", error);
      res.status(500).send("Lỗi khi cập nhật danh mục");
    }
  }

  //
  async FormCreatePost(req, res) {
    // console.log("this in FormCreatePost:", this);
    try {
      // Lấy danh sách thư mục trong thư mục uploads
      const folders = fs
        .readdirSync(baseUploadPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
        //Lay danh sach thu muc
        const categories = await this._LoadCategories();

      res.render("admin/news/FormCreatePost", {
        layout: "layout/layoutAdmin",
        folders: folders,
        // images: images,
        categories: categories,
        folderName: null, // Chưa có thư mục nào được chọn
      });
    } catch (error) {
      console.log("Lỗi khi lấy danh sách thư mục:", error);
      res.status(500).send("Lỗi khi lấy danh sách thư mục");
    }
  }

  //==
  async CreatePost(req, res){
    // console.log("this in CreatePost:", this);
    try {
      const title = req.body.title;
      const desc = req.body.desc;
      const content = req.body.content; // Assuming content is sent as plain text
      const category = req.body.category;
      const keyMeta = req.body.keyMeta;
      const descMeta = req.body.descMeta;
      const dataFolder = req.body.dataFolder; 
      
      // object
      const post = new Post({
        title: title,
        slug: null, // Slug sẽ được tự động tạ
        desc: desc,
        content: content,
        keyMeta: keyMeta,
        descMeta: descMeta,
        imageFolder: dataFolder,
      });
      const indexes = await mongoose.connection.collection('posts').indexes();
      console.log(indexes);

      const result = await post.save();
      // res.redirect("/admin/news/form-create-post");
      res.status(200).json({
        status: "Ok",
        mess: "Bài viết đã được tạo thành công!",
        post: result,
      });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).send("Lỗi khi tạo bài viết");
    }
  }
  //
  async PostList(req, res){
    try {
      const posts = await Post.find();
      const categories = await this._LoadCategories();
      res.render('admin/news/posts', {layout: 'layout/layoutAdmin', posts, categories}) //admin/news/FormCreateCategory
    } catch (error) {
      console.error("Error when get all post:", error);
      res.status(500).send("Lỗi khi lấy danh sách bài viết");
    }
  }


  //common func not action ====================
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


  //Common func
  async _LoadCategories(){
    try{
      const categories =await Category.find();
      // console.log("categories: "+categories);
      return categories;
    }catch(error){
      console.error("Error loading categories:", error);
      return [];
    }
  }


}

module.exports = new NewsController();
