# Drag & Drop Text-box Improvements

## Vấn đề đã khắc phục

### 1. ✅ Kéo thả bị giựt (Jerky Drag Interaction)

**Vấn đề:** Khi kéo thả text-box, chuyển động không mượt mà và vị trí snap không tự nhiên.

**Giải pháp:**

- Tăng `aligningLineMargin` từ 4px lên 8px để snap dễ dàng hơn
- Thêm flag `isSnapping` để tránh multiple snap calculations
- Cải thiện snap logic với smooth transition
- Tự động re-apply vertical alignment sau khi snap

**Code thay đổi:**

```javascript
// Trong volunteerlist.ejs
const aligningLineMargin = 8; // Increased margin for better snapping
let isSnapping = false; // Prevent multiple snap calculations

canvas.on("object:moving", function (e) {
  if (isSnapping) return; // Prevent multiple snap calculations

  // ... snap logic ...

  // Apply snapping with smooth transition
  if (snap.x !== false || snap.y !== false) {
    isSnapping = true;
    const newX = snap.x !== false ? snap.x : aCenterX;
    const newY = snap.y !== false ? snap.y : aCenterY;

    activeObject.setPositionByOrigin(
      new fabric.Point(newX, newY),
      "center",
      "center",
    );

    // Re-apply vertical alignment after snapping
    setTimeout(() => {
      applyVerticalAlign(activeObject);
      isSnapping = false;
    }, 10);
  }
});
```

### 2. ✅ Font Alex Brush không hiển thị trong controller

**Vấn đề:** Font Alex Brush hoạt động trong UI nhưng không hiển thị đúng khi render ảnh trong controller.

**Giải pháp:**

- Cải thiện xử lý font trong hàm `drawTextInBox`
- Sử dụng font config để quản lý fonts
- Đảm bảo font family được map đúng

**Code thay đổi:**

```javascript
// Trong home.controller.js
// Handle custom fonts using font config
const fontInfo = fontConfig.fonts[finalFontFamily];
if (fontInfo && fontInfo.isCustom) {
  finalFontFamily = fontInfo.family;
}
```

### 3. ✅ Căn chỉnh ngang không hoạt động

**Vấn đề:** Căn chỉnh ngang (left/center/right) không hoạt động đúng trong controller.

**Giải pháp:**

- Cải thiện logic tính toán vị trí X
- Đảm bảo `textAlign` được áp dụng chính xác

**Code thay đổi:**

```javascript
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
```

### 4. ✅ Hệ thống quản lý font

**Vấn đề:** Khó thêm font mới và quản lý fonts.

**Giải pháp:**

- Tạo file `fontConfig.js` để quản lý fonts
- Hỗ trợ thêm font mới dễ dàng
- Tự động generate CSS cho client-side

**Files mới:**

- `src/server/config/fontConfig.js` - Font configuration
- Cập nhật controller để sử dụng font config

**Cách thêm font mới:**

```javascript
// Trong fontConfig.js
fontConfig.addCustomFont(
  "Font Name", // Display name
  "FontFamily", // CSS family name
  "font-file.ttf", // TTF file name
  "font-file.woff2", // WOFF2 file name
);
```

## Kết quả

### ✅ Đã khắc phục:

1. **Kéo thả mượt mà** - Không còn bị giựt khi drag text-box
2. **Font Alex Brush hoạt động** - Hiển thị đúng trong cả UI và controller
3. **Căn chỉnh ngang chính xác** - Left/center/right alignment hoạt động đúng
4. **Hệ thống font linh hoạt** - Dễ dàng thêm font mới

### 🎯 Trải nghiệm người dùng:

- Kéo thả text-box mượt mà và tự nhiên
- Font Alex Brush hiển thị đẹp trong certificate
- Căn chỉnh text chính xác theo ý muốn
- Dễ dàng thêm font mới khi cần

## Hướng dẫn sử dụng

### Thêm font mới:

1. Copy font files (.ttf, .woff2) vào `src/public/font/`
2. Thêm font vào `fontConfig.js`:

```javascript
fontConfig.addCustomFont("Font Name", "FontFamily", "font.ttf", "font.woff2");
```

3. Thêm option vào dropdown trong `volunteerlist.ejs`:

```html
<option value="FontFamily">Font Name</option>
```

### Sử dụng trong certificate:

- Font sẽ tự động được load và hiển thị đúng
- Căn chỉnh ngang/dọc hoạt động chính xác
- Tự động scale font size để fit trong box
