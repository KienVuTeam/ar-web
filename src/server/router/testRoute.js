const express = require('express')
const router = express.Router();

const TestController = require('../controller/TestController');

router.get('/aws/send-mail', TestController.TestSendMailAWS.bind(TestController))
router.get('/ggmail/send-mail',TestController.sendMailGG.bind(TestController) )
router.get('/home-page', TestController.HomePage.bind(TestController))
router.get('/page-about', (req, res)=>{
    res.render("pages/page-about", {layout: "layout/main"})
})


module.exports = router;
