const Info = require("../model/info");

exports.Index = (req, res, next) => {
//   res.send("hello");
    res.render('pages/home', {title: "Trang chu"})
};
exports.Action2 = async (req, res, next) => {
  try {
    // const newUser = new User({
    //   name: "KIEN",
    //   email: "kien@example.com",
    // });
        const ifo = new Info({ name: "Kien", email: "kienvu.dev@gamil.com" });
        await ifo.save();
        res.json({ message: "User saved!", data: ifo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
