const express = require('express')
const router = express.Router();

const HomeController = require('../areas/admin/controller/HomeController');
const NewsController = require('../areas/admin/controller/NewsController');



//blogController
router.post('/mews/handle-image/:name', NewsController.ShowImagePartial)

router.use('/news/form-create-category', NewsController.FormCreateCategory)
router.post('/news/add-new-category', NewsController.AddCategory.bind(NewsController))
router.put('/news/update-category/:id', NewsController.UpdateCategory.bind(NewsController))
// 
router.get('/news/form-create-post', NewsController.FormCreatePost.bind(NewsController))
router.post('/news/form-create-post', NewsController.CreatePost.bind(NewsController))
router.get('/news/post-list', NewsController.PostList.bind(NewsController))
// 
router.use('/news', NewsController.Index)

//dashboard
router.use('/', HomeController.Index)

module.exports = router;