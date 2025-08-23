const express = require('express')
const router = express.Router();
const upload = require('../config/multerUpload')

const HomeController = require('../areas/admin/controller/HomeController');
const NewsController = require('../areas/admin/controller/NewsController');
const GalleryController = require('../areas/admin/controller/GalleryController');
const EventController = require('../areas/admin/controller/EventController');
const AthleteController = require('../areas/admin/controller/AthleteController');
const EventV2Controller = require('../areas/admin/controller/EventV2Controller');


//EventController
router.put('/event/update-event/:id', EventController.UpdateEvent.bind(EventController)) //admin/event/delete-event
router.delete('/event/delete-event/:id',EventController.DeleteEvent.bind(EventController))
router.post('/event/new-event', EventController.AddEvent.bind(EventController))
router.get('/event/form-add-event', EventController.FormAddEvent.bind(EventController))
router.get('/event/form-edit-event', EventController.FormEditEvent.bind(EventController))
router.use('/event', EventController.Index.bind(EventController)) //dat cuoi 
// ============ [update event] ====== 
router.post('/event2/athlete/xlsx-upload',upload.single('file') ,EventV2Controller.UploadExcel.bind(EventV2Controller));
//ảhke
router.put('/event2/update-event/:id', EventV2Controller.UpdateEvent.bind(EventV2Controller))
router.post('/event2/new-event', EventV2Controller.AddEvent.bind(EventV2Controller))
router.get('/event2/form-add-event', EventV2Controller.FormAddEvent.bind(EventV2Controller))
router.get('/event2/asign-qrcode', EventV2Controller.AthleteQrCode.bind(EventV2Controller))
router.get('/event2/scan-qrcode', EventV2Controller.ScanQRCode.bind(EventV2Controller))
router.post('/event2/read-qrcode', EventV2Controller.ReadQRCode.bind(EventV2Controller))
router.get('/event2/qr-code', EventV2Controller.GenerateSign.bind(EventV2Controller))
router.post('/event2/change-status', EventV2Controller.GoToNextStep.bind(EventV2Controller))
//load here
router.get('/event2/event-list', EventV2Controller.EventList.bind(EventV2Controller))
router.get('/event2/form-edit-event/:id', EventV2Controller.LoadFormEditPartial.bind(EventV2Controller))//khi click vao event detail trong eventlist
router.use('/event2/progress/step/:step', EventV2Controller.LoadPartialPage.bind(EventV2Controller))
router.get('/event2', EventV2Controller.Index.bind(EventV2Controller))
// 

//Athlete
router.post('/athlete/detail-athlete', AthleteController.AthleteDetail.bind(AthleteController));
// router.get('/athlete/')
router.get('/athlete/manage-list', AthleteController.ManageList.bind(AthleteController));
router.post('/athlete/xlsx-upload',upload.single('file') ,AthleteController.UploadExcel.bind(AthleteController));
router.get('/athlete', AthleteController.Index.bind(AthleteController))
//Gallery
router.use('/gallery', GalleryController.Index.bind(GalleryController))
//NewsController
router.post('/mews/handle-image/:name', NewsController.ShowImagePartial)

router.get('/news/form-create-category', NewsController.FormCreateCategory)
router.post('/news/add-new-category', NewsController.AddCategory.bind(NewsController))
router.put('/news/update-category/:id', NewsController.UpdateCategory.bind(NewsController))
// 
router.get('/news/form-create-post', NewsController.FormCreatePost.bind(NewsController))
router.post('/news/form-create-post', NewsController.CreatePost.bind(NewsController))
router.get('/news/post-list', NewsController.PostList.bind(NewsController))
// 
router.use('/news', NewsController.Index)

//dashboard
// router.use('/', HomeController.Index)

module.exports = router;