const express = require('express');
const router = express.Router();

const NewsController = require('../controller/NewsController');
const TestController = require('../controller/TestController');
const QrController = require('../controller/QrController');
const pageAboutJson = require('../utils/aboutConfig.json');
const { json } = require('body-parser');

//
router.use('/news', NewsController.Index.bind(NewsController));
//test
router.use('/test/scan-success', TestController.ScanSuccess.bind(TestController))
router.use('/test/scan', TestController.ScanQR.bind(TestController))
router.use('/test/send-qr', TestController.ReadQR.bind(TestController))
router.use('/test', TestController.Index.bind(TestController))
// progress
router.use('/progress/complete/:step', TestController.CompleteStep.bind(TestController))
router.get("/progress/step/:step", TestController.PageStep.bind(TestController));
router.use('/progress', TestController.Progess.bind(TestController))
// 
router.get('/qr/qr-success',(req, res)=>{
    res.json({success: true, mess:" scan qr success"})
})
router.get('/qr/admin-assigment-qr', TestController.AssigmentQrCode.bind(TestController))
//
router.get("/qr/scan-qr", QrController.scanQr.bind(QrController))
router.get("/qr/:athleteId", QrController.getQr.bind(QrController))
router.post("/qr/decode", QrController.decodeQr.bind(QrController) )

// 
router.get('/mail/send-mail', TestController.SendMail.bind(TestController))
// 5page
router.get('/about',(req, res)=>{
    var json = pageAboutJson;

    res.render("pages/about", {layout: false, title: "AccessRace - About", data:json})
})

module.exports = router;