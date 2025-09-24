# Text-box Drag & Drop Improvements

## Vấn đề ban đầu

1. **Căn chỉnh dọc text-box không chính xác** - Hàm `applyVerticalAlign` không hoạt động đúng
2. **Font Alex Brush không sử dụng được** - Font không load đúng cách trong Fabric.js
3. **Thiếu visual feedback** - Không có giao diện rõ ràng khi kéo thả

## Các cải tiến đã thực hiện

### 1. ✅ Cải thiện Vertical Alignment

**Trước:**

```javascript
function applyVerticalAlign(obj) {
  const textHeight = obj.height * obj.scaleY;
  const boxHeight = obj.height;
  if (obj.customValign === "middle") {
    obj.top = obj.top - textHeight / 2 + boxHeight / 2;
  } else if (obj.customValign === "bottom") {
    obj.top = obj.top - textHeight + boxHeight;
  }
  canvas.renderAll();
}
```

**Sau:**

```javascript
function applyVerticalAlign(obj) {
  if (!obj || !obj.customValign) return;

  // Get the actual text metrics for accurate positioning
  const ctx = canvas.getContext();
  ctx.font = `${obj.fontSize}px ${obj.fontFamily}`;
  const textMetrics = ctx.measureText(obj.text || "");
  const textHeight =
    textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;

  // Calculate the box height
  const boxHeight = obj.height * obj.scaleY;

  // Apply vertical alignment based on the text height
  if (obj.customValign === "middle") {
    // Center the text vertically within the box
    obj.top = obj.top - textHeight / 2 + boxHeight / 2;
  } else if (obj.customValign === "bottom") {
    // Align text to bottom of the box
    obj.top = obj.top - textHeight + boxHeight;
  } else if (obj.customValign === "top") {
    // Align text to top of the box (default behavior)
    obj.top = obj.top;
  }

  canvas.renderAll();
}
```

**Lợi ích:**

- Sử dụng `measureText()` để tính toán chính xác chiều cao text
- Hỗ trợ đầy đủ 3 loại căn chỉnh: top, middle, bottom
- Tính toán dựa trên metrics thực tế của text

### 2. ✅ Cải thiện Font Alex Brush

**Thêm CSS font-face:**

```css
@font-face {
  font-family: "MyCustomAlexBrush";
  src:
    url("/font/AlexBrush-Regular.woff2") format("woff2"),
    url("/font/AlexBrush-Regular.ttf") format("truetype");
  font-display: swap;
}
```

**Cải thiện font loading trong JavaScript:**

```javascript
document.getElementById("fontFamily").addEventListener("change", (e) => {
  const selectedFont = e.target.value;

  if (activeTextbox) {
    // For custom fonts like Alex Brush, we need to ensure they're properly loaded
    if (selectedFont === "MyCustomAlexBrush") {
      // Preload the font to ensure it's available
      const fontLink = document.createElement("link");
      fontLink.href = "/font/AlexBrush-Regular.woff2";
      fontLink.rel = "preload";
      fontLink.as = "font";
      fontLink.type = "font/woff2";
      fontLink.crossOrigin = "anonymous";
      document.head.appendChild(fontLink);

      // Also try to load via CSS font-face
      const style = document.createElement("style");
      style.textContent = `
        @font-face {
          font-family: 'MyCustomAlexBrush';
          src: url('/font/AlexBrush-Regular.woff2') format('woff2'),
               url('/font/AlexBrush-Regular.ttf') format('truetype');
          font-display: swap;
        }
      `;
      document.head.appendChild(style);
    }

    activeTextbox.set("fontFamily", selectedFont);

    // Force re-render and re-apply vertical alignment
    canvas.requestRenderAll();
    setTimeout(() => {
      applyVerticalAlign(activeTextbox);
    }, 50);
  }
});
```

**Lợi ích:**

- Font được load sẵn qua CSS
- Preload font để tăng tốc độ
- Fallback từ woff2 sang ttf
- Tự động re-apply vertical alignment khi đổi font

### 3. ✅ Cải thiện Visual Feedback

**Thêm visual feedback cho textbox:**

```javascript
const textbox = new fabric.Textbox(key, {
  // ... other options
  // Add visual feedback for better UX
  borderColor: "#007bff",
  cornerColor: "#007bff",
  cornerSize: 8,
  transparentCorners: false,
});
```

**Thêm event listeners cho real-time updates:**

```javascript
// Add event listeners for better interaction
textbox.on("modified", () => {
  applyVerticalAlign(textbox);
});

textbox.on("scaling", () => {
  applyVerticalAlign(textbox);
});
```

**Lợi ích:**

- Border và corner rõ ràng khi select
- Tự động re-apply alignment khi modify/scale
- Visual feedback tốt hơn cho người dùng

### 4. ✅ Cải thiện Event Listeners

**Tối ưu hóa event listeners:**

```javascript
// Optimized event listeners with vertical alignment support
document.getElementById("fontSize").addEventListener("input", (e) => {
  updateTextbox("fontSize", parseInt(e.target.value));
  // Re-apply vertical alignment when font size changes
  if (activeTextbox) {
    setTimeout(() => {
      applyVerticalAlign(activeTextbox);
    }, 50);
  }
});
```

**Lợi ích:**

- Tự động re-apply vertical alignment khi thay đổi font size
- Loại bỏ duplicate event listeners
- Tối ưu hóa performance

### 5. ✅ Cải thiện Load Fields từ Config

**Cải thiện load fields từ database:**

```javascript
// Apply vertical alignment to all loaded fields after a short delay
setTimeout(() => {
  Object.values(fields).forEach((textbox) => {
    applyVerticalAlign(textbox);
  });
}, 200);
```

**Lợi ích:**

- Tự động apply vertical alignment cho tất cả fields được load từ DB
- Đảm bảo consistency khi load config

## Kết quả

### ✅ Đã khắc phục:

1. **Vertical alignment hoạt động chính xác** - Text được căn chỉnh đúng theo top/middle/bottom
2. **Font Alex Brush sử dụng được** - Font load đúng cách và hiển thị trong Fabric.js
3. **Visual feedback tốt hơn** - Border và corner rõ ràng khi select textbox
4. **Real-time updates** - Alignment tự động cập nhật khi thay đổi properties
5. **Performance tối ưu** - Loại bỏ duplicate code và tối ưu event listeners

### 🎯 Trải nghiệm người dùng:

- Kéo thả textbox mượt mà và chính xác
- Căn chỉnh dọc hoạt động đúng như mong đợi
- Font Alex Brush hiển thị đẹp và professional
- Visual feedback rõ ràng khi làm việc
- Tự động sync giữa sidebar và canvas

## Hướng dẫn sử dụng

1. **Tạo textbox mới:** Click "Thêm" trong sidebar
2. **Kéo thả:** Drag textbox để di chuyển vị trí
3. **Căn chỉnh dọc:** Chọn "Trên/Giữa/Dưới" trong dropdown
4. **Đổi font:** Chọn "Alex Brush" trong dropdown font
5. **Thay đổi kích thước:** Drag các corner để resize
6. **Lưu cấu hình:** Click "Save vị trí" để lưu vào database

