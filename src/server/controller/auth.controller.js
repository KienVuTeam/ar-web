const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  console.log("HHAA");
  const { username, password } = req.body;
  if (username === "kien" && password === "123") {
    req.session.isAdmin = true; //luu session
    return res.redirect("/admin/dashboard");
  }
  res.redirect("/admin/auth");
});
router.get('/logout', (req, res)=>{
  req.session.destroy(() => {
    res.redirect('/admin/auth');
  });

})
router.get("/", (req, res) => {
  console.log("OA");
  res.render("admin/login", { layout: false });
});

module.exports = router;
