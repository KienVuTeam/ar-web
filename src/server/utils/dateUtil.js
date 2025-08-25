
function FormatDateOnly(date) {
  //handle date only
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d)) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${day}-${month}-${year}`; // dạng YYYY-MM-DD
}

module.exports = {
    FormatDateOnly
}