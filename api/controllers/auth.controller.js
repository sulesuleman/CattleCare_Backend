const {
  User,
  validateUser,
  validateLoginUser,
  validateEmail,
} = require('../data/user.model');

const bcrypt = require('bcryptjs');
const { pick, isEmpty } = require('lodash');


module.exports.signUpUser = async (req, res) => {
  console.log('in signup api');
  // console.log('in signup', req.body);

  const { error } = validateUser(req.body);
  if (error)
    return res
      .status(400)
      .send({ error: true, message: error.details[0].message });

  const { body: { email } } = req;

  let user = await User.findOne({ email: email.toLowerCase(), isDeleted: false, });

  if (user)
    return res
      .status(200)
      .send({ error: true, message: 'Email is already registered' });

  user = new User({
    ...pick(req.body, [
      'name',
      'email',
      'phoneNo',
      'password',
      'address',
    ]),
    createdAt: new Date(),
    newUserFlag: true,
  });

  user.email = user.email.toLowerCase();
  user.profileImg =
    'https://gulf-academy-profile-images.s3.amazonaws.com/default-profile-image.png';
  user.subscribed = false;
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  console.log('user => ', user);

  const token = user.generateAuthToken();
  res.status(201).header('token', token).send({
    data: {
      ...pick(user, [
        '_id',
        'name',
        'email',
        'phoneNo',
        'address',
        'isAdmin',
      ]),
      token,
    },
    error: false,
    message: 'User registered successfully',
  });
};

module.exports.loginUser = async (req, res) => {
  console.log('in user login api');
  const {
    body,
    body: { email, password },
  } = req;

  const { error: validateEmailError } = validateEmail({ email });

  const { error } = validateLoginUser(body);

  if (error)
    return res
      .status(406)
      .send({ error: true, message: error.details[0].message });


  const response = await User.findOne({ email }, { isDeleted: 1 });
  // console.log('response', response);
  if (!isEmpty(response) && response.isDeleted === true) {
    return res.status(401).send({ error: true, message: 'No User Found' });
  }

  let user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (user) {
    const { _id, name, email, address, phoneNo } = user;
    bcrypt.compare(password, user.password).then((result) => {
      if (result) {
        const token = user.generateAuthToken();
        return res.status(200).send({
          error: false,
          data: { token, _id, name, email, address, phoneNo },
          message: 'Successfully logged in',
        });
      }
      return res
        .status(200)
        .send({ error: true, message: 'Invalid email or password' });
    });
  } else {
    return res.status(404).send({ error: true, message: 'No User Found' });
  }

}



// module.exports.contact = async (req, res) => {
//   console.log('in contact-us api');
//   const {
//     body: { name, email, message },
//   } = req;

//   try {
//     const msg = {
//       to: 'gulfacademy.kw@gmail.com', // Change to your recipient
//       from: {
//         email: config.get('sender_email'), // Change to your verified sender
//         name: 'The Gulf Academy'
//       }, // Change to your verified sender
//       subject: 'Message For Gulf Academy',
//       templateId: 'd-e25cf50a09fc44ee9bc1b32ec542709d',
//       dynamicTemplateData: {
//         name: name,
//         email: email,
//         message: message,
//       },
//     }

//     sgMail
//       .send(msg)
//       .then((response) => {
//         console.log(response[0].statusCode)
//         console.log(response[0].headers)
//         return res.send({
//           error: false,
//           data: {},
//           message: 'Message sent successfully',
//         });

//       })
//       .catch((error) => {
//         console.error(error)
//         return res
//           .status(400)
//           .send({ error: true, message: 'Message not Sent, try again.' });
//       }
//       )


//   }
//   catch (error) {
//     return res
//       .status(400)
//       .send({ error: true, message: 'API Failed' });
//   }
// };

// module.exports.forgetPassword = async (req, res) => {
//   console.log('in forget password api');
//   const {
//     body: { email },
//   } = req;

//   const user = await User.findOne({ email });
//   if (!user)
//     return res.status(404).send({ error: true, message: 'User not found' });

//   const resetPassToken = user.generateAuthToken();


//   await User.updateOne({ email }, { $set: { resetPassToken } });
//   const msg = {
//     to: `${email}`, // Change to your recipient
//     from: {
//       email: config.get('sender_email'), // Change to your verified sender
//       name: 'The Gulf Academy'
//     }, // Change to your verified sender
//     subject: 'Gulf Academy - Reset Password Link',
//     templateId: 'd-5cf921e229fc48baa989fd146ab05d87',
//     dynamicTemplateData: {
//       resetPassToken: resetPassToken,
//     },
//   }

//   sgMail
//     .send(msg)
//     .then((response) => {
//       console.log(response[0].statusCode)
//       console.log(response[0].headers)
//       return res.send({
//         error: false,
//         data: {},
//         message: 'Message sent successfully',
//       });

//     })
//     .catch((error) => {
//       console.error(error)
//       return res
//         .status(400)
//         .send({ error: true, message: 'Message not Sent, try again.' });
//     }
//     )
// };


// module.exports.unSubscribe = async (req, res) => {
//   console.log('in unsubscribe user api');
//   const {
//     body: { token },
//   } = req;
//   try {
//     let { _id } = await jwt.verify(token, config.get('jwtPrivateKey'));

//     const { subscribeEmailNotification } = await User.findOneAndUpdate({ _id: _id },
//       { subscribeEmailNotification: false },
//       { subscribeEmailNotification: 1 });

//     return res
//       .status(201)
//       .send({
//         error: false,
//         data: {},
//         message: 'You are unsubscribed successfully',
//       });
//   }
//   catch (e) {
//     return res
//       .status(400)
//       .send({ error: true, message: 'Failed to Unsubscribe' });
//   }
// }


// module.exports.resetPassword = async (req, res) => {
//   console.log('in reset password api');
//   const {
//     body: { resetPassToken, email, newPassword, confirmPassword },
//   } = req;

//   const user = await User.findOne({ email, resetPassToken });
//   if (!user)
//     return res.status(400).send({ error: true, message: 'Link Expired' });

//   if (newPassword !== confirmPassword)
//     return res
//       .status(400)
//       .send({ error: true, message: "Password doesn't matched" });

//   const salt = await bcrypt.genSalt(10);
//   const password = await bcrypt.hash(newPassword, salt);

//   const updatedUser = await User.updateOne(
//     { email },
//     { $set: { password, resetPassToken: null } }
//   );
//   const { n } = updatedUser;
//   return res.send({
//     error: n ? false : true,
//     message: n ? 'Password reset successfully' : 'Password not reset',
//   });
// };
