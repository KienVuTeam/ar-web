function buildMailTemplate(qrcode){
    return `
    <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>QR Code Ticket</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color:#f6f6f6; margin:0; padding:0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f6f6; padding:20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:30px; text-align:center; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
              <tr>
                <td>
                  <h1 style="color:#333; margin-bottom:20px;">Xin chào VĐV!</h1>
                  <p style="font-size:16px; color:#555; margin-bottom:30px;">
                    Cảm ơn bạn đã đăng ký tham gia giải chạy. Đây là mã QR để check-in của bạn:
                  </p>
                  <img src="${qrcode}" alt="QR Code" style="width:200px; height:200px; display:inline-block border: 1px solid #eee; border-radius:10px; margin-bottom:30px;" />
                  <p style="font-size:14px; color:#888; margin-top:20px;">
                    Vui lòng mang mã QR này đến điểm check-in để nhận bib.
                  </p>
                  <a href="#" style="display:inline-block; margin-top:20px; padding:12px 24px; background:#ff6b00; color:#fff; text-decoration:none; border-radius:6px; font-weight:bold;">
                    Xem thông tin giải chạy
                  </a>
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

module.exports = {buildMailTemplate}