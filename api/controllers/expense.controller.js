const { DailyFeed } = require('../data/dailyFeed.model');
const { DailyYield } = require('../data/dailyYield.model');
const { Expense, validateExpense } = require('../data/expense.model');


module.exports.addExpense = async (req, res) => {
    console.log("In create Expense api");
    const {
        body,
        user: { _id },
        body: { name, amount, date },
    } = req;

    const { error } = validateExpense(body);
    if (error)
        return res
            .status(400)
            .send({ error: true, message: error.details[0].message });
    try {
        const expense = await Expense.create({
            ownerId: _id,
            name,
            amount,
            date,
        });

        res.status(201).send({
            data: {},
            error: false,
            message: "Extra expense added successfully",
        });
    } catch (e) {
        console.log('error in API', e.message)
        res.status(500).send({
            error: true,
            message: e.mesasge,
            data: {},
        });
    }
};

module.exports.getExpenses = async (req, res) => {
    console.log("In get all Expenses api");
    const {
        body,
        user: { _id },
    } = req;

    try {
        const expense = await Expense.find({
            ownerId: _id,
        });

        res.status(200).send({
            data: { expense },
            error: false,
            message: "Extra expense fetched successfully",
        });
    } catch (e) {
        console.log('error in API', e.message)
        res.status(500).send({
            error: true,
            message: e.mesasge,
            data: {},
        });
    }
};

module.exports.getProfitLoss = async (req, res) => {
    console.log("In get profit loss api");
    const {
        body,
        user: { _id },
    } = req;

    try {


        console.log(expenseCount[0].totalExpense, yieldCount[0].totalYieldAmount, feedCount[0].totalFeedAmount);
        console.log('finalValue:', newValue, finalValue);


        res.status(200).send({
            data: { profit: { finalValue } },
            error: false,
            message: "Extra expense fetched successfully",
        });

    } catch (e) {
        console.log('error in API', e.message)
        res.status(500).send({
            error: true,
            message: e.mesasge,
            data: {},
        });
    }
};
