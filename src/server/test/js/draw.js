RenderCert: async (req, res) => {
  try {
    // Mock data từ DB
    const data = {
      name: "NGUYỄN VĂN A",
      bibNumber: "10001",
      finishTime: "1h30:15",
      overallRank: "10th",
    };

    // Config vị trí (export từ Fabric)
    const positions = {
      name: {
        x: 523,
        y: 524,
        w: 948,
        h: 94,
        fontSize: 83,
        fontFamily: "Arial",
        color: "blue",
        align: "center",
        valign: "middle",
      },
      bibNumber: {
        x: 1457,
        y: 733,
        w: 370,
        h: 53,
        fontSize: 47,
        fontFamily: "Arial",
        color: "red",
        align: "center",
        valign: "middle",
      },
      finishTime: {
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
      overallRank: {
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
    };

    // Load background
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

      // Xác định vị trí X
      let posX = x;
      if (align === "center") posX = x + w / 2;
      else if (align === "right") posX = x + w;

      // Xác định vị trí Y (theo valign)
      let posY = y;
      if (valign === "middle") {
        posY = y + h / 2 + finalFontSize / 2.8;
      } else if (valign === "bottom") {
        posY = y + h;
      } else {
        posY = y + finalFontSize; // top
      }

      ctx.fillText(text, posX, posY);
    };

    // === Vẽ tất cả field ===
    for (const key in positions) {
      drawTextInBox(data[key], positions[key]);
    }

    // Xuất ảnh
    res.setHeader("Content-Type", "image/png");
    res.send(canvas.toBuffer("image/png"));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating certificate");
  }
};
