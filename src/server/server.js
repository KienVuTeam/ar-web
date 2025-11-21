const app = require("./app");
require("dotenv").config();
const TEMP_PORT = 3500;
const HOST ='0.0.0.0';

const http = require("http");



// 🟢 Tạo server HTTP
const httpServer = http.createServer(app);



// 🚀 Khởi chạy cả hai server song song
httpServer.listen(process.env.HTTP_PORT, HOST, () => {
  console.log(`HTTP server chạy tại http://localhost:${process.env.HTTP_PORT}`);
});
