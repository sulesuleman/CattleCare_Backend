const mongoose = require('mongoose');
const Joi = require('joi');
const { User } = require('./user.model');

const dailFeedSchema = new mongoose.Schema({
    ownerId: {
        type: String,
    },
    feedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feed'
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


function validateDailyFeed(body) {
    console.log('animal: ', body);
    const schema = {
        feedId: Joi.string().required(),
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

exports.DailyFeed = mongoose.model('DailyFeed', dailFeedSchema);
exports.validateDailyFeed = validateDailyFeed;
