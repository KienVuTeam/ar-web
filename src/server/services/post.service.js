//services/PostService.js
const { isValidObjectId } = require("mongoose");
const PostEntity = require("../model/Post");
class PostService {
  async Add(data) {
    try {
      var _post = new PostEntity(data);
      var result = await _post.save();
      return { success: true, data: [] };
    } catch (error) {
      console.log("Post_S " + error);
      return { success: false };
    }
  }
  async List() {
    try {
      var result = await PostEntity.find().lean();
      return { success: true, data: result };
    } catch (error) {
      console.log("P_S " + error);
      return { success: failed };
    }
  }

  async ListPostAndCategory() {
    try {
      var posts = await PostEntity.find()
        .populate({ path: "category_id", select: "name status" })
        .lean();
      // 2. Filter chỉ giữ post có category status = true
      //   const filteredPosts = posts.filter(
      //     (post) => post.category_id && post.category_id.status === true,
      //   );
      return { success: true, data: posts };
    } catch (error) {
      console.log("P_S " + error);
      return { success: false };
    }
  }
  async GetById(id) {
    try {
      var post = await PostEntity.findById(id).populate({
        path: "category_id",
        select: "name"
      }).lean();
      return{success: true, data: post}
    } catch (error) {
        console.log("P_S "+error)
        return{success: false}
    }
  }
  async Update(data, id) {
    try {
        var result =await PostEntity.findOneAndUpdate(
            {_id: id},
            {$set: data}
        )
        return{success: true, data:result}
    } catch (error) {
        console.log("P_S "+error)
        return{success: false}
    }
  }
  async Delete(id) {
    try {
      await PostEntity.deleteOne({_id: id})
      return {success: true}
    } catch (error) {
      console.log("P_S: ",error)
      return {success: false, mess: error}
    }
  }
}

module.exports = new PostService(); //export instance
