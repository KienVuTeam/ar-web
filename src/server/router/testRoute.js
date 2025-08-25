const express = require('express')
const router = express.Router();

const TestController = require('../controller/TestController');

router.get('/aws/send-mail', TestController.TestSendMailAWS.bind(TestController))
router.get('/ggmail/send-mail',TestController.sendMailGG.bind(TestController) )


module.exports = router;
