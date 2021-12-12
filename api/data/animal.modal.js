const mongoose = require('mongoose');
const Joi = require('joi');
const { User } = require('./user.model');

const animalSchema = new mongoose.Schema({
    ownerId: {
        type: String,
    },
    cattleId: {
        type: String,
    },
    picture: {
        type: String,
        default: ''
    },
    weight: {
        type: String,
    },
    age: {
        type: Number,
    },
    breedType: {
        type: String,
    },
    cattleType: {
        type: String,
    },
    sex: {
        type: String
    },
    price: {
        type: Number,
    },
    anticipationDate: {
        type: String,
    },
    childCount: {
        type: Number,
        default: 0,
    },
    medicalHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Animal'
    }],
    assignedFeeds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feed'
    }],
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


function validateAnimal(animal) {
    console.log('Inside validate animal: ', animal);
    const schema = {
        cattleId: Joi.string().required(),
        weight: Joi.number().required(),
        age: Joi.number().required(),
        breedType: Joi.string().required(),
        cattleType: Joi.string().required(),
        sex: Joi.string().required(),
        price: Joi.number().required(),
        anticipationDate: Joi.string().optional().allow(null).allow(''),
        childCount: Joi.number().required(),
    };
    return Joi.validate(animal, schema);
}

function validateDeleteAnimal(body) {
    console.log('body: ', body);
    const schema = {
        animalId: Joi.string().required(),
    };
    return Joi.validate(body, schema);
}


function addOwnerToCattle(ownerId, cattleId) {
    return User.findByIdAndUpdate(
        ownerId,
        { $push: { cattle: cattleId } },
        { new: true, useFindAndModify: false }
    );
};

exports.Animal = mongoose.model('Animal', animalSchema);
exports.validateAnimal = validateAnimal;
exports.validateDeleteAnimal = validateDeleteAnimal;
exports.addOwnerToCattle = addOwnerToCattle;
