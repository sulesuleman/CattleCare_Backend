// const {
//   User,
//   validateUpdateProfile,
//   validateUpdatePassword,
//   validateResetPassword,
// } = require('../data/user.model');
// const bcrypt = require('bcryptjs');
// const speakeasy = require('speakeasy');
// const config = require('config');
// const fs = require('fs');
// const moment = require('moment');
// const { Answer } = require('../data/answer.model');
// const { Question } = require('../data/question.model');
// const { Category } = require('../data/category.model');
// const { model } = require('mongoose');

// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(config.get('send_grid_key'))



// module.exports.profile = async (req, res) => {
//   console.log('in get profile info api');
//   const {
//     user: { _id },
//   } = req;

//   let {
//     firstName,
//     lastName,
//     email,
//     isTutor,
//     isAdmin,
//     username,
//     dateOfBirth,
//     country,
//     profileImg,
//     totalUserReviews,
//     userAverageRating,
//     bankDetails,
//   } = await User.findOne(
//     { _id },
//     {
//       firstName: 1,
//       lastName: 1,
//       email: 1,
//       isTutor: 1,
//       isAdmin: 1,
//       username: 1,
//       dateOfBirth: 1,
//       country: 1,
//       profileImg: 1,
//       totalUserReviews: 1,
//       userAverageRating: 1,
//       bankDetails: 1,
//     }
//   );

//   let responseObj = {
//     firstName,
//     lastName,
//     email,
//     isTutor,
//     isAdmin,
//     username,
//     dateOfBirth: moment(dateOfBirth).format('YYYY-MM-DD'),
//     country,
//     profileImg,
//     totalUserReviews,
//     userAverageRating,
//     bankDetails,
//   };

//   return res
//     .status(200)
//     .send({ error: false, data: responseObj, message: 'Profile data found' });
// };

// module.exports.getAll = async (req, res) => {
//   console.log('in get allUsers api');
//   const {
//     query: { pageNo = 1, role },
//   } = req;

//   // console.log('pagNo', pageNo);
//   const query = {
//     isAdmin: false,
//     isDeleted: false,
//     isTutor: role === 'student' ? false : true,
//   };

//   if (!role) {
//     delete query.isTutor;
//   }
//   // console.log('query', query);
//   try {
//     const totalRecords = await User.countDocuments(query);
//     const users = await User.find(query, {
//       firstName: 1,
//       lastName: 1,
//       email: 1,
//       username: 1,
//       dateOfBirth: 1,
//       country: 1,
//       profileImg: 1,
//       wallet: 1,
//       tutorshipCategories: 1,
//       userAverageRating: 1,
//       isTutor: 1,
//       newUserFlag: 1,
//       newTutorFlag: 1,
//       createdAt: 1,
//     })
//       .sort({ $natural: -1 })
//       .skip(10 * (pageNo - 1))
//       .limit(10);
//     // .sort({ wallet: -1 });
//     // console.log('users++', users);

//     let data = [];
//     for (let item of users) {
//       data.push({
//         ...item._doc,
//         dateOfBirth: new Date(item.dateOfBirth).toLocaleDateString(),
//       });
//     }

//     return res
//       .status(200)
//       .send({ error: false, data, totalRecords, message: 'Users found' });
//   } catch (ex) {
//     return res.status(404).send({ error: true, message: ex.message });
//   }
// };

// module.exports.getAllUsers = async (req, res) => {
//   console.log('in no filtered All Users api');

//   const {
//     query: { role },
//   } = req;

//   // console.log('pagNo', pageNo);
//   const query = {
//     isAdmin: false,
//     isDeleted: false,
//     isTutor: role === 'student' ? false : true,
//   };

//   if (!role) {
//     delete query.isTutor;
//   }
//   // console.log('query', query);
//   try {
//     const totalRecords = await User.countDocuments(query);
//     const users = await User.find(query, {
//       firstName: 1,
//       lastName: 1,
//       email: 1,
//       username: 1,
//       dateOfBirth: 1,
//       country: 1,
//       profileImg: 1,
//       wallet: 1,
//       tutorshipCategories: 1,
//       userAverageRating: 1,
//       isTutor: 1,
//       newUserFlag: 1,
//       newTutorFlag: 1,
//       createdAt: 1,
//     })
//       .sort({ $natural: -1 })

//     let data = [];
//     for (let item of users) {
//       data.push({
//         ...item._doc,
//         dateOfBirth: new Date(item.dateOfBirth).toLocaleDateString(),
//       });
//     }

