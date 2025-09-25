const express = require('express')
const router = express.Router();
const AthleteV1 = require('../services/AthleteV1.service');
const TestController = require('../controller/TestController');

router.get('/dong-goi', (req, res)=>{
    const _athletenew = new AthleteV1("Kien ne", "hello class");
    console.log(_athletenew.name);
    console.log(_athletenew.mess)
    res.json({
        name: _athletenew.name,
        mess: _athletenew.mess
    })
})
router.get('/aws/send-mail', TestController.TestSendMailAWS.bind(TestController))
router.get('/ggmail/send-mail',TestController.sendMailGG.bind(TestController) )
router.get('/home-page', TestController.HomePage.bind(TestController))
router.get('/page-about', (req, res)=>{
    res.render("pages/page-about", {layout: "layout/main"})
})


module.exports = router;
