# Changelog - Text-box Drag & Drop Improvements

## Version 1.1.0 - 2024-01-XX

### 🚀 New Features

- **Font Management System**: Tạo hệ thống quản lý font linh hoạt
- **Improved Font Loading**: Cải thiện việc load font Alex Brush
- **Enhanced Alignment**: Cải thiện căn chỉnh ngang và dọc

### 🐛 Bug Fixes

- **Fixed Jerky Drag Interaction**: Khắc phục vấn đề kéo thả bị giựt
- **Fixed Font Display in Controller**: Font Alex Brush hiển thị đúng trong controller
- **Fixed Horizontal Alignment**: Căn chỉnh ngang hoạt động chính xác
- **Fixed Snap Alignment**: Cải thiện snap alignment cho smooth dragging

### 🔧 Improvements

- **Smooth Dragging**: Kéo thả text-box mượt mà hơn
- **Better Visual Feedback**: Cải thiện visual feedback khi drag
- **Font Config System**: Dễ dàng thêm font mới
- **Performance Optimization**: Tối ưu hóa performance khi drag

### 📁 Files Modified

- `src/server/view/admin/volunteer/volunteerlist.ejs`
- `src/server/controller/home.controller.js`
- `src/server/config/fontConfig.js` (new)
- `my_fix/DRAG_DROP_IMPROVEMENTS.md` (new)
- `my_fix/FONT_MANAGEMENT_GUIDE.md` (new)

## Version 1.0.0 - 2024-01-XX

### 🚀 Initial Features

- **Text-box Drag & Drop**: Hệ thống kéo thả text-box cơ bản
- **Vertical Alignment**: Căn chỉnh dọc text trong box
- **Font Support**: Hỗ trợ các font cơ bản
- **Certificate Generation**: Tạo certificate với text positioning

### 📁 Files Created

- `src/server/view/admin/volunteer/volunteerlist.ejs`
- `src/server/controller/home.controller.js`
- `TEXTBOX_IMPROVEMENTS.md`

## Technical Details

### Drag & Drop Improvements

- Tăng `aligningLineMargin` từ 4px lên 8px
- Thêm `isSnapping` flag để tránh multiple calculations
- Cải thiện snap logic với smooth transition
- Tự động re-apply vertical alignment sau snap

### Font Management

- Tạo `fontConfig.js` để quản lý fonts
- Hỗ trợ thêm font mới dễ dàng
- Tự động generate CSS cho client-side
- Cải thiện font loading trong controller

### Alignment Fixes

- Cải thiện logic tính toán vị trí X cho horizontal alignment
- Sửa vertical alignment calculation
- Đảm bảo text align hoạt động đúng trong controller

## Migration Guide

### Từ Version 1.0.0 lên 1.1.0

1. **Font Management:**
   - Không cần thay đổi gì, hệ thống backward compatible
   - Có thể sử dụng `fontConfig.addCustomFont()` để thêm font mới

2. **Drag & Drop:**
   - Cải thiện tự động, không cần config thêm
   - Snap alignment hoạt động tốt hơn

3. **Controller:**
   - Font Alex Brush sẽ hoạt động đúng
   - Horizontal alignment sẽ chính xác hơn

## Known Issues

### Resolved in 1.1.0

- ✅ Jerky drag interaction
- ✅ Font Alex Brush không hiển thị trong controller
- ✅ Horizontal alignment không hoạt động
- ✅ Khó thêm font mới

### Current Limitations

- Font files phải được đặt trong `src/public/font/`
- Cần restart server sau khi thêm font mới
- Chưa hỗ trợ font weights khác nhau (bold, italic)

## Future Improvements

### Planned for 1.2.0

- **Font Weight Support**: Hỗ trợ bold, italic fonts
- **Font Preview**: Preview font trong dropdown
- **Font Upload**: Upload font files qua UI
- **Better Error Handling**: Xử lý lỗi font loading tốt hơn

### Planned for 1.3.0

- **Font Caching**: Cache font files để tăng performance
- **Font Validation**: Validate font files trước khi sử dụng
- **Font Metrics**: Hiển thị thông tin font (size, weight, etc.)
- **Font Backup**: Backup/restore font configurations

