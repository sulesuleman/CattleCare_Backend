const mongoose = require('mongoose');
const Joi = require('joi');
const { User } = require('./user.model');
// const { User } = require('./user.model');

const feedSchema = new mongoose.Schema({
    ownerId: {
        type: String,
    },
    feedName: {
        type: String,
    },
    feedBrand: {
        type: String,
    },
    feedType: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    price: {
        type: Number,
    },
    date: {
        type: String,
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


function validateFeed(feed) {
    const schema = {
        feedName: Joi.string().required(),
        feedType: Joi.string().required(),
        feedBrand: Joi.string().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
        date: Joi.string().required(),
    };
    return Joi.validate(feed, schema);
}

// function validateDeleteAnimal(body) {
//     console.log('body: ', body);
//     const schema = {
//         animalId: Joi.string().required(),
//     };
//     return Joi.validate(body, schema);
// }


function addOwnerToFeed(ownerId, feedId) {
    return User.findByIdAndUpdate(
        ownerId,
        { $push: { feeds: feedId } },
        { new: true, useFindAndModify: false }
    );
};

exports.Feed = mongoose.model('Feed', feedSchema);
exports.validateFeed = validateFeed;
// exports.validateDeleteAnimal = validateDeleteAnimal;
exports.addOwnerToFeed = addOwnerToFeed;
