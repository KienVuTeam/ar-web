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
           "Name": {
    "x": 535,
    "y": 530,
    "w": 932,
    "h": 53,
    "fontSize": 47,
    "fontFamily": "Arial",
    "color": "#f50000",
    "align": "center",
    "valign": "middle"
  },
  "Bib": {
    "x": 1448,
    "y": 732,
    "w": 333,
    "h": 53,
    "fontSize": 47,
    "fontFamily": "Arial",
    "color": "black",
    "align": "left",
    "valign": "middle"
  },
  "FinishTime": {
    "x": 83,
    "y": 316,
    "w": 333,
    "h": 53,
    "fontSize": 47,
    "fontFamily": "Arial",
    "color": "black",
    "align": "center",
    "valign": "middle"
  },
  "OverallRank": {
    "x": 83,
    "y": 433,
    "w": 333,
    "h": 53,
    "fontSize": 47,
    "fontFamily": "Arial",
    "color": "green",
    "align": "center",
    "valign": "middle"
  },
  "ClubName": {
    "x": 83,
    "y": 549,
    "w": 333,
    "h": 53,
    "fontSize": 47,
    "fontFamily": "Arial",
    "color": "purple",
    "align": "center",
    "valign": "middle"
  }
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