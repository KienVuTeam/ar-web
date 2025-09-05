const pageConfig = require("../utils/aboutConfig.json");
const PageSettingEntity = require("../model/PageSetting");
const EventEntity = require("../model/Event")
module.exports = () => {
  async function HomePageHelper() {
    return await PageSettingEntity.findOne({ type: "home_page" });
  }
  return {
    Index: async (req, res) => {
      //   var hp = await PageSettingEntity.findOne({ type: "home_page" });
      var hp = await HomePageHelper();
      res.render("pages/home", {
        title: "Trang chu",
        hp: hp,
        f_data: hp?.f_desc || "",
      });
    },
    About: (req, res) => {
      res.render("pages/about", {
        layout: false,
        title: "About",
        data: pageConfig,
      });
    },
    Event: async (req, res) => {

      var hp_config = await HomePageHelper();
      var events = await EventEntity.find({}).lean();
    //   console.log(events)
      res.render("pages/event", {
        layout: "layout/main",
        title: "Event",
        f_data: hp_config?.f_desc || "",
        events: events
      });
    },
  };
};
