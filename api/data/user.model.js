const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  profileImg: {
    type: String,
  },
  phoneNo: {
    type: String,
  },
  address: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  subscribed: {
    type: Boolean,
    default: false,
  },
  wallet: {
    type: Number,
    default: 0,
  },
  resetPassToken: {
    type: String,
  },
  bankDetail: {
    type: Boolean,
    default: false,
  },
  newUserFlag: {
    type: Boolean,
    default: true,
  },
  cattle: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal"
    }
  ],
  bankDetails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank"
    }
  ],
  subscriptionPlan: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.isAdmin ? 'admin' : 'farmer',
      name: this.name,
    },
    config.get('jwtPrivateKey')
  );

  return token;
};

userSchema.methods.generateUnsubscribeToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      flag: 'unsubscribe'
    },
    config.get('jwtPrivateKey')
  );

  return token;
};


function validateUser(user) {
  console.log('user: ', user);
  const schema = {
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    phoneNo: Joi.string().required(),
    address: Joi.string().required()
      .min(3).max(100)
  };
  return Joi.validate(user, schema);
}

function validateLoginUser(req) {
  const schema = {
    email: Joi.string().required(),
    password: Joi.string().required(),
  };
  return Joi.validate(req, schema);
}

function validateEmail(req) {
  const schema = {
    email: Joi.string().required().email(),
  };
  return Joi.validate(req, schema);
}

// function validateUpdateProfile(req) {
//   const schema = {
//     firstName: Joi.string().required(),
//     lastName: Joi.string().required(),
//     username: Joi.string().required(),
//     email: Joi.string().required().email(),
//     dateOfBirth: Joi.date().required(),
//     country: Joi.string().required(),
//     profileImg: Joi.any(),
//   };
//   return Joi.validate(req, schema);
// }

// function validateUpdatePassword(req) {
//   const schema = {
//     currentPassword: Joi.string().required(),
//     newPassword: Joi.string().required(),
//     confirmPassword: Joi.string().required(),
//   };
//   return Joi.validate(req, schema);
// }

// function validateResetPassword(req) {
//   const schema = {
//     password: Joi.string().required(),
//     confirmPassword: Joi.string().required(),
//   };
//   return Joi.validate(req, schema);
// }

exports.User = mongoose.model('User', userSchema);
exports.validateUser = validateUser;
exports.validateLoginUser = validateLoginUser;
exports.validateEmail = validateEmail;
// exports.validateUpdateProfile = validateUpdateProfile;
// exports.validateUpdatePassword = validateUpdatePassword;
// exports.validateResetPassword = validateResetPassword;
