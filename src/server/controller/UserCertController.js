const VNAME = "user/";
const CNAME = "UserCertController.js ";
const path = require("path");
// const { createCanvas, loadImage } = require("canvas");
const myPath = require("../config/path.config");
const StringValue = require("../config/stringValue");
const CerttificatePositionEntity = require("../model/CertificatePosition");
const sharp = require("sharp");
const fs = require("fs");
const { createCanvas, registerFont } = require("canvas");
const TextToSVG = require("text-to-svg");

class UserCertController {
  Index(req, res) {
    // console.log(StringValue.viewName);
    // res.json({mess: StringValue.viewName});
    res.render(VNAME + "index", { layout: false });
  }
  async SavePosition(req, res) {
    try {
      var data = req.body;
      console.log("data co gi o day:");
      console.log(data);
      const cp = new CerttificatePositionEntity({
        title: "Giai chay bo 2025",
        desc: "mota",
        config: data,
      });
      console.log(cp);
      await CerttificatePositionEntity.insertMany(cp);
      res.json({ success: true });
    } catch (error) {
      console.log(CNAME);
      console.log(error);
      res.json({ success: false, mess: error });
    }
  }
  //root
  async RenderCertificate0(req, res) {
    //fake data
    const fakeData = {
      name: "Nguyen Van A",
      field_1: "Volunteer",
      dob: "20/11/2002",
      address: "Ha Noi",
      email: "test@gmail.com",
      role: "Staff",
    };
    const fakePosition = [
      {
        field: "name",
        fill: "green",
        fontSize: 100,
        h: 100,
        text: "Tên",
        w: 877.462890625,
        x: 562.0000000000001,
        y: 541.0056467208134,
      },
      {
        field: "field_1",
        fill: "green",
        fontSize: 44,
        h: 44,
        text: "Text 01",
        w: 225.72363281249935,
        x: 1452.000032775882,
        y: 743.0068475786649,
      },
    ];
    //
    try {
      const bgPath = path.join(
        myPath.root,
        "/src/uploads/volunteer_certificate/1758525477986.jpg",
      );
      const image = await loadImage(bgPath);

      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext("2d");
      ctx.textAlign = "center"; // căn giữa theo chiều ngang
      ctx.textBaseline = "middle"; // căn giữa theo chiều dọc
      var centerX = 0;
      var centerY = 0;
      //ve anh
      ctx.drawImage(image, 0, 0, image.width, image.height);
      //ve tung text-box
      fakePosition.forEach((p) => {
        ctx.font = `${p.fontSize}px Arial`;
        ctx.fillStyle = p.fill || "black";
        //tinh toan can theo tam box
        centerX = p.x + p.w / 2;
        centerY = p.y + p.h / 2;
        ctx.fillText(fakeData[p.field] || "", centerX, centerY);
      });
      //xuat anh
      res.setHeader("Content-Type", "image/png");
      canvas.createPNGStream().pipe(res);
      //tra ve base:64
      // const base64 = canvas.toDataURL("image/png");
      // res.json({ image: base64 });
    } catch (error) {
      console.log(CNAME);
      console.log(error);
      res.status(500).send("err");
    }
  }
  // sgv
  async RenderCertificatevdsg(req, res) {
    //nap font
    const fontPath = path.join(
      myPath.root,
      "src",
      "public",
      "font",
      "AlexBrush-Regular.ttf",
    );
    const fontBase64 = fs.readFileSync(fontPath).toString("base64");
    const fakeData = {
      name: "Nguyen Van A",
      field_1: "Volunteer",
    };

    const fakePosition = [
      {
        field: "name",
        fill: "green",
        fontSize: 100,
        h: 100,
        w: 877,
        x: 562,
        y: 541,
      },
      {
        field: "field_1",
        fill: "green",
        fontSize: 44,
        h: 44,
        w: 225,
        x: 1452,
        y: 743,
      },
    ];

    try {
      const bgPath = path.join(
        myPath.root,
        "/src/uploads/volunteer_certificate/1758525477986.jpg",
      );

      // Lấy thông tin ảnh (để tạo SVG đúng size)
      const bgImage = sharp(bgPath);
      const metadata = await bgImage.metadata();
      const { width, height } = metadata;

      // Tạo SVG text layer
      const textLayer = fakePosition
        .map((p) => {
          const val = fakeData[p.field] || "";
          const x = p.x + p.w / 2;
          const y = p.y + p.h / 2;
          return `<text x="${x}" y="${y}" font-size="${p.fontSize}" fill="${p.fill}" text-anchor="middle" dominant-baseline="middle" >${val}</text>`;
        })
        .join("");

      const svg = Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <style>
        @font-face {
          font-family: 'AlexBrush';
          src: url('file://${fontPath}') format('truetype');
        }
        text {
          font-family: 'AlexBrush';
        }
      </style>
    </defs>
    ${textLayer}
  </svg>`,
      );

      // Dùng sharp chồng SVG lên ảnh
      const finalBuffer = await bgImage
        .composite([{ input: svg, top: 0, left: 0 }])
        .png()
        .toBuffer();

      res.setHeader("Content-Type", "image/png");
      res.send(finalBuffer);
    } catch (err) {
      console.error("RenderCertificateFast error:", err);
      res.status(500).send("Error rendering fast certificate");
    }
  }
  //svg-to-text
  async RenderCertificate(req, res) {
    //Initial
    // 🔹 Load background
    const bgPath = path.join(
      myPath.root,
      "src/public/e-cert/adsys/cer1-1759895785680.jpg",
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
      const fakeData = {
        name: "Vũ Văn Kiên",
        field_1: "Staff",
        dob: "20/11/2002",
        address: "Ha Noi",
        email: "test@gmail.com",
        role: "Staff",
      };

      const fakePosition = [
        {
          field: "name",
          fill: "green",
          fontSize: 102,
          h: 102,
          text: "Tên",
          w: 781.4277343750019,
          x: 611.9999999999981,
          y: 534.999999999998,
          align: "center", // 👈 có thể là "left", "center", hoặc "right"
        },
        {
          field: "field_1",
          fill: "green",
          fontSize: 50,
          h: 50,
          text: "Text 01",
          w: 187.8320312500019,
          x: 1450.9999999999982,
          y: 745.0072600696172,
          align: "left", // 👈 có thể là "left", "center", hoặc "right"
        },
      ];

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
  //==============NEW
  async RenderCertificatesvds(req, res) {
    try {
      const {
        text = "Sample Text",
        size = 100,
        color = "#000000",
        bg = "#ffffff",
      } = req.query;

      // 🪶 Load font TTF
      const fontPath = path.join(
        myPath.root,
        "src",
        "public",
        "font",
        "AlexBrush-Regular.ttf",
      );
      console.log("font exits: ", fs.existsSync(fontPath));

      const textToSVG = TextToSVG.loadSync(fontPath);

      // 🧱 Tạo SVG chữ
      const svg = textToSVG.getSVG(text, {
        x: 0,
        y: 0,
        fontSize: parseInt(size),
        anchor: "top",
        attributes: { fill: color },
      });

      // 🎨 Dùng sharp để tạo ảnh PNG từ SVG
      const image = await sharp({
        create: {
          width: 1000,
          height: 400,
          channels: 3,
          background: bg,
        },
      })
        .composite([{ input: Buffer.from(svg), top: 150, left: 100 }])
        .png()
        .toBuffer();

      // 🚀 Gửi ảnh về client
      res.setHeader("Content-Type", "image/png");
      res.send(image);
    } catch (err) {
      console.error("Render error:", err);
      res
        .status(500)
        .json({ message: "Error rendering certificate", error: err.message });
    }
  }

  //
  async ContestList(req, res) {
    try {
      const contests = await CerttificatePositionEntity.find({}).lean();
      res.render("pages/e_contest", {
        layout: "layout/main",
        title: "E-Cert",
        contests,
      });
    } catch (error) {
      console.log(CNAME + error);
    }
  }
  async ContestDetail(req, res) {
    try {
    } catch (error) {}
  }
}

module.exports = new UserCertController(); //Instance
