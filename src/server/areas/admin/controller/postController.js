//controllers/postController.js
//nap service truc tiep trong controller
// const PostService = require("../../../services/post.service");
// module.exports = {
//   Index: (req, res) => {
//     var result = PostService.add();
//     res.send("postController_index")
//   },
//   Action2: (req, res)=>{
//     res.send("postController_action2")
//   }
// };
//nap service bang dependency injection thu cong
module.exports = (postService) => {
  return {
    Index: (req, res) => {
      res.send("postController_index");
    },
    Action2: (req, res) => {
      res.send("postController_action2");
    },
  };
};
