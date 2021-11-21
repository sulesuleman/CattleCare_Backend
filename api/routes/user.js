const express = require('express');
const router = express.Router();
// const userCtrl = require('./../controllers/user.controller');
// const middleWare = require('./../middleware/auth.middleware');
// const multer = require('multer');
// var upload = multer({ dest: `${__dirname}/../uploads/` });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, `${__dirname}/../uploads/`);
//   },
//   filename: function (req, file, cb) {
//     const fileName = file.originalname.replace(/\s/g, '');
//     cb(null, Date.now() + '-' + fileName);
//   },
// });

// var upload = multer({ storage: storage });

// router.get('/all', userCtrl.getAll);
// router.get('/list-all', userCtrl.getAllUsers);
// router.get('/:id', userCtrl.completeDetails);
// router.get('/', middleWare.authMiddle, middleWare.isDeleted, userCtrl.profile);
// router.post(
//   '/new-user',
//   middleWare.authMiddle,
//   middleWare.isAdmin,
//   userCtrl.newUser
// );
// router.post(
//   '/new-tutor',
//   middleWare.authMiddle,
//   middleWare.isAdmin,
//   userCtrl.newTutor
// );
// router.post('/send-forget-password-email', userCtrl.sendMail);
// router.post('/verify-password-key', userCtrl.verifyResetPassKey);
// router.post(
//   '/reset-password',
//   middleWare.authMiddle,
//   middleWare.isDeleted,
//   userCtrl.resetPassword
// );
// router.put(
//   '/update-password',
//   middleWare.authMiddle,
//   middleWare.isDeleted,
//   userCtrl.updatePassword
// );
// router.put(
//   '/',
//   middleWare.authMiddle,
//   middleWare.isDeleted,
//   upload.single('profileImg'),
//   userCtrl.updateProfile
// );
// router.delete(
//   '/:id',
//   middleWare.authMiddle,
//   middleWare.isAdmin,
//   userCtrl.deleteUserById
// );
// router.post(
//   '/contact-individual',
//   middleWare.authMiddle,
//   middleWare.isAdmin,
//   userCtrl.ContactIndividual,
// );
// router.post(
//   '/contact-many',
//   middleWare.authMiddle,
//   middleWare.isAdmin,
//   userCtrl.ContactMany,
// );

module.exports = router;
