const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");

const pageConfig = require("../utils/aboutConfig.json");
const PageSettingEntity = require("../model/PageSetting");
const EventEntity = require("../model/Event");
const VolunteerEntity = require("../model/Volunteer");
const CertificateConfigEntity = require("../model/CertificateConfig");
const pathConfig = require("../config/path.config");

module.exports = () => {
  async function HomePageHelper() {
    return await PageSettingEntity.findOne({ type: "home_page" });
  }
  return {
    Index: async (req, res) => {
      //   var hp = await PageSettingEntity.findOne({ type: "home_page" });
      var hp = await HomePageHelper();
      res.render("pages/home", {
        title: "Trang chu",
        hp: hp,
        f_data: hp?.f_desc || "",
      });
    },
    About: (req, res) => {
      res.render("pages/about", {
        layout: false,
        title: "About",
        data: pageConfig,
      });
    },
    Event: async (req, res) => {
      var hp_config = await HomePageHelper();
      var events = await EventEntity.find({}).lean();
      //   console.log(events)
      res.render("pages/event", {
        layout: "layout/main",
        title: "Event",
        f_data: hp_config?.f_desc || "",
        events: events,
      });
    },
    Volunteer: async (req, res) => {
      var hp_config = await HomePageHelper();
      var events = await EventEntity.find({}).lean();
      res.render("pages/v_eventlist", {
        layout: "layout/main",
        title: "Event",
        f_data: hp_config?.f_desc || "",
        events: events,
      });
    },
    VolunteerInvolved: async (req, res) => {
      const eventId = req.params.id;
      console.log(eventId);
      const volunteers = await VolunteerEntity.find({
        event_id: eventId,
      }).lean();
      const event = await EventEntity.findOne({ _id: eventId }).lean();
      try {
        res.render("pages/v_volunteerlist", {
          layout: "layout/main",
          volunteers: volunteers,
          title: "Event",
          event_id: eventId,
          event,
        });
      } catch (error) {
        res.status(500).json({ success: false, mess: "failed" });
      }
    },
    VolunteerCertificate: async (req, res) => {
      try {
        const volunteer_id = req.body.volunteer_id;
        const event_id = req.body.event_id;
        // console.log("OA" + pathConfig.root);
        // console.log(pathConfig.root2);
        // const cc = await CertificateConfigEntity.find({event_id: event_id}).lean();
        // ------------

        // --- Đăng ký font ---
        const fontPath = path.join(pathConfig.root, "src", "public", "font", "AlexBrush-Regular.ttf");
        registerFont(fontPath, { family: "MyCustomAlexBrush" });
        // --------------------

        const volunteer = await VolunteerEntity.findOne({
          _id: volunteer_id,
        }).lean();
        // console.log(volunteer);
        // === Data từ DB (đồng bộ key với positions) ===
        const data = {
          name: volunteer.fullname,
          role: volunteer.role,
        };
        // console.log("event_id " + event_id);
        // === Config vị trí (export từ Fabric) ===
        const certconfig = await CertificateConfigEntity.findOne({
          event_id: event_id,
        });
        console.log(certconfig);
        const positions = await certconfig.fields;

        const imgPath = path.join(pathConfig.root, "src", certconfig.img_path); //src/uploads/certificate/cer1.jpg
        console.log("Test path: " + imgPath);
        console.log(imgPath);
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
            fontWeight = "normal", // Đổi từ "bold" sang "normal"
            maxFontSize = 80,
            minFontSize = 20,
          } = options;

          ctx.fillStyle = color || "black";
          ctx.textAlign = align || "left";

          let finalFontFamily = fontFamily || "Arial";

          let finalFontSize = fontSize || maxFontSize;

          // Nếu không có fontSize → tìm font vừa box
          if (!fontSize) {
            while (finalFontSize >= minFontSize) {
              ctx.font = `${fontWeight} ${finalFontSize}px "${finalFontFamily}"`;
              const textWidth = ctx.measureText(text).width;
              if (textWidth <= w) break;
              finalFontSize -= 2;
            }
          } else {
            ctx.font = `${fontWeight} ${finalFontSize}px "${finalFontFamily}"`;
            const textWidth = ctx.measureText(text).width;
            if (textWidth > w) {
              // Nếu text dài quá thì auto scale nhỏ lại
              finalFontSize = (finalFontSize * w) / textWidth;
              ctx.font = `${fontWeight} ${finalFontSize}px "${finalFontFamily}"`;
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
        const imageBase64 = canvas.toDataURL("image/png"); // hoặc 'image/jpeg'
        res.json({ success: true, mess: "ok", image: imageBase64 });
      } catch (error) {
        console.log("C_Home-V_Cert", error);
        res.json({ success: false, mess: "failed" });
      }
    },
  };
};
