const mongoose = require('mongoose');
const Joi = require('joi');

const expenseSchema = new mongoose.Schema({
    ownerId: {
        type: String,
    },
    name: {
        type: String,
    },
    date: {
        type: Date,
    },
    amount: {
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


function validateExpense(body) {
    console.log('animal: ', body);
    const schema = {
        name: Joi.string().required(),
        date: Joi.string().required(),
        amount: Joi.number().required(),
    };
    return Joi.validate(body, schema);
}

exports.Expense = mongoose.model('Expense', expenseSchema);
exports.validateExpense = validateExpense;
