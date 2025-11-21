const express = require('express');
const router = express.Router();

const NewsController = require('../controller/NewsController');
const TestController = require('../controller/TestController');
const QrController = require('../controller/QrController');
const ECertController = require('../controller/ecert.controller')();
const HomeController = require('../controller/home.controller')();

//new pattern
//end new pattern
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
// router.get('/mail/send-mail', TestController.SendMail.bind(TestController))
// 5page
router.get('/about',HomeController.About)

//--------------------------
router.get('/event', HomeController.Event);
// new
router.get('/load-font', ECertController.LoadAllFont);
router.get('/e-cert/render-cert', ECertController.RenderCertificate);
router.get('/e-cert/contest-detail/:slug', ECertController.ECetDetail);
router.post('/e-cert/data-table/:slug', ECertController.DataTable);
router.get('/e-cert', ECertController.Index);
// test area 
router.get('/h2', (req, res)=>{
    res.render('pages/home2', {layout: 'layout/main', title: 'home 2'})
})
// 
router.get('/volunteer/volunteer-involved/:id', HomeController.VolunteerInvolved)
router.post('/volunteer/certificate', HomeController.VolunteerCertificate)
router.get('/volunteer', HomeController.Volunteer);
router.get('/', HomeController.Index)


module.exports = router;