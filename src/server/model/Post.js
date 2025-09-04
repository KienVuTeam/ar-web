const mongoose = require('mongoose')
const slugify = require('slugify')

const PostSchema = new mongoose.Schema({
    title: {type: String, required: true},
    // type: mongoose.Schema.Types.ObjectId, ref: "Athlete", required: true
    category_id: {type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true},
    slug: {type: String, required: false},
    desc: {type: String, required: true},
    content: {type: String, required: true},
    keyMeta: {type: String, required: false},
    descMeta: {type: String, required: false},
    imageFolder: {type: String, required: false},

},{timestamps: true}
)

PostSchema.pre("validate", async function (next) {
  // Nếu là document mới
  if (this.isNew) {
    if (!this.slug) {
      const baseSlug = slugify(this.title, { lower: true, strict: true });
      const timestamp = Date.now();
      this.slug = `${baseSlug}-${timestamp}`;
    }
  } else {
    // Nếu là update
    if (this.isModified("slug")) {
      // Nếu slug được chỉnh sửa thành rỗng hoặc khác cũ thì tạo slug mới
      if (!this.slug) {
        const baseSlug = slugify(this.title, { lower: true, strict: true });
        const timestamp = Date.now();
        this.slug = `${baseSlug}-${timestamp}`;
      }
    }
  }

  next();
});

// PostSchema.pre('validate', async function(next){
//     if(this.slug == null){
//         const baseSlug = slugify(this.title, {lower: true, strict: true});
//         const timestamp = Date.now();
//         this.slug=`${baseSlug}-${timestamp}`
//     }
//     next();
// })

module.exports = mongoose.model('Post', PostSchema);
