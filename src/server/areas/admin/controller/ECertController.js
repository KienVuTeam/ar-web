const CertificatePositionEntity = require("../../../model/CertificatePosition");
const CertificateDataEntity = require("../../../model/CertificateData");
const {
  successResponse,
  errorResponse,
} = require("../../../utils/response.util");
const slugify = require("slugify");
const fs = require("fs");
const sharp = require("sharp");
const TextToSVG = require("text-to-svg");
const path = require("path");
const xlsx = require("xlsx");
const myPath = require("../../../config/path.config");
const { default: mongoose } = require("mongoose");
const { listEvent } = require("../../../services/event.service");
const CNAME = "ECertController.js ";
const VNAME = "admin/e_cert/";
const VLayout = "layout/layoutAdmin";

//funtion helper
function mapRowByIndex(row, contestID, rowNumber) {
  let user = {
    contestId: contestID,
    name: String(row[0] || ""),
    field_1: row[1] || "",
    field_2: row[2] || "",
    field_3: row[3] || "",
    field_4: row[4] || "",
    field_5: row[5] || "",
    field_6: row[6] || "",
    field_7: row[7] || "",
    field_8: row[8] || "",
    field_9: row[9] || "",
    field_10: row[10] || "",
    field_11: row[11] || "",
  };
  //validate
  return user;
}
async function CertDataHelper(id) {
  const result =
    (await CertificateDataEntity.find({ contest_ref: id }).lean()) || [];
  return result;
}
class ECertController {
  async Index(req, res) {
    //
    try {
      const contests = await CertificatePositionEntity.find().lean();
      res.render(VNAME + "index", {
        layout: VLayout,
        title: "E-Cert",
        cl: contests,
      });
    } catch (error) {
      console.log(CNAME + error.message);
      res.render(VNAME + "index", { layout: VLayout, title: "E-Cert", cl: [] });
    }
  }
  async ContestDetail(req, res) {
    try {
      const id = req.params.id;
      const contest = await CertificatePositionEntity.findById(id).lean();
      const cd = await CertDataHelper(id);
      if (!contest) {
        return res
          .status(404)
          .json({ success: false, mess: "ko tim thay contest" });
      }
      res.render(VNAME + "contestConfig", {
        layout: VLayout,
        title: "E-Cert",
        c: contest || {},
        ud: cd || [],
      });
    } catch (error) {
      console.log(CNAME, error);
      res.status(500).json({ success: false, mess: error.message });
    }
  }
  async UploadImage(req, res) {
    try {
      const id = req.body.id;
      const file = req.file;
      if (!file) {
        return res.status(400).json({ success: false, mess: "ko co file anh" });
      }
      const imgPath = "/e-cert/adsys/" + file.filename;
      //   console.log("imgPath: ", imgPath);
      //xoa imgpath cu
      const imgPathOld = await CertificatePositionEntity.findById(id);
      if (!imgPathOld) {
        return res
          .status(404)
          .json({ success: false, mess: 'don/"/t find img_path ' });
      }
      if (imgPathOld.img_path) {
        const oldPath = path.join(
          myPath.root,
          "src",
          "public",
          imgPathOld.img_path,
        );
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
          //   console.log("da xoa file cu");
        }
      }
      //update db
      const update = await CertificatePositionEntity.updateOne(
        { _id: id },
        { img_path: imgPath },
      );
      res.json({ success: true, file: imgPath });
    } catch (error) {
      console.log(CNAME + error);
      res.status(500).json({ success: false, mess: "Lỗi server" });
    }
  }
  async AddContest(req, res) {
    try {
      const { name, desc } = req.body;
      const cp = new CertificatePositionEntity({
        title: name,
        desc: desc,
      });
      await cp.save();
      res.json({ success: true, mess: "tao contest thanh cong" });
    } catch (error) {
      console.log(CNAME + error);
      res.status(500).json({ success: false, mess: error.message });
    }
  }
  async DeleteContest(req, res) {
    try {
      const id = req.params.id;
      const result = await CertificatePositionEntity.deleteOne({ _id: id });
      if (result.deletedCount === 1) {
        res.json({ success: true, mess: "delete success" });
      }
    } catch (error) {
      console.log(CNAME, error);
      res.status(500).json({ success: false, mess: error.message });
    }
  }
  async SavePosition(req, res) {
    try {
      const data = req.body;
      // console.log("data", data);
      const id = req.params.id;
      // console.log("id: ", id);
      if (!id) {
        return res.status(400).json({ success: false, mess: "Thiếu id" });
      }
      const cf = await CertificatePositionEntity.findOneAndUpdate(
        { _id: id },
        { config: data },
        { new: true },
      );
      // console.log(cf);

      // 🔹 Nếu có slug thì update, nếu chưa có thì insert mới
      // await CerttificatePositionEntity.updateOne(
      //   { slug: slug }, // tìm theo slug
      //   { $set: cp }, // cập nhật nội dung
      //   { upsert: true }, // nếu chưa có thì tạo mới
      // );
      res.json({ success: true, message: "Lưu hoặc cập nhật thành công" });
    } catch (error) {
      console.error(error);
      res.json({ success: false, mess: error.message });
    }
  }
  //ajax
  async UploadExcel(req, res) {
    try {
      const contest_id = req.params.id;
      const file = req.file;
      if (!file) {
        return res.json
          .status(400)
          .json({ success: false, mess: "No file uploaded" });
      }
      //read file
      const workbook = xlsx.read(file.buffer, { type: "buffer" });
      //lay sheet theo ten: ecert-data
      const _sheetName = "ecert-data";
      if (!workbook.SheetNames.includes(_sheetName)) {
        return res
          .status(400)
          .json({ success: false, mess: `sheet ${_sheetName} not found` });
      }
      const worksheet = workbook.Sheets[_sheetName];
      //convert sheet sang JSON
      const jsonData = xlsx.utils.sheet_to_json(worksheet, {
        header: 1, //lay raw dang manh, ko dua theo header
        defval: "", //giu cacs gia tri trong
      });
      if (jsonData.length <= 1) {
        return res
          .status(400)
          .json({ sucess: false, mess: "File excel ko co data" });
      }
      //
      const ecertDatas = [];
      jsonData.slice(1).forEach((row, i) => {
        let rowNumber = i;
        ecertDatas.push(mapRowByIndex(row, contest_id, rowNumber));
      });
      //bulkOps //nen ket hop them mot field de tranh trung key khi import
      const bulkOps = ecertDatas.map((data) => {
        const { _id, ...rest } = data;
        return {
          updateOne: {
            filter: {
              contest_ref: new mongoose.Types.ObjectId(data.contestId),
              name: data.name,
            },
            update: { $set: rest },
            upsert: true,
          },
        };
      });
      const result = await CertificateDataEntity.bulkWrite(bulkOps, {
        ordered: false,
      });
      // console.log(jsonData);
      res.json({ success: true, mess: "import data success" });
    } catch (error) {
      console.log(CNAME, error);
      res.status(500).json({ success: false, mess: error.message });
    }
  }
  //svg-to-text
  async RenderCertificate(req, res) {
    //Initial
    const idUser = req.query.uid;
    const idContest =req.query.cid;
    console.log(idUser, idContest);
    const certConfig = await CertificatePositionEntity.findOne({_id: idContest}).lean();
    // console.log(certConfig)
    const bgUrlImage = "src/public"+certConfig.img_path;
    const certUser = await CertificateDataEntity.findOne({_id: idUser}).lean();
    // console.log(bgUrlImage, certUser)

    // 🔹 Load background
    const bgPath = path.join(
      myPath.root, bgUrlImage, 
    );

    // 🔹 Load font
    const fontPath = path.join(
      myPath.root,
      "src/public/font/AlexBrush-Regular.ttf",
    );
    if (!fs.existsSync(fontPath)) {
      throw new Error("Font file not found: " + fontPath);
    }
    //
    try {
      // 🔹 Fake data
      // const fakeData = {
      //   name: "Vũ Văn Kiên",
      //   field_1: "Staff",
      //   dob: "20/11/2002",
      //   address: "Ha Noi",
      //   email: "test@gmail.com",
      //   role: "Staff",
      // };
      
      const fakeData=certUser;
      const fakePosition = certConfig.config;
      // const fakePosition = [
      //   {
      //     field: "name",
      //     fill: "green",
      //     fontSize: 102,
      //     h: 102,
      //     text: "Tên",
      //     w: 781.4277343750019,
      //     x: 611.9999999999981,
      //     y: 534.999999999998,
      //     align: "center", // 👈 có thể là "left", "center", hoặc "right"
      //   },
      //   {
      //     field: "field_1",
      //     fill: "green",
      //     fontSize: 50,
      //     h: 50,
      //     text: "Text 01",
      //     w: 187.8320312500019,
      //     x: 1450.9999999999982,
      //     y: 745.0072600696172,
      //     align: "left", // 👈 có thể là "left", "center", hoặc "right"
      //   },
      // ];


      const bgImage = sharp(bgPath);
      const metadata = await bgImage.metadata();

      const textToSVG = TextToSVG.loadSync(fontPath);

      // 🔹 Dùng Sharp để composite SVG text lên background
      //===============NEW C2\
      const svgLayers = fakePosition.map((p) => {
        const val = fakeData[p.field] || "";

        // ✅ Lấy thông tin kích thước thật của text
        const metrics = textToSVG.getMetrics(val, {
          fontSize: p.fontSize,
          anchor: "top",
        });

        // ✅ Tính lại toạ độ căn giữa chính xác
        const textWidth = metrics.width;
        const textHeight = metrics.height;

        const top = p.y + (p.h - textHeight) / 2;
        // const left = p.x + (p.w - textWidth) / 2;
        // ✅ Căn ngang theo p.align
        let left;
        switch (p.align) {
          case "left":
            left = p.x; // bám sát lề trái
            break;
          case "right":
            left = p.x + p.w - textWidth; // bám sát lề phải
            break;
          default:
            // center (hoặc nếu không có align thì mặc định center)
            left = p.x + (p.w - textWidth) / 2;
            break;
        }

        const svg = textToSVG.getSVG(val, {
          x: 0,
          y: 0,
          fontSize: p.fontSize,
          anchor: "top",
          attributes: { fill: p.fill || "black" },
        });

        return {
          input: Buffer.from(svg),
          top: Math.round(top),
          left: Math.round(left),
        };
      });
      const finalImage = await bgImage.composite(svgLayers).png().toBuffer();

      // 🔹 Gửi ảnh về client
      res.setHeader("Content-Type", "image/png");
      res.send(finalImage);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error rendering font", error: err.message });
    }
  }
  async DataTable(req, res) {
    try {
      const dc = req.body;
      const cID = req.params.cid;
      //
      const draw = dc.draw;
      const start = parseInt(dc.start) || 0;
      const length = parseInt(dc.length) || 10;
      const searchValue = dc?.value || "";
      const orderCol = dc.order?.[0]?.column || 0;
      const orderDir = dc.order?.[0]?.dir || "asc";
      // const orderField = dc.columns?.[orderCol]?.dc || "name";
      const orderField = "name";

      console.log(dc, cID);
      //tao query truy vam
      let query = {};
      if(cID){
        query.contest_ref =cID;
      }
      if (searchValue) {
        query = {
          $or: [
            { name: { $regex: searchValue, $options: "i" } },
            { field_1: { $regex: searchValue, $options: "i" } },
          ],
        };
      }

      const totalRecords = await CertificateDataEntity.countDocuments();
      const filteredRecords = await CertificateDataEntity.countDocuments(query);

      const dataRaw = await CertificateDataEntity.find(query)
      .sort({[orderField]: orderDir ==='asc'?1:-1})
      .skip(start)
      .limit(length);
      const data = dataRaw.map(item => ({
      ...item.toObject(),
      // _id: item._id.toString(),
      contest_ref: item.contest_ref.toString() // hoặc populate name nếu muốn
    }));
      // console.log('data server tra ve ',data)
      res.json({
        draw,
        recordsTotal: totalRecords,
        recordsFiltered: filteredRecords,
        data,

      })
      // end
    } catch (error) {
      console.log(error);
      res.status(500).json({err: error.message})
    }
  }
}

module.exports = new ECertController();
