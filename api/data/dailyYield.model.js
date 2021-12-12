const mongoose = require('mongoose');
const Joi = require('joi');
const { User } = require('./user.model');

const dailYieldSchema = new mongoose.Schema({
    ownerId: {
        type: String,
    },
    yieldType: {
        type: String,
    },
    quantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


function validateDailyYield(body) {
    console.log('body: ', body);
    const schema = {
        yieldType: Joi.string().required(),
        price: Joi.number().required(),
        quantity: Joi.number().required(),
    };
    return Joi.validate(body, schema);
}


// function addOwnerToCattle(ownerId, cattleId) {
//     return User.findByIdAndUpdate(
//         ownerId,
//         { $push: { cattle: cattleId } },
//         { new: true, useFindAndModify: false }
//     );
// };

exports.DailyYield = mongoose.model('DailyYield', dailYieldSchema);
exports.validateDailyYield = validateDailyYield;
