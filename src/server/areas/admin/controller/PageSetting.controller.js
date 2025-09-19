//
const { config } = require('dotenv')
const PageSettingEntity = require('../../../model/PageSetting')
module.exports = ()=>{
    return {
        Index: (req, res)=>{
            res.send("pagesetting controller")
        },
        HomePage: async(req, res)=>{
            var hp_cf =await PageSettingEntity.findOne({type: "home_page"})

            res.render("admin/page_setting/homepage", {layout: "layout/layoutAdmin", cf: hp_cf || {}})
        },
        ConfigHomePage:async (req, res)=>{
            try {
                var data = req.body;
                // console.log(data)
                var isExit =(await PageSettingEntity.find({type: "home_page"})).length;
                if(isExit === 0){
                    // create
                    var hpConfig = new PageSettingEntity({
                    type: "home_page",
                    hero_title: data.hero_title,
                    hero_desc: data.hero_desc,
                    about_title: data.about_title,
                    about_desc: data.about_desc,
                    f_desc: data.f_desc
                    })
                    await hpConfig.save();
                }else{
                    var hpConfig = new PageSettingEntity({
                    type: "home_page",
                    hero_title: data.hero_title,
                    hero_desc: data.hero_desc,
                    about_title: data.about_title,
                    about_desc: data.about_desc,
                    f_desc: data.f_desc
                    })
                    const updateData = hpConfig.toObject();
                    delete updateData._id
                    
                    await PageSettingEntity.findOneAndUpdate(
                        {type: "home_page"},
                        {$set: updateData},
                        {new: false}
                    )
                }
                console.log("count "+isExit)
                var hp_cf =await PageSettingEntity.findOne({type: "home_page"})

                res.json({success: true, pf: hp_cf})

            } catch (error) {
                console.log("PSet_C",error)
                res.json({success: false})
            }
        }
    }
}