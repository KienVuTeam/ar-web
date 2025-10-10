const express = require('express');
const router = express.Router();
const UserCertController = require('../controller/UserCertController');

// router.get('/', UserCertController.Index.bind(UserCertController))
router.get('/contest-list', UserCertController.ContestList.bind(UserCertController));
router.get('/render-cert', UserCertController.RenderCertificate.bind(UserCertController));
router.post('/save-position', UserCertController.SavePosition.bind(UserCertController));
router.get('/', UserCertController.Index.bind(UserCertController));

module.exports = router;