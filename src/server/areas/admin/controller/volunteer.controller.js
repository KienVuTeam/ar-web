const XLSX = require("xlsx");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const { UploadExcel } = require("./AthleteController");
const VolunteerEntity = require("../../../model/Volunteer");
const CertificateConfigEntity = require("../../../model/CertificateConfig");
const EventEntity = require("../../../model/Event");
const myPath = require("../../../config/path.config")

module.exports = () => {
  return {
    Index: async (req, res) => {
      res.render("admin/volunteer/index", { layout: "layout/layoutAdmin" });
    },
    EventList: async (req, res) => {
      try {
        const events = await EventEntity.find({}).lean();
        res.render("admin/volunteer/e_eventlist", {
          layout: "layout/layoutAdmin",
          el: events,
        });
      } catch (error) {
        console.log("C_Volunteer " + error);
        res.render("admin/volunteer/e_eventlist", {
          layout: "layout/layoutAdmin",
          el: [],
        });
      }
    },
    VolunteerList: async (req, res) => {
      try {
        const event_id = req.params.event_id;
        console.log("event_id " + event_id);
        var result = await VolunteerEntity.find({ event_id: event_id });
        var event = await EventEntity.findOne({ _id: event_id });
        console.log("Event neeeeeeee");
        console.log(event);
        var certConfig = await CertificateConfigEntity.findOne({
          event_id: event_id,
        }).lean();
        res.render("admin/volunteer/volunteerlist", {
          layout: "layout/layoutAdmin",
          data: result,
          ei: event_id,
          cc: certConfig,
          event: event,
        });
      } catch (error) {
        console.log("C_Volunteer " + error);
        res.render("admin/volunteer/volunteerlist", {
          layout: "layout/layoutAdmin",
          data: {},
        });
      }
    },
    UploadImage: async (req, res) => {
      try {
        if (!req.file) {
          return res
            .status(400)
            .json({ success: false, mess: "Ko co file dc gui len!" });
        }
        const event_id = req.body.ei;
        // build path
        const relativePath =
          "uploads/volunteer_certificate/" + req.file.filename;
        //tim anh cu
        const oldCert = await CertificateConfigEntity.findOne({event_id: event_id});
        if(oldCert && oldCert.img_path){
          const oldFilePath = path.join(myPath.root, "src" ,oldCert.img_path)
          if(fs.existsSync(oldFilePath)){
            fs.unlinkSync(oldFilePath);
            console.log("da xoa file: "+ oldFilePath);
          }
        }

        var cert = new CertificateConfigEntity({
          event_id: event_id,
          img_path: relativePath,
        });
        const plainData = cert.toObject();
        delete plainData._id;
        //
        const result = await CertificateConfigEntity.findOneAndUpdate(
          { event_id: event_id },
          { $set: plainData },
          {
            new: true,
            upsert: true, ///neu chua co thi tao moi
            setDefaultsOnInsert: true, //ap default neu tao moi
          },
        );
        res.json({ success: true, mess: "success", path: req.file.path });
      } catch (error) {
        console.log("C_Volunteer " + error);
        res.status(500).json({ success: false, mess: error });
      }
    },
    UploadExcel: async (req, res) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        if (!req.file) {
          return res
            .status(400)
            .json({ success: false, message: "Không có file được gửi lên." });
        }

        const event_id = req.body.ei;
        if (!event_id) {
          return res
            .status(400)
            .json({ success: false, message: "Event ID không hợp lệ." });
        }

        // ✅ Kiểm tra event có tồn tại không
        const event = await EventEntity.findById(event_id);
        if (!event) {
          return res
            .status(404)
            .json({ success: false, message: "Event không tồn tại." });
        }

        // ✅ Parse Excel file
        const buffer = req.file.buffer;
        const workbook = XLSX.read(buffer, { type: "buffer" });

        // ✅ Kiểm tra sheet "volunteer" có tồn tại không
        if (!workbook.Sheets["volunteer"]) {
          return res.status(400).json({
            success: false,
            message: "File Excel phải có sheet tên 'volunteer'.",
          });
        }

        const sheet = workbook.Sheets["volunteer"];
        let rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // ✅ Kiểm tra có dữ liệu không
        if (rows.length <= 1) {
          return res
            .status(400)
            .json({ success: false, message: "File Excel không có dữ liệu." });
        }

        // ✅ Mapping và validate dữ liệu
        const mappedData = [];
        const errors = [];

        rows.slice(1).forEach((r, index) => {
          const rowNumber = index + 2; // +2 vì bắt đầu từ dòng 2 (sau header)

          // ✅ Validate required fields
          if (!r[0] || !r[1]) {
            errors.push(`Dòng ${rowNumber}: Thiếu tên hoặc CCCD`);
            return;
          }

          // ✅ Parse gender
          let genderValue = null;
          if (r[2]) {
            const g = String(r[2]).trim().toLowerCase();
            if (["nam", "male", "m"].includes(g)) genderValue = 1;
            else if (["nữ", "nu", "female", "f"].includes(g)) genderValue = 0;
            else {
              errors.push(
                `Dòng ${rowNumber}: Giới tính không hợp lệ (${r[2]})`,
              );
            }
          }

          // ✅ Parse DOB
          let dobValue = null;
          if (r[3]) {
            if (typeof r[3] === "number") {
              dobValue = XLSX.SSF.format("yyyy-mm-dd", r[3]);
            } else {
              dobValue = new Date(r[3]);
              if (isNaN(dobValue)) {
                errors.push(
                  `Dòng ${rowNumber}: Ngày sinh không hợp lệ (${r[3]})`,
                );
                dobValue = null;
              }
            }
          }

          // ✅ Validate email format
          if (r[4] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r[4])) {
            errors.push(`Dòng ${rowNumber}: Email không hợp lệ (${r[4]})`);
          }

          // ✅ Validate phone number
          if (r[5] && !/^[0-9+\-\s()]+$/.test(r[5])) {
            errors.push(
              `Dòng ${rowNumber}: Số điện thoại không hợp lệ (${r[5]})`,
            );
          }

          mappedData.push({
            fullname: r[0].toString().trim(),
            cccd: r[1].toString().trim(),
            gender: genderValue,
            DOB: dobValue,
            email: r[4] ? r[4].toString().trim() : null,
            phone_number: r[5] ? r[5].toString().trim() : null,
            role: r[6] ? r[6].toString().trim() : null,
            event_id: event_id,
            created_at: new Date(),
            updated_at: new Date(),
          });
        });

        // ✅ Nếu có lỗi validation, trả về lỗi
        if (errors.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Dữ liệu không hợp lệ:",
            errors: errors,
          });
        }

        // ✅ RESET: Xóa tất cả volunteer cũ của event này
        console.log(`🗑️ Deleting old volunteers for event: ${event_id}`);
        const deleteResult = await VolunteerEntity.deleteMany(
          { event_id: event_id },
          { session },
        );
        console.log(`✅ Deleted ${deleteResult.deletedCount} old volunteers`);

        // ✅ INSERT: Thêm dữ liệu mới
        console.log(`📥 Inserting ${mappedData.length} new volunteers`);
        const result = await VolunteerEntity.insertMany(mappedData, {
          session,
        });

        // ✅ Commit transaction
        await session.commitTransaction();

        res.json({
          success: true,
          message: "Import dữ liệu thành công!",
          data: {
            deleted: deleteResult.deletedCount,
            inserted: result.length,
            total: mappedData.length,
          },
        });
      } catch (error) {
        // ✅ Rollback transaction nếu có lỗi
        await session.abortTransaction();
        console.error("❌ Import error:", error);
        res.status(500).json({
          success: false,
          message: "Lỗi khi import dữ liệu",
          error: error.message,
        });
      } finally {
        session.endSession();
      }
    },
    GetVolunteer: async (req, res) => {
      try {
        var result = await VolunteerEntity.find({});
        res.render("admin/volunteer/control", {
          layout: "layout/layoutAdmin",
          data: result,
        });
      } catch (error) {}
    },

    CertificateConfig: async (req, res) => {
      try {
        const data = req.body;
        // console.log("AAA");
        console.log(data);
        const event_id = req.body.ei;
        const type = "volunteer";
        var cert = new CertificateConfigEntity({
          event_id: event_id,
          type: type,
          fields: req.body.config,
        });
        var plainData = cert.toObject();
        delete plainData.__v;
        delete plainData._id;
        const result = await CertificateConfigEntity.updateOne(
          { event_id: event_id },
          { $set: plainData },
          { upsert: true },
        );
        res.json({ success: true, mess: "config success" });
      } catch (error) {
        console.log("C_Volun" + error);
        res.status(500).json({ success: false, mess: "failed" });
      }
    },
    // Xem cert trong admin
    CreateCertificate: async (req, res) => {
      try {
        const volunteer_id = req.params.id;
        const event_id = req.body.ei;
        console.log(volunteer_id);
        //data volunteer
        const volunteer = await VolunteerEntity.findOne({
          _id: volunteer_id,
        }).lean();
        console.log(volunteer);
        // === Data từ DB (đồng bộ key với positions) ===
        const data = {
          name: volunteer.fullname,
          role: volunteer.role,
        };
        // === Config vị trí (export từ Fabric) ===
        const certconfig = await CertificateConfigEntity.findOne({
          event_id: event_id,
        });
        console.log(certconfig);
        const positions = await certconfig.fields;
        // add
        // === Load background ===
        const imgPath = path.join(
          __dirname,
          "../../../../uploads/certificate",
          "cer1.jpg",
        );
        const bg = await loadImage(imgPath);

        const canvas = createCanvas(bg.width, bg.height);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(bg, 0, 0, bg.width, bg.height);

        // === Hàm vẽ text trong box ===
        const drawTextInBox = (
          text,
          { x, y, w, h, fontSize, fontFamily, color, align, valign },
          options = {},
        ) => {
          const {
            fontWeight = "bold",
            maxFontSize = 80,
            minFontSize = 20,
          } = options;

          ctx.fillStyle = color || "black";
          ctx.textAlign = align || "left";

          let finalFontSize = fontSize || maxFontSize;

          // Nếu không có fontSize → tìm font vừa box
          if (!fontSize) {
            while (finalFontSize >= minFontSize) {
              ctx.font = `${fontWeight} ${finalFontSize}px ${fontFamily || "Arial"}`;
              const textWidth = ctx.measureText(text).width;
              if (textWidth <= w) break;
              finalFontSize -= 2;
            }
          } else {
            ctx.font = `${fontWeight} ${finalFontSize}px ${fontFamily || "Arial"}`;
            const textWidth = ctx.measureText(text).width;
            if (textWidth > w) {
              // Nếu text dài quá thì auto scale nhỏ lại
              finalFontSize = (finalFontSize * w) / textWidth;
              ctx.font = `${fontWeight} ${finalFontSize}px ${fontFamily || "Arial"}`;
            }
          }

          // === Lấy metrics để căn dọc chính xác ===
          const metrics = ctx.measureText(text);
          const textHeight =
            metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

          // Xác định vị trí X
          let posX = x;
          if (align === "center") posX = x + w / 2;
          else if (align === "right") posX = x + w;

          // Xác định vị trí Y
          let posY = y;
          if (valign === "middle") {
            posY = y + h / 2 + textHeight / 4; // căn giữa theo metrics
          } else if (valign === "bottom") {
            posY = y + h;
          } else {
            posY = y + textHeight; // top
          }

          ctx.fillText(text, posX, posY);
        };

        // === Vẽ tất cả field ===
        for (const key in positions) {
          const lowerKey = key.toLowerCase(); // chuyển key thành chữ thường
          drawTextInBox(data[lowerKey] || "", positions[key]);
        }

        // === Xuất ảnh ===
        // res.setHeader("Content-Type", "image/png");
        // res.send(canvas.toBuffer("image/png"));
        const imageBase64 = canvas.toDataURL("image/png"); // hoặc 'image/jpeg'
        res.json({ success: true, mess: "ok", image: imageBase64 });
      } catch (err) {
        console.error(err);
        res.status(500).send("Error generating certificate");
      }
    },

    RenderCert: async (req, res) => {
      try {
        // === Data từ DB (đồng bộ key với positions) ===
        const data = {
          Name: "NGUYỄN VĂN A",
          Bib: "10001",
          FinishTime: "1h30:15",
          OverallRank: "10th",
          ClubName: "FPT Runner",
        };

        // === Config vị trí (export từ Fabric) ===
        const positions = {
          Name: {
            x: 481,
            y: 519,
            w: 1043,
            h: 57,
            fontSize: 50,
            fontFamily: "Arial",
            color: "black",
            align: "center",
            valign: "middle",
          },
          Bib: {
            x: 1438,
            y: 731,
            w: 200,
            h: 32,
            fontSize: 28,
            fontFamily: "Arial",
            color: "black",
            align: "left",
            valign: "middle",
          },
          FinishTime: {
            x: 83,
            y: 316,
            w: 333,
            h: 53,
            fontSize: 47,
            fontFamily: "Arial",
            color: "black",
            align: "center",
            valign: "middle",
          },
          OverallRank: {
            x: 83,
            y: 433,
            w: 333,
            h: 53,
            fontSize: 47,
            fontFamily: "Arial",
            color: "green",
            align: "center",
            valign: "middle",
          },
          ClubName: {
            x: 83,
            y: 549,
            w: 333,
            h: 53,
            fontSize: 47,
            fontFamily: "Arial",
            color: "purple",
            align: "center",
            valign: "middle",
          },
        };

        // === Load background ===
        const imgPath = path.join(
          __dirname,
          "../../../../uploads/certificate",
          "cer1.jpg",
        );
        const bg = await loadImage(imgPath);

        const canvas = createCanvas(bg.width, bg.height);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(bg, 0, 0, bg.width, bg.height);

        // === Hàm vẽ text trong box ===
        const drawTextInBox = (
          text,
          { x, y, w, h, fontSize, fontFamily, color, align, valign },
          options = {},
        ) => {
          const {
            fontWeight = "bold",
            maxFontSize = 80,
            minFontSize = 20,
          } = options;

          ctx.fillStyle = color || "black";
          ctx.textAlign = align || "left";

          let finalFontSize = fontSize || maxFontSize;

          // Nếu không có fontSize → tìm font vừa box
          if (!fontSize) {
            while (finalFontSize >= minFontSize) {
              ctx.font = `${fontWeight} ${finalFontSize}px ${fontFamily || "Arial"}`;
              const textWidth = ctx.measureText(text).width;
              if (textWidth <= w) break;
              finalFontSize -= 2;
            }
          } else {
            ctx.font = `${fontWeight} ${finalFontSize}px ${fontFamily || "Arial"}`;
            const textWidth = ctx.measureText(text).width;
            if (textWidth > w) {
              // Nếu text dài quá thì auto scale nhỏ lại
              finalFontSize = (finalFontSize * w) / textWidth;
              ctx.font = `${fontWeight} ${finalFontSize}px ${fontFamily || "Arial"}`;
            }
          }

          // === Lấy metrics để căn dọc chính xác ===
          const metrics = ctx.measureText(text);
          const textHeight =
            metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

          // Xác định vị trí X
          let posX = x;
          if (align === "center") posX = x + w / 2;
          else if (align === "right") posX = x + w;

          // Xác định vị trí Y
          let posY = y;
          if (valign === "middle") {
            posY = y + h / 2 + textHeight / 4; // căn giữa theo metrics
          } else if (valign === "bottom") {
            posY = y + h;
          } else {
            posY = y + textHeight; // top
          }

          ctx.fillText(text, posX, posY);
        };

        // === Vẽ tất cả field ===
        for (const key in positions) {
          drawTextInBox(data[key] || "", positions[key]);
        }

        // === Xuất ảnh ===
        res.setHeader("Content-Type", "image/png");
        res.send(canvas.toBuffer("image/png"));
      } catch (err) {
        console.error(err);
        res.status(500).send("Error generating certificate");
      }
    },
  };
};

// req.file = {
//   fieldname: 'cert_img',
//   originalname: 'myphoto.png',
//   encoding: '7bit',
//   mimetype: 'image/png',
//   destination: 'C:\\Workspaces\\Nodejs\\access-race\\src\\uploads\\volunteer_certificate',
//   filename: '1695145678901.png',
//   path: 'C:\\Workspaces\\Nodejs\\access-race\\src\\uploads\\volunteer_certificate\\1695145678901.png',
//   size: 123456
// }
