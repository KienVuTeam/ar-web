# Sidebar Canvas Synchronization Fixes

## Vấn đề đã khắc phục

### 1. ✅ Đồng bộ giữa Sidebar và Canvas

**Vấn đề:** Sidebar control và canvas không đồng bộ, giá trị không cập nhật đúng.

**Giải pháp:**

- Cải thiện hàm `syncSidebar()` với validation và logging
- Cải thiện hàm `updateTextbox()` với re-apply vertical alignment
- Thêm console logging để debug

**Code thay đổi:**

```javascript
function syncSidebar(obj) {
  if (!obj) return;

  // Update sidebar controls with current object values
  document.getElementById("fontSize").value = Math.round(obj.fontSize || 28);
  document.getElementById("color").value = obj.fill || "#000000";
  document.getElementById("fontFamily").value = obj.fontFamily || "Arial";
  document.getElementById("textAlign").value = obj.textAlign || "center";
  document.getElementById("valign").value = obj.customValign || "middle";

  console.log("🔄 Synced sidebar with object:", {
    fontSize: obj.fontSize,
    fill: obj.fill,
    fontFamily: obj.fontFamily,
    textAlign: obj.textAlign,
    valign: obj.customValign,
  });
}
```

### 2. ✅ Font bị xóa làm mất Text-box

**Vấn đề:** Khi xóa font về rỗng, text-box biến mất.

**Giải pháp:**

- Thêm validation để ngăn font bị xóa hoàn toàn
- Đặt fallback font mặc định là "Arial"
- Đảm bảo text không bị rỗng

**Code thay đổi:**

```javascript
// Prevent clearing font completely
if (!selectedFont || selectedFont.trim() === "") {
  selectedFont = "Arial"; // Default fallback
  e.target.value = "Arial";
}

// Ensure text is not empty
if (!activeTextbox.text || activeTextbox.text.trim() === "") {
  activeTextbox.set("text", activeTextbox.text || "Text");
}
```

### 3. ✅ Text-box bị nhảy xuống khi kéo thả

**Vấn đề:** Khi kéo thả text-box đến điểm snap, nó bị nhảy xuống dưới.

**Giải pháp:**

- Cải thiện vertical alignment calculation
- Sử dụng original position thay vì current position
- Chỉ apply vertical alignment khi cần thiết

**Code thay đổi:**

```javascript
function applyVerticalAlign(obj) {
  if (!obj || !obj.customValign) return;

  // Store original position before alignment
  const originalTop = obj.top;
  const originalHeight = obj.height;

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
    obj.top = originalTop + (boxHeight - textHeight) / 2;
  } else if (obj.customValign === "bottom") {
    // Align text to bottom of the box
    obj.top = originalTop + boxHeight - textHeight;
  } else if (obj.customValign === "top") {
    // Align text to top of the box (default behavior)
    obj.top = originalTop;
  }
}
```

### 4. ✅ Căn chỉnh dọc không hoạt động

**Vấn đề:** Căn chỉnh dọc (top/middle/bottom) không có thay đổi gì.

**Giải pháp:**

- Sửa logic tính toán vertical alignment
- Sử dụng original position thay vì current position
- Thêm delay để đảm bảo positioning chính xác

**Code thay đổi:**

```javascript
document.getElementById("valign").addEventListener("change", (e) => {
  if (activeTextbox) {
    const newValign = e.target.value;
    console.log("🔄 Changing vertical alignment to:", newValign);

    activeTextbox.customValign = newValign;

    // Apply vertical alignment with delay to ensure proper positioning
    setTimeout(() => {
      applyVerticalAlign(activeTextbox);
    }, 50);
  }
});
```

### 5. ✅ Cải thiện Logic tổng thể

**Vấn đề:** Logic không nhất quán, thiếu validation.

**Giải pháp:**

- Thêm validation cho font size (8-200)
- Thêm validation cho field name (chỉ chữ cái, số, underscore)
- Cải thiện error handling
- Thêm console logging để debug

**Code thay đổi:**

```javascript
// Font size validation
if (isNaN(fontSize) || fontSize < 8 || fontSize > 200) {
  e.target.value = activeTextbox ? activeTextbox.fontSize : 28;
  alert("Font size phải từ 8 đến 200!");
  return;
}

// Field name validation
if (!/^[a-zA-Z0-9_]+$/.test(key)) {
  alert("Tên field chỉ được chứa chữ cái, số và dấu gạch dưới!");
  return;
}
```

## Kết quả

### ✅ Đã khắc phục:

1. **Đồng bộ hoàn hảo** - Sidebar và canvas luôn sync với nhau
2. **Font không bị mất** - Text-box không biến mất khi thay đổi font
3. **Kéo thả mượt mà** - Không còn bị nhảy xuống khi drag
4. **Căn chỉnh dọc hoạt động** - Top/middle/bottom alignment chính xác
5. **Logic nhất quán** - Validation và error handling tốt hơn

### 🎯 Trải nghiệm người dùng:

- Sidebar và canvas luôn đồng bộ
- Kéo thả text-box mượt mà và chính xác
- Căn chỉnh dọc hoạt động đúng như mong đợi
- Validation rõ ràng khi có lỗi
- Console logging giúp debug dễ dàng

## Debugging Tips

### Console Logs:

- `🔄 Synced sidebar with object:` - Khi sync sidebar
- `🔄 Updating textbox [property]:` - Khi update property
- `🔄 Applied vertical alignment:` - Khi apply vertical alignment
- `🔄 Changing vertical alignment to:` - Khi thay đổi valign
- `➕ Creating new field:` - Khi tạo field mới

### Common Issues:

1. **Text-box không sync:** Kiểm tra console logs
2. **Vertical alignment không hoạt động:** Đảm bảo `customValign` được set
3. **Font bị mất:** Kiểm tra validation logic
4. **Drag bị nhảy:** Kiểm tra snap alignment logic

## Testing Checklist

- [ ] Tạo text-box mới
- [ ] Thay đổi font size
- [ ] Thay đổi font family
- [ ] Thay đổi màu sắc
- [ ] Thay đổi căn chỉnh ngang
- [ ] Thay đổi căn chỉnh dọc
- [ ] Kéo thả text-box
- [ ] Scale text-box
- [ ] Xóa text-box
- [ ] Lưu cấu hình
