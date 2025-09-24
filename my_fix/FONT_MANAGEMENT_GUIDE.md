# Font Management Guide

## Tổng quan

Hệ thống quản lý font được thiết kế để dễ dàng thêm và sử dụng các font tùy chỉnh trong ứng dụng certificate generation.

## Cấu trúc Files

```
src/
├── server/
│   ├── config/
│   │   └── fontConfig.js          # Font configuration
│   ├── controller/
│   │   └── home.controller.js     # Updated to use font config
│   └── view/admin/volunteer/
│       └── volunteerlist.ejs      # Updated font dropdown
└── public/
    └── font/
        ├── AlexBrush-Regular.ttf
        ├── AlexBrush-Regular.woff2
        └── [other font files]
```

## Font Configuration

### File: `src/server/config/fontConfig.js`

```javascript
const fontConfig = {
  fonts: {
    Arial: {
      name: "Arial",
      family: "Arial",
      weight: "normal",
      style: "normal",
    },
    MyCustomAlexBrush: {
      name: "Alex Brush",
      family: "MyCustomAlexBrush",
      weight: "normal",
      style: "normal",
      file: "AlexBrush-Regular.ttf",
      woff2: "AlexBrush-Regular.woff2",
      isCustom: true,
    },
  },
};
```

## Cách thêm Font mới

### Bước 1: Chuẩn bị Font Files

1. **Tải font files:**
   - `.ttf` file (TrueType Font)
   - `.woff2` file (Web Open Font Format 2) - optional nhưng khuyến khích

2. **Đặt files vào thư mục:**
   ```
   src/public/font/your-font.ttf
   src/public/font/your-font.woff2
   ```

### Bước 2: Cập nhật Font Config

Thêm font vào `fontConfig.js`:

```javascript
// Thêm vào object fonts
"YourFontFamily": {
  name: "Your Font Display Name",
  family: "YourFontFamily",
  weight: "normal",
  style: "normal",
  file: "your-font.ttf",
  woff2: "your-font.woff2",
  isCustom: true
}
```

**Hoặc sử dụng helper function:**

```javascript
fontConfig.addCustomFont(
  "Your Font Display Name", // Tên hiển thị
  "YourFontFamily", // CSS family name
  "your-font.ttf", // TTF file name
  "your-font.woff2", // WOFF2 file name
);
```

### Bước 3: Cập nhật UI

Thêm option vào dropdown trong `volunteerlist.ejs`:

```html
<select id="fontFamily" class="form-select">
  <option value="Arial">Arial</option>
  <option value="Times New Roman">Times New Roman</option>
  <option value="Courier New">Courier New</option>
  <option value="Verdana">Verdana</option>
  <option value="MyCustomAlexBrush">Alex Brush</option>
  <option value="YourFontFamily">Your Font Display Name</option>
</select>
```

### Bước 4: Cập nhật CSS (Tự động)

Font CSS sẽ được tự động generate và inject vào page:

```css
@font-face {
  font-family: "YourFontFamily";
  src:
    url("/font/your-font.woff2") format("woff2"),
    url("/font/your-font.ttf") format("truetype");
  font-display: swap;
}
```

## Ví dụ: Thêm Font "Roboto"

### 1. Download Font Files

```
src/public/font/Roboto-Regular.ttf
src/public/font/Roboto-Regular.woff2
```

### 2. Cập nhật fontConfig.js

```javascript
fontConfig.addCustomFont(
  "Roboto",
  "Roboto",
  "Roboto-Regular.ttf",
  "Roboto-Regular.woff2",
);
```

### 3. Cập nhật UI

```html
<option value="Roboto">Roboto</option>
```

## API Reference

### fontConfig.addCustomFont(name, family, ttfFile, woff2File)

Thêm font tùy chỉnh mới.

**Parameters:**

- `name` (string): Tên hiển thị của font
- `family` (string): CSS font-family name
- `ttfFile` (string): Tên file TTF
- `woff2File` (string): Tên file WOFF2

### fontConfig.getFontPath(fontFamily)

Lấy đường dẫn font file cho server-side rendering.

**Parameters:**

- `fontFamily` (string): CSS font-family name

**Returns:** String path hoặc null nếu là system font

### fontConfig.getFontCSS(fontFamily)

Lấy CSS @font-face cho client-side.

**Parameters:**

- `fontFamily` (string): CSS font-family name

**Returns:** String CSS hoặc null nếu là system font

### fontConfig.getAvailableFonts()

Lấy danh sách tất cả fonts có sẵn.

**Returns:** Array of font objects

## Troubleshooting

### Font không hiển thị

1. **Kiểm tra file paths:**
   - Đảm bảo font files tồn tại trong `src/public/font/`
   - Kiểm tra tên file có đúng không

2. **Kiểm tra font config:**
   - Đảm bảo font được thêm vào `fontConfig.js`
   - Kiểm tra `isCustom: true`

3. **Kiểm tra browser console:**
   - Xem có lỗi load font không
   - Kiểm tra network tab xem font files có load được không

### Font hiển thị trong UI nhưng không trong controller

1. **Kiểm tra font registration:**
   - Đảm bảo font được register trong `app.js`
   - Kiểm tra đường dẫn font file

2. **Kiểm tra font family name:**
   - Đảm bảo tên font family đúng trong config
   - Kiểm tra case sensitivity

### Performance Issues

1. **Sử dụng WOFF2:**
   - WOFF2 nhỏ hơn TTF, load nhanh hơn
   - Luôn cung cấp cả TTF và WOFF2

2. **Font preloading:**
   - Fonts được tự động preload
   - Có thể thêm manual preload nếu cần

## Best Practices

1. **Font Naming:**
   - Sử dụng tên font family rõ ràng
   - Tránh ký tự đặc biệt trong tên file

2. **File Organization:**
   - Đặt tất cả font files trong `src/public/font/`
   - Sử dụng naming convention: `FontName-Style.ttf`

3. **Performance:**
   - Luôn cung cấp WOFF2 format
   - Sử dụng `font-display: swap` cho better UX

4. **Testing:**
   - Test font trong cả UI và controller
   - Kiểm tra trên nhiều browsers
   - Test với các kích thước text khác nhau

