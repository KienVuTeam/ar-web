const express = require('express')
const router = express.Router()

const adminRoute = require('./admin')
const clientRoute =require('./client')

router.use('/admin', adminRoute)
router.use('/', clientRoute);
router.use('/', (req, res)=>{
    res.send("controller default redirect err page")
})

module.exports = router;