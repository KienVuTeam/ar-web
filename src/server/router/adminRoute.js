const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const myPath = require("../config/path.config");
const { uploadExcel, uploadImage } = require("../config/multerUpload");
const uploadExcelVolunteer = require("../config/excelMulterVolunteer");
const upload = require('../config/AthleteUpload');
const uploadImageECert = require("../config/uploadImageECert");
const uploadECertXcel = require('../config/ecert-xlsx.config');

// =================Config muter ====================== //
const uploadDir = path.join(
  myPath.root,
  "src",
  "uploads",
  "volunteer_certificate",
);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

//chi cho phep anh jpg/png/jpe/jpeg
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép file ảnh (.jpg, .jpeg, .png)"), false);
  }
};
const limits = { fileSize: 5 * 1024 * 1024 }; // giới hạn 5MB

const uploadImageVolunteer = multer({ storage, fileFilter, limits });
//=============== END =============================//

// const HomeController = require('../areas/admin/controller/HomeController');
const NewsController = require("../areas/admin/controller/NewsController");
const GalleryController = require("../areas/admin/controller/GalleryController");
const EventController = require("../areas/admin/controller/EventController");
const AthleteController = require("../areas/admin/controller/AthleteController");
const EventV2Controller = require("../areas/admin/controller/EventV2Controller");
const EventProcessingController = require("../areas/admin/controller/EventProcessingController");
const ECertController = require('../areas/admin/controller/ECertController');
//======== start new way
//services
const _PostService = require("../services/post.service"); // server nap ngoai nay de de test
const _CategoryService = require("../services/category.service"); //

//controllers
// const categoryController= require('../areas/admin/controller/category.controller')(_CategoryService)
const news2Controller = require("../areas/admin/controller/new2.controller")(
  _CategoryService,
  _PostService,
);
const imageController = require("../areas/admin/controller/image.controller")(); //fx
const pageSetting =
  require("../areas/admin/controller/PageSetting.controller")();
const volunteerController =
  require("../areas/admin/controller/volunteer.controller")();
//router
router.get("/news/post/index", news2Controller.ListPostAndCategory); //PostIndex
router.get("/news/post/form-create", news2Controller.FormCreatePost);
router.get("/news/post/form-edit/:id", news2Controller.FormEditPost);
router.post("/news/post/create", news2Controller.CreatePost);
router.put("/news/post/update/:id", news2Controller.UpdatePost);
router.delete("/news/post/delete/:id", news2Controller.DeletePost);

//
router.get("/news/category/index", news2Controller.Index);
// router.get('/ctegory/category-detail')
router.get("/news/category/form-create", news2Controller.FormCreate);
router.post("/news/category/create", news2Controller.CreateCategory);
// router.get('/category/form-edit') //modal lo
router.put("/news/category/update/:id", news2Controller.UpdateCategory);
router.delete("/news/category/delete", news2Controller.DeleteCategory);
// test upload anh
router.get("/img/list-folder", imageController.ListFolders); //ajax
router.get("/img/list-image/:folder", imageController.ListImagesInFolder);
router.post("/img/upload", uploadImage.single("file"), imageController.Upload);
router.get("/img", imageController.Index);
//page setting
router.get("/setting/home-page", pageSetting.HomePage);
router.post("/page-setting/home-page/config", pageSetting.ConfigHomePage);
// volunteer
router.post(
  "/volunteer/upload-excel",
  uploadExcelVolunteer.single("excelFile"),
  volunteerController.UploadExcel,
);
router.post(
  "/volunteer/upload-image",
  uploadImageVolunteer.single("cert_img"),
  volunteerController.UploadImage,
);
router.get("/volunteer/event-list", volunteerController.EventList);
router.get("/volunteer/control", volunteerController.GetVolunteer);
router.post(
  "/volunteer/certificate-config",
  volunteerController.CertificateConfig,
); //luu toa do img
router.post(
  "/volunteer/certificate-person/:id",
  volunteerController.CreateCertificate,
);//admin cert for volunteer
router.get("/volunteer/vol-list/:event_id", volunteerController.VolunteerList);
router.get("/volunteer/render-cert", volunteerController.RenderCert);
router.get("/volunteer/", volunteerController.Index);
//======== end

