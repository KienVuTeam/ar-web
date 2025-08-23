const app = require("./app");
require("dotenv").config();
// const PORT = process.env.PORT || 3000;
const HOST ='0.0.0.0';
const fs = require("fs");
const http = require("http");
const https = require("https");


// [Cho http]
// app.listen(process.env.PORT,HOST , () => {
//   console.log(`Server running at http://localhost:${process.env.PORT}`);
// });
// [End]
// [Https]
// const options = {
//   key: fs.readFileSync("key.pem"),
//   cert: fs.readFileSync("cert.pem"),
// };

// https.createServer(options, app).listen(process.env.PORT, () => {
//   console.log(`Server chạy tại https://localhost:${process.env.PORT}`);
// });

//================ Http redirect https

// const redirectApp = require("express")();
// // const HOST = "0.0.0.0";
// const HTTP_PORT = process.env.HTTP_PORT || 3000;
// const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// // Tạo server HTTPS
// const httpsOptions = {
//   key: fs.readFileSync("key.pem"),
//   cert: fs.readFileSync("cert.pem"),
// };

// https.createServer(httpsOptions, app).listen(HTTPS_PORT, HOST, () => {
//   console.log(`✅ HTTPS chạy tại https://localhost:${HTTPS_PORT}`);
// });

// // Tạo app riêng cho HTTP để redirect
// // const redirectApp = express();

// redirectApp.use((req, res) => {
//   const host = req.headers.host.split(":")[0]; // bỏ port nếu có
//   res.redirect(`https://${host}:${HTTPS_PORT}${req.url}`);
// });

// http.createServer(redirectApp).listen(HTTP_PORT, HOST, () => {
//   console.log(`🔁 HTTP đang redirect sang HTTPS tại http://localhost:${HTTP_PORT}`);
// });
// =============END
//===============[Http // Https]
// 🔐 Đọc chứng chỉ SSL (bạn cần tạo hoặc dùng chứng chỉ thật)
const sslOptions = {
  key: fs.readFileSync('./ssl/key.pem'),       // đường dẫn đến private key
  cert: fs.readFileSync('./ssl/cert.pem')      // đường dẫn đến certificate
};

// 🟢 Tạo server HTTP
const httpServer = http.createServer(app);

// 🔵 Tạo server HTTPS
const httpsServer = https.createServer(sslOptions, app);

// 🚀 Khởi chạy cả hai server song song
httpServer.listen(process.env.HTTP_PORT, HOST, () => {
  console.log(`HTTP server chạy tại http://localhost:${process.env.HTTP_PORT}`);
});

httpsServer.listen(process.env.HTTPS_PORT, HOST, () => {
  console.log(`HTTPS server chạy tại https://localhost:${process.env.HTTPS_PORT}`);
});

