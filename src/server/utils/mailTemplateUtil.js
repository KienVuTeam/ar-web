function mailTemplate1(data, qrcode) {
  const genderLabel =
    data.gender === true
      ? `<span style="color:#007bff; font-weight:bold;">M</span>`
      : `<span style="color:#e83e8c; font-weight:bold;">F</span>`;

  return `
  <!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <title>Race-kit Information</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0; padding:0; background:#f4f6f9; font-family:Arial, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center" style="padding:20px 10px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="650" style="max-width:650px; background:#ffffff; border-radius:8px; overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td align="center" bgcolor="#28a745" style="padding:25px; color:#ffffff;">
                <h2 style="margin:0; font-size:20px;">🏃 Giải Chạy Alphabet B 2025</h2>
                <p style="margin:5px 0 0; font-size:14px;">Race-kit Collection Details</p>
              </td>
            </tr>

            <!-- Nội dung -->
            <tr>
              <td style="padding:25px; color:#333333; font-size:14px;">
                <p><b>Thân gửi/Dear: ${data.name}</b></p>
                <p>Ban Tổ Chức trân trọng thông báo thông tin nhận Race-kit của bạn:</p>

                <!-- Thông tin QR + VĐV -->
                <!-- CHỈNH 1: Cấu trúc bằng 2 hàng; QR căn giữa; block VĐV là table con width=100% để full-width -->
                <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:20px 0;">
                  <!-- QR -->
                  <tr>
                    <td align="center" style="padding:10px 0;">
                      <img src="${qrcode}" alt="QR Code" width="180" 
                           style="display:block; margin:0 auto; width:100%; max-width:180px; border:2px solid #eee; border-radius:8px; text-align:center;" />
                      <p style="font-size:12px; color:#555; text-align:center; margin:8px 0 0;">Mã QR / QR Code</p>
                    </td>
                  </tr>
                  <!-- VĐV full-width -->
                  <tr>
                    <td style="padding:0;" >
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                             style="background:#f9f9f9; border:1px solid #eee; border-radius:8px;">
                        <tr>
                          <td style="padding:15px; font-size:14px; color:#333333; text-align:center;" >
                            <p><b>👤: </b>${data.name} - ${genderLabel}</p>
                            <p><b>Tên in BIB:</b> ${data.bib_name}</p>
                            <p><b>BIB:</b> <span style="color:#e63946; font-weight:bold;">${data.bib}</span></p>
                            <p><b>ID:</b> ${data.cccd}</p>
                            <p><b>Cự ly:</b> ${data.distance}</p>
                            <p><b>Ngày sự kiện:</b> 15/10/2025</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <p>Nếu bạn không thấy được QR code: <br>
                  <a href="https://example.com/qrcode" style="color:#28a745; text-decoration:none; font-weight:bold;">👉 Nhấn vào đây</a>
                </p>

                <hr style="border:none; border-top:1px solid #ddd; margin:30px 0;" />

                <!-- Ủy quyền -->
                <p>Nếu bạn muốn ủy quyền cho người khác nhận Race-kit,<br> vui lòng điền thông tin tại form bên dưới:</p>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:15px 0;">
                  <tr>
                    <td bgcolor="#28a745" style="padding:12px 25px; border-radius:6px;">
                      <a href="https://example.com/authorize" style="color:#ffffff; text-decoration:none; font-weight:bold; display:inline-block;">➡️ ỦY QUYỀN NGAY</a>
                    </td>
                  </tr>
                </table>

                <hr style="border:none; border-top:1px solid #ddd; margin:30px 0;" />

                <!-- Lịch trình & cung đường -->
                <h3 style="color:#28a745; text-align:center;">📅 Lịch trình & Cung đường chạy</h3>
                <p style="text-align:center;">Xem chi tiết lịch trình sự kiện và bản đồ cung đường tại:</p>
                <table role="presentation" align="center" style="margin:15px auto;">
                  <tr>
                    <td bgcolor="#28a745" style="padding:10px 20px; border-radius:6px;">
                      <a href="https://cdn-vietrace365.vn/uploads/f_6891c2c18c58fe0ef8957028/l%E1%BB%8Bch-trinh-s%E1%BB%B1-ki%E1%BB%87n-2025711952.jpg" style="color:#fff; text-decoration:none; font-weight:bold; display:inline-block;">🔗 XEM LỊCH TRÌNH</a>
                    </td>
                  </tr>
                </table>
                <div style="text-align:center; margin-top:15px;">
                  <img src="https://cdn-vietrace365.vn/uploads/f_6891c2c18c58fe0ef8957028/l%E1%BB%8Bch-trinh-s%E1%BB%B1-ki%E1%BB%87n-2025711952.jpg" alt="Bản đồ cung đường" width="100%" style="max-width:100%; border:1px solid #ddd; border-radius:6px;" />
                  <p style="font-size:12px; color:#666;">(Nhấn vào ảnh để xem bản đồ lớn hơn)</p>
                </div>

                <hr style="border:none; border-top:1px solid #ddd; margin:30px 0;" />

                <!-- Miễn trừ trách nhiệm -->
                <div style="margin-bottom:20px;">
                  <h3 style="color:#e63946; text-align:center;">⚠️ Miễn trừ trách nhiệm</h3>
                  <p style="text-align:center;">Vui lòng đọc kỹ điều khoản miễn trừ trách nhiệm trước khi tham gia sự kiện:</p>

                  <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" style="margin:auto;">
                    <tr>
                      <td align="center" bgcolor="#e63946" style="border-radius:6px;">
                        <a href="https://accessrace.com/uploads/f_65dbf8aac26f782ac4075d3b/waiver-dhsp-2025611632.pdf"
                           style="display:inline-block; padding:12px 25px; background:#e63946; color:#fff; border-radius:6px; text-decoration:none; font-weight:bold;">
                          📄 TẢI FILE PDF
                        </a>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td bgcolor="#f1f1f1" style="padding:15px; font-size:12px; color:#666; text-align:center;">
                © 2025 Accessrace - Mọi thắc mắc vui lòng liên hệ 
                <a href="mailto:support@accessrace.asia" style="color:#28a745;">support@accessrace.asia</a>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

`;
}

function mailTemplate2() {
  return "";
}
module.exports = { mailTemplate1, mailTemplate2 };