//=============Admin ECert
router.post('/e-cert/data-table/:cid', ECertController.DataTable.bind(ECertController));
router.get('/e-cert/render-cert', ECertController.RenderCertificate.bind(ECertController));
router.post('/e-cert/save-position/:id', ECertController.SavePosition.bind(ECertController));
router.post('/e-cert/create-contest', ECertController.AddContest.bind(ECertController));  
router.delete('/e-cert/delete-contest/:id', ECertController.DeleteContest.bind(ECertController));
router.post('/e-cert/upload-data/:id',uploadECertXcel.single('ecert_xlsx'), ECertController.UploadExcel.bind(ECertController));
router.post('/e-cert/upload-image', uploadImageECert.single('ecert_img'), ECertController.UploadImage.bind(ECertController));

router.get('/e-cert/contest-detail/:id', ECertController.ContestDetail.bind(ECertController));
router.get('/e-cert', ECertController.Index.bind(ECertController));
//EventController
router.put(
  "/event/update-event/:id",
  EventController.UpdateEvent.bind(EventController),
); //admin/event/delete-event
router.delete(
  "/event/delete-event/:id",
  EventController.DeleteEvent.bind(EventController),
);
router.post("/event/new-event", EventController.AddEvent.bind(EventController));
router.get(
  "/event/form-add-event",
  EventController.FormAddEvent.bind(EventController),
);
router.get(
  "/event/form-edit-event",
  EventController.FormEditEvent.bind(EventController),
);
router.use("/event", EventController.Index.bind(EventController)); //dat cuoi
// ============ [update event] ======
router.post(
  "/event2/athlete/xlsx-upload",
  uploadExcel.single("file"),
  EventV2Controller.UploadExcel.bind(EventV2Controller),
);
//ảhke
router.post(
  "/event2/mail/send-mail",
  EventV2Controller.sendMailQRToAthlete.bind(EventV2Controller),
);
router.post(
  "/event2/mail/send-mail2",
  EventV2Controller.sendMailQRToAthlete2.bind(EventV2Controller),
);
router.get(
  "/event2/mail/send-mail-person",
  EventV2Controller.sendMailPersional.bind(EventV2Controller),
);
router.get(
  "/event2/asign-qrcode",
  EventV2Controller.AthleteQrCode.bind(EventV2Controller),
);
router.get(
  "/event2/scan-qrcode",
  EventV2Controller.ScanQRCode.bind(EventV2Controller),
);
router.post(
  "/event2/read-qrcode",
  EventV2Controller.ReadQRCode.bind(EventV2Controller),
);
router.get(
  "/event2/qr-code",
  EventV2Controller.GenerateSign.bind(EventV2Controller),
);
router.post(
  "/event2/change-status",
  EventV2Controller.GoToNextStep.bind(EventV2Controller),
);
//load here
router.post(
  "/event2/new-event",
  EventV2Controller.AddEvent.bind(EventV2Controller),
);
router.get(
  "/event2/form-add-event",
  EventV2Controller.FormAddEvent.bind(EventV2Controller),
);
router.get(
  "/event2/form-edit-event/:id",
  EventV2Controller.LoadFormEditPartial.bind(EventV2Controller),
); //khi click vao event detail trong eventlist
router.put(
  "/event2/update-event/:id",
  EventV2Controller.UpdateEvent.bind(EventV2Controller),
);
// ---
router.get(
  "/event2/event-list",
  EventV2Controller.EventList.bind(EventV2Controller),
);
router.get(
  "/event2/athlete/stats/:eventId",
  EventV2Controller.getAthleteStats.bind(EventV2Controller),
);
router.use(
  "/event2/progress/step/:step",
  EventV2Controller.LoadPartialPage.bind(EventV2Controller),
);
router.get("/event2", EventV2Controller.Index.bind(EventV2Controller));
// ==================================Event 3================================== //
// =========Athlete

