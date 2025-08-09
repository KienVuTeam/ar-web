const mongoose = require("mongoose");
const slugify = require("slugify");

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String },
    description: { type: String },
    status: { type: Boolean, required: true},
  },
  { timestamps: true }
);

// 🔥 Tự động xử lý slug trước khi lưu
CategorySchema.pre("save", function (next) {
  // Nếu người dùng có nhập slug → vẫn xử lý lại bằng slugify
  if (this.slug && this.slug.trim() !== "") {
    this.slug = slugify(this.slug, { lower: true, strict: true });
  } else {
    // Nếu không nhập thì lấy từ name
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
