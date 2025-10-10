// utils/response.util.js
function successResponse(res, data, message = 'Thành công') {
  return res.status(200).json({ success: true, message, data });
}

function errorResponse(res, action, error, code = 500) {
  const message = error.message || 'Lỗi server';
  console.error(`[${action}]: ${message}`);
  return res.status(code).json({ success: false, message });
}

module.exports = { successResponse, errorResponse };
