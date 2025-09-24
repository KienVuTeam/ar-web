# Certificate Generation Performance Optimizations

## Vấn đề ban đầu

Nút render certificate mất khoảng 2 giây để load ra ảnh có text vẽ trên ảnh.

## Các tối ưu hóa đã thực hiện

### 1. ✅ Font Registration Optimization

**Trước:** Font được đăng ký mỗi lần request

```javascript
// Trong VolunteerCertificate function
const fontPath = path.join(
  pathConfig.root,
  "src",
  "public",
  "font",
  "AlexBrush-Regular.ttf",
);
registerFont(fontPath, { family: "MyCustomAlexBrush" });
```

**Sau:** Font được đăng ký một lần khi khởi động ứng dụng

```javascript
// Trong app.js
const fontPath = path.join(__dirname, "../public/font/AlexBrush-Regular.ttf");
registerFont(fontPath, { family: "MyCustomAlexBrush" });
```

**Lợi ích:** Tiết kiệm ~200-500ms mỗi request

### 2. ✅ Database Queries Parallelization

**Trước:** 2 queries chạy tuần tự

```javascript
const volunteer = await VolunteerEntity.findOne({ _id: volunteer_id }).lean();
const certconfig = await CertificateConfigEntity.findOne({
  event_id: event_id,
});
```

**Sau:** 2 queries chạy song song

```javascript
const [volunteer, certconfig] = await Promise.all([
  VolunteerEntity.findOne({ _id: volunteer_id }).lean(),
  CertificateConfigEntity.findOne({ event_id: event_id }),
]);
```

**Lợi ích:** Tiết kiệm ~100-300ms

### 3. ✅ Image Caching

**Trước:** Load ảnh từ file system mỗi lần request

```javascript
const bg = await loadImage(imgPath);
```

**Sau:** Cache ảnh trong memory

```javascript
// Image cache to avoid reloading images from filesystem
const imageCache = new Map();

// Use cached image if available, otherwise load and cache it
let bg;
if (imageCache.has(imgPath)) {
  bg = imageCache.get(imgPath);
} else {
  bg = await loadImage(imgPath);
  imageCache.set(imgPath, bg);
}
```

**Lợi ích:** Tiết kiệm ~300-800ms cho các request tiếp theo

### 4. ✅ Canvas Operations Optimization

**Trước:** Linear search cho font size

```javascript
while (finalFontSize >= minFontSize) {
  ctx.font = `${fontWeight} ${finalFontSize}px "${finalFontFamily}"`;
  const textWidth = ctx.measureText(text).width;
  if (textWidth <= w) break;
  finalFontSize -= 2;
}
```

**Sau:** Binary search cho font size

```javascript
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
```

**Lợi ích:** Giảm số lần đo text từ O(n) xuống O(log n)

## Kết quả dự kiến

- **Request đầu tiên:** Giảm từ ~2000ms xuống ~800-1000ms
- **Các request tiếp theo:** Giảm từ ~2000ms xuống ~400-600ms
- **Tổng cải thiện:** 50-70% thời gian response

## Các tối ưu hóa bổ sung có thể thực hiện

1. **Canvas Pooling:** Tái sử dụng canvas objects
2. **Background Processing:** Generate certificate trong background
3. **CDN Caching:** Cache generated images
4. **Database Indexing:** Tối ưu database queries
5. **Memory Management:** Implement cache eviction policy
