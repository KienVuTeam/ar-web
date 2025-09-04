/**
 * mongoose-crud-cheatsheet.js
 * Tổng hợp các phương thức thao tác DB trong Mongoose
 */

//////////////////////
// 🟢 CREATE (Tạo mới)
//////////////////////

// Cách 1: new + save()
const doc = new Model({ field: "value" });
await doc.save();

// Cách 2: Model.create()
await Model.create({ field: "value" });

// Cách 3: insertMany
await Model.insertMany([{ field: "a" }, { field: "b" }]);


//////////////////////
// 🔵 READ (Đọc dữ liệu)
//////////////////////

// Tìm nhiều
await Model.find({ status: "active" });

// Tìm một
await Model.findOne({ email: "test@gmail.com" });

// Tìm theo _id
await Model.findById("507f1f77bcf86cd799439011");

// Kiểm tra tồn tại
await Model.exists({ username: "abc" });

// Đếm
await Model.countDocuments({ status: "active" });
await Model.estimatedDocumentCount();

// Distinct
await Model.distinct("category");

// Aggregation
await Model.aggregate([{ $match: { status: "active" } }]);


//////////////////////
// 🟠 UPDATE (Cập nhật)
//////////////////////

// Update một
await Model.updateOne({ _id: id }, { $set: { name: "new name" } });

// Update nhiều
await Model.updateMany({ status: "active" }, { $set: { status: "inactive" } });

// Tìm một + update
await Model.findOneAndUpdate(
  { email: "test@gmail.com" },       //filter
  { $set: { status: "active" } },    //update
  { new: true, runValidators: true } //options: tra ve document sau khi update
);

// Tìm theo _id + update
await Model.findByIdAndUpdate(
  id,
  { $set: { name: "new name" } },
  { new: true }
);


//////////////////////
// 🔴 DELETE (Xóa dữ liệu)
//////////////////////

// Xóa một
await Model.deleteOne({ _id: id });

// Xóa nhiều
await Model.deleteMany({ status: "inactive" });

// Tìm một + xóa
await Model.findOneAndDelete({ email: "test@gmail.com" });

// Tìm theo _id + xóa
await Model.findByIdAndDelete(id);


/////////////////////////////////////////
// ⚡ DOCUMENT INSTANCE METHODS (per doc)
/////////////////////////////////////////

const doc2 = await Model.findOne();
await doc2.save();          // lưu
await doc2.remove();        // xóa
await doc2.deleteOne();     // xóa
doc2.toObject();            // convert object JS thuần
doc2.toJSON();              // convert JSON
await doc2.populate("user"); // join dữ liệu (ref)
await doc2.validate();       // chạy validate


/////////////////////////////////////
// ⚡ QUERY HELPERS (chaining query)
/////////////////////////////////////

await Model.find({ status: "active" })
  .select("name email")     // chọn field
  .sort({ createdAt: -1 })  // sắp xếp
  .skip(10)                 // bỏ qua 10 doc
  .limit(5)                 // giới hạn 5 doc
  .populate("category")     // join
  .lean();                  // object JS thuần

  //===================== mongoose auto cast
// ✅ Tóm lại (Mongoose auto-cast)
// Client gửi	            Schema field	    Kết quả
// "25" (string)	        Number	            25 (ok)
// 25 (number)	            String	            "25"
// "" (string rỗng)	        Number	            null
// null	                    Number/String	    null
// "abc"(string không số)	Number	            ❌ CastError
// Object/Array sai kiểu	Không match	        ❌ CastError