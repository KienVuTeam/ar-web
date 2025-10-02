const mongoose = require("mongoose");
const slugify = require("slugify");
const { EventStatus } = require("../enums/event.enum");

const EventSchame = mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String },
    slug: { type: String, required: true },
    content: { type: String },
    imagePath: { type: String },
    image_thumb: {type: String},
    image_banner: {type: String},
    // image_v_cert: {type: String},
    image_a_cert: {type: String},
    apiLink: { type: String },
    isShow: { type: Boolean, required: true },
    status: { type: Number, enum: Object.values(EventStatus), required: true },
    place: { type: String, required: true },
    rankType: { type: Boolean, required: true },
    startDate: {
      type: Date,
      required: true,
      set: (val) => {
        // Xóa phần giờ, phút, giây
        const d = new Date(val);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      },
    },
    endDate: {
      type: Date,
      required: true,
      set: (val) => {
        // Xóa phần giờ, phút, giây
        const d = new Date(val);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      },
    },
    authorityDate: {
      type: Date,
      required: true,
      set: (val) => {
        // Xóa phần giờ, phút, giây
        const d = new Date(val);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      },
    },
  },
  { timestamps: true },
);
//Tao slug ko trung lap
EventSchame.pre("validate", async function (next) {
  if (this.slug == null) {
    //!this.slug && this.name
    const baseSlug = slugify(this.name, { lower: true, strict: true });
    const timestamp = Date.now();
    // const datePart = moment().format('YYYYMMDDHHmmss');
    this.slug = `${baseSlug}-${timestamp}`;
  }
  next();
});

module.exports = mongoose.model("Event", EventSchame);
