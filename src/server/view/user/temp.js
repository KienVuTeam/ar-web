let originalImageWidth = 0;
let originalImageHeight = 0;
let scaleFactor = 1;

// Load ảnh
function loadImageToStage(url) {
  const imageObj = new Image();
  imageObj.onload = function () {
    originalImageWidth = imageObj.width;
    originalImageHeight = imageObj.height;

    // Tính tỷ lệ scale vừa stage
    const scaleX = stage.width() / imageObj.width;
    const scaleY = stage.height() / imageObj.height;
    scaleFactor = Math.min(scaleX, scaleY);

    const konvaImg = new Konva.Image({
      image: imageObj,
      x: 0,
      y: 0,
      scaleX: scaleFactor,
      scaleY: scaleFactor,
    });

    layer.add(konvaImg);
    layer.batchDraw();
  };
  imageObj.src = url;
}

// Hàm thêm text-box
function addTextBox(text = "Văn bản mẫu") {
  const textNode = new Konva.Text({
    text,
    x: 100,
    y: 100,
    fontSize: 24,
    fontFamily: "Arial",
    fill: "black",
    draggable: true,
  });

  layer.add(textNode);
  layer.draw();

  // Click để chọn text-box
  textNode.on("click", () => {
    selectedTextNode = textNode;
    transformer.nodes([textNode]);
    layer.draw();
  });
}

// Lưu vị trí (theo ảnh gốc)
function saveTextPositions() {
  const positions = [];
  stage.find("Text").forEach((node) => {
    positions.push({
      text: node.text(),
      x: node.x() / scaleFactor,
      y: node.y() / scaleFactor,
      fontSize: node.fontSize() / scaleFactor,
    });
  });
  console.log("Positions relative to original image:", positions);
}

// Xuất ảnh thật
function exportImage() {
  // Tạo stage tạm đúng kích thước ảnh gốc
  const exportStage = new Konva.Stage({
    container: document.createElement("div"), // ẩn
    width: originalImageWidth,
    height: originalImageHeight,
  });
  const exportLayer = new Konva.Layer();
  exportStage.add(exportLayer);

  // Add ảnh gốc
  const imageObj = new Image();
  imageObj.onload = function () {
    exportLayer.add(new Konva.Image({ image: imageObj }));
    // Add text-box theo vị trí gốc
    stage.find("Text").forEach((node) => {
      exportLayer.add(
        new Konva.Text({
          text: node.text(),
          x: node.x() / scaleFactor,
          y: node.y() / scaleFactor,
          fontSize: node.fontSize() / scaleFactor,
          fontFamily: node.fontFamily(),
          fill: node.fill(),
        })
      );
    });
    exportLayer.draw();

    // Xuất PNG
    const dataURL = exportStage.toDataURL({ pixelRatio: 1 });
    const link = document.createElement("a");
    link.download = "export.png";
    link.href = dataURL;
    link.click();
  };
  imageObj.src = stage.findOne("Image").image().src;
}