//ajax
// api cho athlete table
router.post('/api/athlete/data-table', EventProcessingController.APIAthleteDataTable.bind(EventProcessingController));
router.post('/api/athlete/athlete-export', EventProcessingController.AthleteDataExportExcel.bind(EventProcessingController));
//
router.post('/eventprocessing/athlete/import-data', upload.single('ath_data'), EventProcessingController.AthleteImportData.bind(EventProcessingController)); 
router.post('/eventprocessing/athlete/import-once/:eid',EventProcessingController.AthleteImportOnce.bind(EventProcessingController));
router.post('/eventprocessing/athlete/detail-ath', EventProcessingController.AthleteDetail.bind(EventProcessingController));
router.post('/eventprocessing/athlete/update-ath-detail/:id', EventProcessingController.AthleteDetailUpdate.bind(EventProcessingController));
router.delete('/eventprocessing/athlete/delete/:id', EventProcessingController.AthleleDetailDelete.bind(EventProcessingController));
router.get('/eventprocessing/athlete/:id', EventProcessingController.AthleteIndex.bind(EventProcessingController));//R
router.get('/eventprocessing/load-partial-view/', EventProcessingController.LoadPartialView.bind(EventProcessingController));

router.post('/eventprocessing/change-status', EventProcessingController.EventShowHide.bind(EventProcessingController));
router.get('/eventprocessing/create-form', EventProcessingController.FormAdd.bind(EventProcessingController)) //c_form
router.post('/eventprocessing/create', EventProcessingController.Create.bind(EventProcessingController)); //C
router.get('/eventprocessing/event-detail/:id', EventProcessingController.EditForm.bind(EventProcessingController)) //u_form
router.put('/eventprocessing/:id/update', EventProcessingController.Update.bind(EventProcessingController)); //U
router.delete('/eventprocessing/:id/delete', EventProcessingController.Delete.bind(EventProcessingController)); //D
router.get("/eventprocessing/progress-flow", EventProcessingController.progressFlowAction.bind(EventProcessingController));
// router.get("/eventprocessing/test", EventProcessingController.testAction.bind(EventProcessingController));
router.get("/eventprocessing", EventProcessingController.Index.bind(EventProcessingController)); //R
//

//Athlete
router.post(
  "/athlete/detail-athlete",
  AthleteController.AthleteDetail.bind(AthleteController),
);
router.put(
  "/athlete/update-athlete",
  AthleteController.AthleteUpdate.bind(AthleteController),
);
router.get(
  "/athlete/athlete-list/:slug",
  AthleteController.AthleteList.bind(AthleteController),
);
router.delete(
  "/athlete/athlete-delete",
  AthleteController.AthleteDelete.bind(AthleteController),
);
// router.get('/athlete/')
router.get(
  "/athlete/manage-list",
  AthleteController.ManageList.bind(AthleteController),
); // nen bo dan di
router.post(
  "/athlete/xlsx-upload",
  uploadExcel.single("file"),
  AthleteController.UploadExcel.bind(AthleteController),
);
router.get("/athlete", AthleteController.Index.bind(AthleteController));
//Gallery
router.use("/gallery", GalleryController.Index.bind(GalleryController));
//NewsController
// router.post('/mews/handle-image/:name', NewsController.ShowImagePartial)

// router.get('/news/form-create-category', NewsController.FormCreateCategory)
// router.post('/news/add-new-category', NewsController.AddCategory.bind(NewsController))
// router.put('/news/update-category/:id', NewsController.UpdateCategory.bind(NewsController))
// //
// router.get('/news/form-create-post', NewsController.FormCreatePost.bind(NewsController))
// router.post('/news/form-create-post', NewsController.CreatePost.bind(NewsController))
// router.get('/news/post-list', NewsController.PostList.bind(NewsController))
// //
// router.use('/news', NewsController.Index)

//dashboard
router.get("/dashboard", (req, res) => {
  res.render("admin/index", {
    layout: "layout/layoutAdmin",
    title: "Admin Dashboard",
  });
});
router.use((req, res)=>{
  res.status(404).render('admin/404', {layout: false})
})

module.exports = router;
