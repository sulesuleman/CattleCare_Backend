const mongoose = require('mongoose');
const Joi = require('joi');
const { User } = require('./user.model');

const bankDetailsSchema = new mongoose.Schema({
    ownerId: {
        type: String,
    },
    amount: {
        type: Number
    }, source: {
        type: String
    }, receiptEmail: {
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


function validateBankDetails(details) {
    console.log('animal: ', animal);
    const schema = {
        ownerId: Joi.string().required(),
        amount: Joi.number().required(),
        source: Joi.string().required(),
        receiptEmail: Joi.string().required(),
    };
    return Joi.validate(details, schema);
}


function addOwnerToBankDetails(ownerId, bankId) {
    return User.findByIdAndUpdate(
        ownerId,
        { $push: { bankDetails: bankId } },
        { new: true, useFindAndModify: false }
    );
};

exports.Bank = mongoose.model('BankDetail', bankDetailsSchema);
exports.validateBankDetails = validateBankDetails;
exports.addOwnerToBankDetails = addOwnerToBankDetails;