//     return res
//       .status(200)
//       .send({ error: false, data, totalRecords, message: 'Users found' });
//   } catch (ex) {
//     return res.status(404).send({ error: true, message: ex.message });
//   }

// }

// module.exports.updatePassword = async (req, res) => {
//   console.log('in update password api');
//   const { error } = validateUpdatePassword(req.body);
//   if (error)
//     return res
//       .status(400)
//       .send({ error: true, message: error.details[0].message });

//   const {
//     user: { _id },
//   } = req;

//   let { currentPassword, newPassword: password, confirmPassword } = req.body;

//   if (password === currentPassword)
//     return res
//       .status(400)
//       .send({ error: true, message: 'Same password provided' });

//   if (password !== confirmPassword)
//     return res
//       .status(400)
//       .send({ error: true, message: "Password doesn't matched" });

//   let user = await User.findOne({ _id });
//   if (user) {
//     bcrypt.compare(currentPassword, user.password).then(async (result) => {
//       if (result) {
//         const salt = await bcrypt.genSalt(10);
//         password = await bcrypt.hash(password, salt);

//         const user = await User.updateOne({ _id }, { $set: { password } });
//         const { n } = user;
//         return res.send({
//           error: n ? false : true,
//           message: n ? 'Password updated successfully' : 'Password not updated',
//         });
//       }
//       return res
//         .status(400)
//         .send({ error: true, message: 'Wrong password provided' });
//     });
//   } else {
//     return res.status(404).send({ error: true, message: 'No user found' });
//   }
// };

// module.exports.updateProfile = async (req, res) => {
//   console.log('in updateProfile API');
//   let profileImg = '';

//   const {
//     user: { _id },
//     body,
//     body: { email, username },
//   } = req;

//   const { error } = validateUpdateProfile(body);
//   if (error) return res.status(400).send(error.details[0].message);

//   let user = await User.findOne({
//     _id: { $ne: _id },
//     email: email.toLowerCase(),
//   });
//   if (user)
//     return res
//       .status(400)
//       .send({ error: true, message: 'Email already registered' });

//   let usernameCheck = await User.findOne({
//     _id: { $ne: _id },
//     username: username.toLowerCase(),
//   });

//   if (usernameCheck)
//     return res
//       .status(400)
//       .send({ error: true, message: 'Username already registered' });

//   profileImg = await uploadFile(req.file);

//   const query = { ...body, profileImg };
//   if (!req.file) {
//     delete query.profileImg;
//   }
//   const userData = await User.updateOne({ _id }, { $set: query });
//   const { n } = userData;
//   return res.send({
//     error: n ? false : true,
//     msg: n ? 'Profile updated successfully' : 'Profile not updated',
//   });
// };

// module.exports.sendMail = async (req, res) => {
//   console.log('in send-mail API');

//   const {
//     body: { email },
//   } = req;

//   if (!email) return res.status(400).send('Email is required');

//   const user = await User.findOne({ email: email.toLowerCase() });
//   if (!user) return res.status(404).send('No User Found..!!');

//   const secretKey = speakeasy.generateSecret({ length: 4 });
//   const resetPassKey = await speakeasy.totp({
//     secretKey: secretKey,
//     encoding: 'base32',
//   });

//   const msg = {
//     to: `${email}`, // Change to your recipient
//     from: {
//       email: config.get('sender_email'), // Change to your verified sender
//       name: 'The Gulf Academy'
//     }, // Change to your verified sender
//     subject: 'LawsOnDemand - Reset Password',
//     templateId: 'd-620c6c90f49843d09a0ec2382b3b654d',
//     dynamicTemplateData: {
//       resetPassKey: resetPassKey
//     },
//   }

//   sgMail
//     .send(msg)
//     .then(async (response) => {
//       console.log(response[0].statusCode)
//       console.log(response[0].headers)
//       console.log('Message %s sent: %s', email);
//       await User.updateOne({ _id: user._id }, { $set: { resetPassKey } });
//       return res.send('Kindly check your email.');

//     })
//     .catch((error) => {
//       console.error(error)
//       return res
//         .status(400)
//         .send({ email, status: 'Email not sent', msg: error.response });
//     }
//     )


// };

// module.exports.verifyResetPassKey = async (req, res) => {
//   console.log('in verifyResetPassKey API');
//   const {
//     body: { resetPassKey, email },
//   } = req;

//   if (!email) return res.status(400).send('Email is required');

