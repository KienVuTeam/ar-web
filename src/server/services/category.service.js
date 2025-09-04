const { json } = require("body-parser");
const CategoryEntity = require("../model/Category");

class CategoryService {
  async Add(data) {
    try {
      const _category = new CategoryEntity(data);
      await _category.save();
      return true;
    } catch (error) {
      console.log("err: " + error);
      return false;
    }
  }
  async List() {
    try {
      var categories = await CategoryEntity.find().lean();
      return { success: true, data: categories };
    } catch (error) {
      console.log("Category_S: " + error);
      return { success: false };
    }
  }
  GetById() {}
  async Update(data, id) {
    try {
      const plain = data.toObject();
      delete plain._id; //xoa id
      var result = await CategoryEntity.updateOne(
        { _id: id },
        { $set: plain },
      );
      console.log(result);
      return { success: true, data: result };
    } catch (error) {
      console.log("Cat_S" + error);
      return { success: false };
    }
  }
  async Delete(id) {
    try {
        var result =await CategoryEntity.deleteOne({_id: id})
        return {success: true}
    } catch (error) {
        console.log("Cat_S "+error)
        return {success: false}
    }
  }
}

module.exports = new CategoryService(); //export instance | singleton
