/**
 * 📝 cleanObject(obj)
 * -------------------
 * Dùng để loại bỏ các field có giá trị `undefined` trong object.
 * Rất hữu ích khi bạn map data từ client sang schema rồi dùng cho UPDATE.
 * 
 * ⚡ Tại sao cần?
 * - Nếu để `undefined`, MongoDB update sẽ ghi đè field trong DB thành `undefined`.
 * - Nếu bỏ field đi, MongoDB sẽ giữ nguyên giá trị cũ (an toàn hơn).
 * 
 * 📌 Cách hoạt động:
 * - Object.entries(obj) -> lấy ra mảng [key, value].
 * - filter(([k,v]) => v !== undefined) -> lọc bỏ value undefined.
 * - Object.fromEntries(...) -> convert về object mới.
 * 
 * 📚 Ví dụ:
 * const obj = { title: "Hello", desc: undefined, slug: "my-slug" };
 * const clean = cleanObject(obj);
 * console.log(clean); // { title: "Hello", slug: "my-slug" }
 */

function cleanObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => v !== undefined)
  );
}

// Export để dùng ở nơi khác
module.exports = { cleanObject };


//=============================
/*💡 Best practice khi bạn dùng new Model().toObject() cho update

Loại bỏ _id và __v (vì update không cần):

const obj = new PostEntity(mappedData).toObject();
delete obj._id;
delete obj.__v;


Bỏ field undefined để tránh overwrite DB bằng undefined:

const cleanObj = Object.fromEntries(
  Object.entries(obj).filter(([k, v]) => v !== undefined)
);


Dùng để update:

await PostEntity.updateOne(
  { _id: req.params.id },
  { $set: cleanObj }
);


👉 Với cách này bạn giữ được sự “tiện” của new Model().toObject() (đảm bảo đúng tên field schema, có default), nhưng tránh overwrite lung tung với undefined hoặc _id.
*/

//===================================
// new Model() = Document object “siêu cấp”: vừa chứa data, vừa chứa methods, vừa có metadata → sinh ra để làm việc với MongoDB.

// new Class = Object thường: chỉ chứa field và method bạn viết → không có gì đặc biệt ngoài JS.