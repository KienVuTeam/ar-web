const app = require("./app");
require("dotenv").config();
// const PORT = process.env.PORT || 3000;
const HOST ='0.0.0.0';
const fs = require("fs");
const http = require("http");
const https = require("https");

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

