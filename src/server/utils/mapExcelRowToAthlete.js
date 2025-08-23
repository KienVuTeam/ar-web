// Chia mảng thành các mảng con (chunk)
const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};
// Chuẩn hóa tên cột
function normalizeKeys(row) {
  const normalized = {};
  Object.keys(row).forEach((key) => {
    const cleanKey = key.trim().toLowerCase(); // bỏ khoảng trắng + về lowercase
    normalized[cleanKey] = row[key];
  });
  return normalized;
}
//end
function mapExcelRowToAthlete(row, eventId) {
  const r = normalizeKeys(row);
  return {
    event_id: eventId || null,
    bib: r["bib"] || "",
    name: r["họ tên"] || "",
    bib_name: r["tên trên bib"] || "",
    gender: (r["giới tính"] || "").trim().toUpperCase() === "M", // M=true, F=false
    email: r["email"] || "",
    phone: r["số điện thoại"] || "",
    cccd: r["cmnd/cccd/passport"] || "",
    dob: r["ngày sinh" ||""],
    nation: r["quốc tịch"] || "",
    city: r["tỉnh/tp"] || "",
    address: r["địa chỉ"] || "",
    team: r["nhóm"] || "",
    team_challenge: "", // không thấy cột trong excel => để trống
    id_ticket: r["mã vé"] || "",
    order: "", // chưa rõ trong excel => để trống
    chip: r["chipcode"] || "",
    epc: r["epc"] || "",
    distance: r["cự ly"] || "",
    patron_name: r["tên người liên hệ"] || "",
    patron_phone: r["sđt người liên hệ"] || "",
    medical: r["thông tin y tế"] || "",
    blood: r["nhóm máu"] || "",
    size: (r["size áo"] || "").toString().trim().substring(0, 1), // max length = 1
    payment: false,
    checkin: false,
    registry: r["kênh bán vé"] || "",
    age: null, // có thể tính từ dob nếu muốn
    age_group: "", // có thể tính từ age nếu muốn
  };
}

module.exports = {
  chunkArray,
  mapExcelRowToAthlete,
};