//   const user = await User.findOne({ email: email.toLowerCase(), resetPassKey });
//   if (!user) return res.status(400).send('Invalid Reset Password Key.');

//   await User.updateOne({ _id: user._id }, { $set: { resetPassKey: '' } });
//   return res.send({
//     message: 'Reset Password Key verified',
//     token: user.generateAuthToken(),
//   });
// };

// module.exports.resetPassword = async (req, res) => {
//   console.log('in reset password api');

//   const { error } = validateResetPassword(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const {
//     user: { _id },
//   } = req;

//   let { password, confirmPassword } = req.body;
//   if (password !== confirmPassword)
//     res.status(400).send("Password doesn't matched");

//   const salt = await bcrypt.genSalt(10);
//   const hashPassword = await bcrypt.hash(password, salt);

//   const user = await User.updateOne(
//     { _id },
//     { $set: { password: hashPassword } }
//   );

//   res.send({ status: 'success', message: 'Password Reset successfully' });
// };

// module.exports.completeDetails = async (req, res) => {
//   console.log('in get completeDetails api');
//   const {
//     params: { id: _id },
//   } = req;
//   try {
//     const { isDeleted } = await User.findOne({ _id }, { isDeleted: 1 });
//     if (isDeleted === true)
//       return res
//         .status(400)
//         .send({ error: true, message: 'User do not exist' });

//     let {
//       firstName,
//       lastName,
//       email,
//       isTutor,
//       isAdmin,
//       username,
//       dateOfBirth,
//       country,
//       profileImg,
//       tutorshipCategories,
//       userAverageRating,
//     } = await User.findOne(
//       { _id },
//       {
//         firstName: 1,
//         lastName: 1,
//         email: 1,
//         isTutor: 1,
//         isAdmin: 1,
//         username: 1,
//         dateOfBirth: 1,
//         country: 1,
//         profileImg: 1,
//         tutorshipCategories: 1,
//         userAverageRating: 1,
//       }
//     );

//     const answersGiven = await Answer.countDocuments({ userId: _id });
//     const questionsAsked = await Question.countDocuments({ userId: _id });
//     const answersBought = await Answer.countDocuments({
//       buyersList: { $in: { _id } },
//     });

//     let quizzesGiven = [];
//     let quizzesGiven_ar = [];
//     if (tutorshipCategories && tutorshipCategories.length) {
//       for (let item of tutorshipCategories) {
//         const { name_en, name_ar } = await Category.findOne(
//           { _id: item },
//           { name_en: 1, name_ar: 1 }
//         );
//         quizzesGiven.push(name_en);
//         quizzesGiven_ar.push(name_ar);
//       }
//     }

//     let responseObj = {
//       firstName,
//       lastName,
//       email,
//       isTutor,
//       isAdmin,
//       username,
//       dateOfBirth: moment(dateOfBirth).format('YYYY-MM-DD'),
//       country,
//       profileImg,
//       answersGiven,
//       quizzesGiven_ar,
//       questionsAsked,
//       answersBought,
//       quizzesGiven,
//       userAverageRating,
//       _id,
//     };

//     return res.status(200).send({
//       error: false,
//       data: responseObj,
//       message: 'Complete information found',
//     });
//   } catch (ex) {
//     return res.status(400).send({ error: true, message: ex.message });
//   }
// };

// module.exports.deleteUserById = async (req, res) => {
//   console.log('in delete user by id api');
//   const {
//     params: { id: _id },
//   } = req;
//   try {
//     const data = await User.findOne({ _id }, { isDeleted: 1 });
//     await Question.updateMany({ userId: _id }, { $set: { isDeleted: true } });
//     await Answer.updateMany({ userId: _id }, { $set: { isDeleted: true } });
//     if (data) {
//       data['isDeleted'] = true;
//       await data.save();
//       return res.status(200).send({ error: false, message: 'User deleted' });
//     } else {
//       return res.status(404).send({ error: true, message: 'User not found' });
//     }
//   } catch (ex) {
//     return res.status(400).send({ error: true, message: ex.message });
//   }
// };

// module.exports.newUser = async (req, res) => {
//   const { body } = req;
//   console.log('in newUser API', body);

//   if (!body) {
//     return res
//       .status(400)
//       .send({ error: true, message: 'Something Went Wrong' });
//   }
//   try {
//     for (const id of body) {
//       const user = await User.update({ _id: id }, { newUserFlag: false });
//       // console.log('user Found +++', user);
//     }
//     return res.status(200).send({ error: false, message: 'success' });
//   } catch (ex) {
//     return res.status(400).send({ error: true, message: ex.message });
//   }
// };
// module.exports.newTutor = async (req, res) => {
//   const { body } = req;
//   console.log('in newTutor API', body.id);

