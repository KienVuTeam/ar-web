const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");

const pageConfig = require("../utils/aboutConfig.json");
const PageSettingEntity = require("../model/PageSetting");
const EventEntity = require("../model/Event");
const VolunteerEntity = require("../model/Volunteer");
const CertificateConfigEntity = require("../model/CertificateConfig");
const pathConfig = require("../config/path.config");
const fontConfig = require("../config/fontConfig");
const CertificatePositionEntity = require('../model/CertificatePosition');
const CertificateDataEntity = require('../model/CertificateData');

// Image cache to avoid reloading images from filesystem
const imageCache = new Map();

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
        layout: 'layout/main',
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

        // Font is now registered at startup, no need to register here

        // Run database queries in parallel for better performance
        const [volunteer, certconfig] = await Promise.all([
          VolunteerEntity.findOne({ _id: volunteer_id }).lean(),
          CertificateConfigEntity.findOne({ event_id: event_id }),
        ]);
        console.log(certconfig);
        const positions = await certconfig.fields;

        const imgPath = path.join(pathConfig.root, "src", certconfig.img_path); //src/uploads/certificate/cer1.jpg
        console.log("Test path: " + imgPath);
        console.log(imgPath);

        // Use cached image if available, otherwise load and cache it
        let bg;
        if (imageCache.has(imgPath)) {
          bg = imageCache.get(imgPath);
          console.log("Using cached image");
        } else {
          bg = await loadImage(imgPath);
          imageCache.set(imgPath, bg);
          console.log("Loaded and cached image");
        }

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

          // Handle custom fonts using font config
          const fontInfo = fontConfig.fonts[finalFontFamily];
          if (fontInfo && fontInfo.isCustom) {
            finalFontFamily = fontInfo.family;
          }

          // Optimized font size calculation using binary search
          if (!fontSize) {
            let low = minFontSize;
            let high = maxFontSize;
            let bestSize = minFontSize;

            while (low <= high) {
              const mid = Math.floor((low + high) / 2);
              ctx.font = `${fontWeight} ${mid}px "${finalFontFamily}"`;
              const textWidth = ctx.measureText(text).width;

              if (textWidth <= w) {
                bestSize = mid;
                low = mid + 1;
              } else {
                high = mid - 1;
              }
            }
            finalFontSize = bestSize;
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

          // Xác định vị trí X với căn chỉnh ngang chính xác
          let posX = x;
          if (align === "center") {
            posX = x + w / 2;
          } else if (align === "right") {
            posX = x + w;
          } else {
            // left alignment
            posX = x;
          }

          // Xác định vị trí Y với căn chỉnh dọc chính xác
          let posY = y;
          if (valign === "middle") {
            posY = y + h / 2 + textHeight / 4; // căn giữa theo metrics
          } else if (valign === "bottom") {
            posY = y + h - textHeight / 4; // căn dưới
          } else {
            posY = y + textHeight; // top
          }

          // Draw text with proper alignment
          ctx.fillText(text, posX, posY);
        };

        // === Vẽ tất cả field ===
        // ✅ Volunteer data (convert hết key sang lowercase để đồng bộ)
        const data = {};
        for (const [key, value] of Object.entries(volunteer)) {
          data[key.toLowerCase()] = value;
        }

        // ✅ Map field trong DB sang field trong volunteer
        const fieldMapping = {
          name: "fullname", // DB "Name" -> volunteer.fullname
          bib: "bib", // nếu volunteer có bib
          finishtime: "finishtime",
          overallrank: "overallrank",
          clubname: "clubname",
          role: "role",
        };

        // ✅ Vẽ tất cả field - batch font operations for better performance
        const fontOperations = [];
        for (const key in positions) {
          const lowerKey = key.toLowerCase();
          const volunteerField = fieldMapping[lowerKey]; // ánh xạ
          const text = volunteerField ? data[volunteerField] : "";
          if (text) {
            fontOperations.push({ text, position: positions[key] });
          }
        }

        // Execute all font operations
        fontOperations.forEach(({ text, position }) => {
          drawTextInBox(text, position);
        });
        const imageBase64 = canvas.toDataURL("image/png"); // hoặc 'image/jpeg'
        res.json({ success: true, mess: "ok", image: imageBase64 });
      } catch (error) {
        console.log("C_Home-V_Cert", error);
        res.json({ success: false, mess: "failed" });
      }
    },
    // new
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
          pathConfig.root, bgUrlImage, 
        );
        // 🔹 Load font
        const fontPath = path.join(
          pathConfig.root,
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
  };
};
