/**
 * notes-client-data.js
 * Ghi chú các trường hợp khi client gửi data lên server (Node.js + Express)
 */

console.log("=== Cheat Sheet: Data từ client gửi lên ===\n");

/**
 * 1. Client không gửi field
 * {
 *   "name": "Alice"
 * }
 * => req.body = { name: "Alice" }
 * => req.body.age === undefined
 */
console.log("1. Không gửi field => req.body.key === undefined");

/**
 * 2. Client gửi field nhưng để trống
 * {
 *   "name": "Alice",
 *   "age": ""
 * }
 * => req.body.age === ""
 */
console.log("2. Gửi field rỗng => req.body.key === \"\"");

/**
 * 3. Client gửi field với null
 * {
 *   "name": "Alice",
 *   "age": null
 * }
 * => req.body.age === null
 */
console.log("3. Gửi field = null => req.body.key === null");

/**
 * 4. Form HTML (application/x-www-form-urlencoded)
 * - input tồn tại nhưng rỗng: req.body.key === ""
 * - input không tồn tại: key không có trong req.body
 */
console.log("4. Form HTML => rỗng = \"\", không có input = undefined");

/**
 * 5. multipart/form-data (upload form)
 * - field không gửi: key không tồn tại
 * - field gửi rỗng: req.body.key === ""
 * - field gửi null (JSON trong multipart): req.body.key === null
 */
console.log("5. multipart/form-data => tương tự, có thể null/\"\"/undefined\n");


/**
 * ✅ Helper function: chuẩn hóa input
 * - Xoá field undefined
 * - Convert "" thành null (nếu muốn)
 */
function normalizeInput(obj, convertEmptyToNull = true) {
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue; // bỏ field undefined
    if (convertEmptyToNull && value === "") {
      cleaned[key] = null;
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

// Demo
const reqBodyExample = {
  name: "Alice",
  age: "",
  address: undefined,
  email: null
};

console.log("Input từ client:", reqBodyExample);
console.log("Sau normalize:", normalizeInput(reqBodyExample));