//   if (!body) {
//     return res
//       .status(400)
//       .send({ error: true, message: 'Something Went Wrong' });
//   }
//   try {
//     // for (const id of body) {
//     const user = await User.updateOne(
//       { _id: body.id },
//       { newTutorFlag: false, newUserFlag: false }
//     );
//     // console.log('user Found +++', user);
//     // }
//     return res.status(200).send({ error: false, message: 'success' });
//   } catch (ex) {
//     return res.status(400).send({ error: true, message: ex.message });
//   }
// };

// const uploadFile = (file) => {
//   return new Promise((resolve, reject) => {
//     if (file) {
//       const fileContent = fs.readFileSync(file.path);
//       const params = {
//         Bucket: config.get('profile_images_bucket'),
//         CreateBucketConfiguration: {
//           LocationConstraint: 'us-east-1',
//         },
//         Key: file.filename,
//         Body: fileContent,
//       };

//       s3.upload(params, async (err, data) => {
//         if (err) {
//           throw err;
//         }
//         fs.unlinkSync(file.path);
//         resolve(data.Location);
//       });
//     } else {
//       resolve('');
//     }
//   });
// };

// module.exports.ContactIndividual = async (req, res) => {
//   const {
//     body,
//     body: { userId, message },
//   } = req;

//   console.log('in contactIndividual API');
//   console.log(userId, message);
//   if (!body) {
//     return res
//       .status(400)
//       .send({ error: true, message: 'No data' });
//   }
//   try {
//     // for (const id of body) {
//     const { email, firstName, lastName } = await User.findById(
//       { _id: userId }, { email: 1, firstName: 1, lastName: 1 }
//     );
//     const msg = {
//       to: email, // Change to your recipient
//       from: {
//         email: config.get('sender_email'), // Change to your verified sender
//         name: 'The Gulf Academy'
//       },
//       subject: 'Message from Gulf Academy',
//       templateId: 'd-017a4cf41b17417697c7d56daa87ee85',
//       dynamicTemplateData: {
//         firstName: firstName,
//         lastName: lastName,
//         message: message
//       },
//     }
//     console.log('emailbody =>', msg);
//     sgMail
//       .send(msg)
//       .then((response) => {
//         console.log(response[0].statusCode)
//         console.log(response[0].headers)
//       })
//       .catch((error) => {
//         console.error(error)
//       }
//       )

//     console.log('user Found +++', email);
//     return res.status(200).send({
//       error: false, data: 'Message Send Successfully', message: 'success'
//     });
//   }
//   catch (ex) {
//     return res.status(400).send({ error: true, data: 'Message failed to send', message: ex.message });
//   }
// };

// module.exports.ContactMany = async (req, res) => {
//   const {
//     body,
//     body: { userIds, message },
//   } = req;

//   console.log('in contactMany API');
//   console.log(userIds, message);
//   if (!body) {
//     return res
//       .status(400)
//       .send({ error: true, message: 'No data' });
//   }
//   try {
//     let emails = [];
//     for (const value of userIds) {
//       const user = await User.findOne({ _id: value }, { email: 1, firstName: 1, lastName: 1 });
//       emails.push(user);
//     }

//     console.log("emails => ", emails);

//     for (const data of emails) {
//       const msg = {
//         to: data.email, // Change to your recipient
//         from: {
//           email: config.get('sender_email'), // Change to your verified sender
//           name: 'The Gulf Academy'
//         },
//         subject: 'Message from Gulf Academy',
//         templateId: 'd-017a4cf41b17417697c7d56daa87ee85',
//         dynamicTemplateData: {
//           firstName: data.firstName,
//           lastName: data.lastName,
//           message: message
//         },
//       }

//       sgMail
//         .send(msg)
//         .then((response) => {
//           console.log(response[0].statusCode)
//           console.log(response[0].headers)
//         })
//         .catch((error) => {
//           console.error(error)
//         }
//         )

//       console.log('user Found +++', data.email);
//     }
//     return res.status(200).send({ error: false, data: 'Message Send Successfully', message: 'success' });
//   }
//   catch (ex) {
//     return res.status(400).send({ error: true, data: 'Message failed to send', message: ex.message });
//   }
// };

