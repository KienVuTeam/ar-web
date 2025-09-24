const adminRoute = require("./adminRoute");
const clientRoute = require("./clientRoute");
const testRoute = require("./testRoute");
const auth = require("../controller/auth.controller");
const isAuthenticated = require("../middleware/auth");


//Dấu / đầu tiên giúp trình duyệt hiểu rằng đây là từ gốc domain, không phụ thuộc vào thư mục hiện tại.
function route(app) {
  app.use("/admin/auth", auth);
  app.use("/admin", isAuthenticated, adminRoute);
  app.use("/test", testRoute);
  app.use("/", clientRoute);
  app.use((req, res, next) => {
    res.status(404).render("pages/404", { layout: false });
  });
}

module.exports = route;
