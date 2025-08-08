const express = require('express')
const router = express.Router()

router.get('/home', (req, res, next)=>{
    res.send("admin index page")
})
router.get('/', (req, res)=>{
    res.send("admin controller default")
})

module.exports = router;