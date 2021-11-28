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
    CattleType: {
        type: String,
    },
    Sex: {
        type: String
    },
    Price: {
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
    const schema = {
        cattleId: Joi.string().required(),
        weight: Joi.number().required(),
        age: Joi.number().required(),
        breedType: Joi.string().required(),
        cattleType: Joi.string().required(),
        sex: Joi.string().required(),
        price: Joi.number().required(),
        anticipationDate: Joi.string().required(),
        childCount: Joi.number().required(),
    };
    return Joi.validate(animal, schema);
}

function validateDeleteAnimal(body) {
    const schema = {
        animalId: Joi.string().required(),
    };
    return Joi.validate(body, schema);
}


function addOwnerToCattle(ownerId, cattleId) {
    return User.findByIdAndUpdate(
        ownerId,
        { cattle: cattleId },
        { new: true, useFindAndModify: false }
    );
};

exports.Animal = mongoose.model('Animal', animalSchema);
exports.validateAnimal = validateAnimal;
exports.validateDeleteAnimal = validateDeleteAnimal;
exports.addOwnerToCattle = addOwnerToCattle;