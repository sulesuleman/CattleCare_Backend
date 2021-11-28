const mongoose = require('mongoose');
const Joi = require('joi');

const healthSchema = new mongoose.Schema({
    vaccinationType: {
        type: String,
    },
    vaccinationDate: {
        type: String,
    },
    vaccinationPeriod: {
        type: String,
    },
    diseaseType: {
        type: String,
    },
    diseaseDate: {
        type: String,
    },
    recoveryStatus: {
        type: String
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


function validateHealth(animalHealth) {
    console.log('health: ', animalHealth);
    const schema = {
        vaccinationType: Joi.string().required(),
        vaccinationDate: Joi.string().required(),
        vaccinationPeriod: Joi.string().required(),
        diseaseType: Joi.string().required(),
        diseaseDate: Joi.string().required(),
        recoveryStatus: Joi.string().required(),

    };
    return Joi.validate(animalHealth, schema);
}

exports.Health = mongoose.model('Health', healthSchema);
exports.validateHealth = validateHealth;
