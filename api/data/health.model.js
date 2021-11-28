const mongoose = require('mongoose');
const Joi = require('joi');
const { Animal } = require('./animal.modal');

const healthSchema = new mongoose.Schema({
    cattleId: {
        type: String
    },
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
    const schema = {
        cattleId: Joi.string().required(),
        vaccinationType: Joi.string().required(),
        vaccinationDate: Joi.string().required(),
        vaccinationPeriod: Joi.string().required(),
        diseaseType: Joi.string().required(),
        diseaseDate: Joi.string().required(),
        recoveryStatus: Joi.string().required(),
    };
    return Joi.validate(animalHealth, schema);
}


function addAnimalToHealth(animalId, healthId) {
    return Animal.findByIdAndUpdate(
        animalId,
        { medicalHistory: healthId },
        { new: true, useFindAndModify: false }
    );
};


exports.Health = mongoose.model('Health', healthSchema);
exports.validateHealth = validateHealth;
exports.addAnimalToHealth = addAnimalToHealth;
