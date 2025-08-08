const express = require('express')
const router = express.Router();

const HomeController = require('../areas/admin/controller/HomeController');
const NewsController = require('../areas/admin/controller/NewsController');


//blogController
router.post('/mews/handle-image/:name', NewsController.ShowImagePartial)

router.use('/news/form-create-category', NewsController.FormCreateCategory)
router.post('/news/add-new-category', NewsController.AddNewCategory)
router.get('/news/form-create-post', NewsController.FormCreatePost)
// 
router.use('/news', NewsController.Index)

//dashboard
router.use('/', HomeController.Index)

module.exports = router;