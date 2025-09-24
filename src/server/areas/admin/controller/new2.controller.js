//controller.categoryController
//export mot function tra ve object
const CategoryEntity = require("../../../model/Category");
const PostEntity = require("../../../model/Post");
const categoryService = require("../../../services/category.service");
module.exports = (_categoryService, _postService) => {
  // helper load list categories
  const getCategories = async () => {
    const result = await _categoryService.List();
    return result.success ? result.data : [];
  };
  const getPosts = async () => {
    var result = await _postService.List();
    if (result.success) {
      return result.data || [];
    }
  };
  return {
    //category
    Index: async (req, res) => {
      //   res.send("CategoryController_Index");
      try {
        var result = await _categoryService.List();

        console.log(result.data.length);
        if (result.success) {
          return res.render("admin/news/index", {
            layout: "layout/layoutAdmin",
            categories: result.data,
          });
        }
      } catch (error) {
        res.status(500).json({ success: false, mess: error });
      }
    },
    FormCreate: (req, res) => {
      res.render("admin/category/index", { layout: "layout/layoutAdmin" });
    },
    CreateCategory: async (req, res) => {
      try {
        //data
        const data = req.body;
        const category = new CategoryEntity({
          name: data.name,
          slug: data.slug,
          status: data.isActive == true ? true : false,
        });
        var result = await _categoryService.Add(category);
        if (result) {
          var _categories = await getCategories();
          res.json({ success: true, data: _categories });
        }
      } catch (error) {
        res.json({ success: false, mess: error });
      }
    },
    UpdateCategory: async (req, res) => {
      //6893269b472e3c320fe480ef /6893269b472e3c320fe480ef
      try {
        var _data = req.body;
        var _id = req.params.id;
        var cat = new CategoryEntity({
          name: _data.name,
          slug: _data.slug,
          status: _data.isActive == true ? true : false,
        });
        var result = await categoryService.Update(cat, _id);
        if (result.success) {
          var _categories = await getCategories();
          res.json({ success: true, data: _categories });
        }
      } catch (error) {
        console.log("Cat_C " + error);
        res.status(500).json({ success: false, mess: error });
      }
    },
    DeleteCategory: async (req, res) => {
      try {
        const _id = req.body.id;
        var result = await categoryService.Delete(_id);
        if (result.success) {
          res.json({ success: true });
        }
      } catch (error) {
        console.log("Cat_C " + error);
        res.status(500).json({ success: false, mess: error });
      }
    },
    //============================= Post index
    FormCreatePost: async (req, res) => {
      res.render("admin/news/postform", {
        layout: "layout/layoutAdmin",
        categories: await getCategories(),
      });
    },
    CreatePost: async (req, res) => {
      try {
        const data = req.body;
        var post = new PostEntity({
          title: data.title,
          category_id: data.category,
          desc: data.desc,
          content: data.content,
          slug: data.slug,
          imageFolder: data.imagePath,
          keyMeta: data.keyMeta,
          descMeta: data.descMeta,
        });
        //
        var result = await _postService.Add(post);
        if (result.success) {
          res.json({ success: true, data: [] });
        }
      } catch (error) {
        console.log("P_C " + error);
        res.status(500).json({ success: false, mess: error });
      }
    },
    FormEditPost: async (req, res) => {
      const id = req.params.id;
      var _post = await _postService.GetById(id);
      var _categories = await getCategories();
      // console.log(_post);
      res.render("admin/news/postedit", {
        layout: "layout/layoutAdmin",
        post: _post.data,
        categories: _categories,
      });
    },
    UpdatePost: async (req, res) => {
      try {
        const _id = req.params.id;
        const data = req.body;
        const obj = new PostEntity({
          title: data.title,
          category_id: data.category,
          desc: data.desc,
          
          content: data.content,
          slug: data.slug,
          imageFolder: data.imagePath,
          keyMeta: data.keyMeta,
          descMeta: data.descMeta,
        }).toObject();
        delete obj._id;
        delete obj.__v;
        const cleanObj = Object.fromEntries(
          Object.entries(obj).filter(([k, v]) => v !== undefined),
        );
        //
        var result = await _postService.Update(cleanObj, _id);
        if (result.success) {
          res.json({ success: true, data: [] });
        }else{
          res.json({success: false})
        }
      } catch (error) {
        console.log("P_C: ",error);
        res.status(500).json({success: false})
      }
    },
    PostIndex: async (req, res) => {
      res.render("admin/news/postlist", {
        layout: "layout/layoutAdmin",
        posts: await getPosts(),
      });
    },
    ListPostAndCategory: async (req, res) => {
      var data = await _postService.ListPostAndCategory();
      // console.log(data.data)
      res.render("admin/news/postlist", {
        layout: "layout/layoutAdmin",
        posts: data.data,
      });
    },

    DeletePost: async (req, res) => {
      try {
        // const _id = req.body.id;
        const _id = req.params.id;
        var result = await _postService.Delete(_id);
        console.log(_id)
        if(result.success){
          const _posts = await getPosts();
          res.json({success: true, posts:_posts})
        }else{res.json({success: false})}
      } catch (error) {
        console.log("P_C: ",error)
        res.status(500).json({success: false})
      }
    },
  };
};
