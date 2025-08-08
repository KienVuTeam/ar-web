const express = require('express')
const router = express.Router();

const testController = require('../controller/TestController');

// function route(app){
router.use('/action', testController.Action2)

//action default
router.use('/', testController.Index);
// }

module.exports = router;