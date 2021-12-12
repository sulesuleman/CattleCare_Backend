const { Health } = require("../data/health.model");
const { Animal } = require("../data/animal.modal");
const { Feed } = require("../data/feed.model");
const { User } = require("../data/user.model");
const { DailyFeed } = require("../data/dailyFeed.model");
const { DailyYield } = require('../data/dailyYield.model');
const moment = require("moment");
const { Expense } = require("../data/expense.model");
const { isEmpty } = require('lodash');

module.exports.getAllFarmerStats = async (req, res) => {
    console.log("in get All Farmer Stats api");

    const { user: { _id } } = req;

    try {
        const totalFeed = await Feed.countDocuments({ isDeleted: false, ownerId: _id });
        const totalAnimals = await Animal.countDocuments({ isDeleted: false, ownerId: _id });

        const feedGraph = await DailyFeed.aggregate([
            {
                $match: {
                    ownerId: _id
                }
            },
            {
                $group: {
                    _id: {
                        $month: '$createdAt'
                    },
                    consumption: {
                        $sum: '$quantity'
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: '$_id',
                    consumption: 1
                }
            }
        ]);

        const yieldGraph = await DailyYield.aggregate([
            {
                $match: {
                    ownerId: _id
                }
            },
            {
                $group: {
                    _id: {
                        $dayOfMonth: '$createdAt'
                    },
                    consumption: {
                        $sum: '$quantity'
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    day: '$_id',
                    consumption: 1
                }
            }
        ]);

        const expenseCount = await Expense.aggregate([
            {
                $match: {
                    ownerId: _id
                }
            },
            {
                $group: {
                    _id: {
                        $dayOfMonth: '$createdAt'
                    },
                    totalExpense: {
                        $sum: '$amount'
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalExpense: 1
                }
            }
        ])

        console.log(expenseCount)

        const yieldCount = await DailyYield.aggregate([
            {
                $match: {
                    ownerId: _id
                }
            },
            {
                $group: {
                    _id: {
                        $dayOfMonth: '$createdAt'
                    },
                    totalYieldAmount: {
                        $sum: '$price'
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalYieldAmount: 1
                }
            }
        ])

        const feedCount = await DailyFeed.aggregate([
            {
                $match: {
                    ownerId: _id
                }
            },
            {
                $group: {
                    _id: {
                        $dayOfMonth: '$createdAt'
                    },
                    totalFeedAmount: {
                        $sum: '$price'
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalFeedAmount: 1
                }
            }
        ])

        console.log(yieldCount, feedCount, expenseCount);

        let finalValue = '';
        if (!isEmpty(yieldCount)) {

            let newValue = ((!isEmpty(yieldCount) ? yieldCount[0]?.totalYieldAmount : 0) - (!isEmpty(feedCount) ? feedCount[0]?.totalFeedAmount : 0) + (!isEmpty(expenseCount) ? expenseCount[0]?.totalExpense : 0))

            finalValue = (newValue / (!isEmpty(yieldCount) ? yieldCount[0]?.totalYieldAmount : 0));
        }

        console.log(totalFeed, totalAnimals, feedGraph, yieldGraph);

        res
            .status(200)
            .send({
                data: { totalFeed, totalAnimals, feedGraph, yieldGraph, profit: !isEmpty(yieldCount) ? finalValue.toFixed(2) : 0 },
                error: false,
                message: "All medical history fetched successfully",
            });
    } catch (e) {
        console.log(e.message)
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }

}


module.exports.getAllAdminStats = async (req, res) => {
    console.log("in get All Admin Stats api");

    try {
        const totalFarmers = await User.countDocuments({ isDeleted: false });
        const subscriberCount = await User.countDocuments({ isDeleted: false, subscribed: true });
        const unsubscribeCount = await User.countDocuments({ isDeleted: false, subscribed: false });
        const farmerPieChart = {
            subscriberCount,
            unsubscribeCount
        }

        const farmerChart = await User.aggregate([
            {
                $match: {
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: {
                        $month: '$createdAt'
                    },
                    total: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: '$_id',
                    total: 1
                }
            }
        ]);

        console.log(totalFarmers, farmerChart, farmerPieChart);

        res
            .status(200)
            .send({
                data: { totalFarmers, farmerChart, farmerPieChart },
                error: false,
                message: "All medical history fetched successfully",
            });
    } catch (e) {
        console.log('apiFailed', e.message)
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }

}

module.exports.getProfile = async (req, res) => {
    console.log("in get User Profile api");

    const { user: { _id } } = req;

    try {
        const profile = await User.findOne({ isDeleted: false, _id: _id }, { password: 0 });
        res
            .status(200)
            .send({
                data: { profile },
                error: false,
                message: "Profile fetched successfully",
            });
    } catch (e) {
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }
}


module.exports.getAllUsers = async (req, res) => {
    console.log("in get All Farmers api");

    try {
        const farmers = await User.find({ isDeleted: false }, { password: 0 });
        res
            .status(200)
            .send({
                data: { farmers },
                error: false,
                message: "Farmers fetched successfully",
            });
    } catch (e) {
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }
}


module.exports.updateUser = async (req, res) => {
    console.log("in update User Profile api");

    const { user: { _id }, body } = req;

    try {
        const updatedProfile = await User.updateOne(
            { _id: _id },
            { ...body },
            { new: true, upsert: false }
        );
        console.log(updatedProfile);
        res
            .status(200)
            .send({
                data: {},
                error: false,
                message: "Profile updated successfully",
            });
    } catch (e) {
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }
}


module.exports.deleteUser = async (req, res) => {
    console.log("in get User Profile api");

    const { body: { userId } } = req;

    try {
        const profile = await User.updateOne({ _id: userId }, { isDeleted: true }, { new: true, upsert: false });

        res
            .status(200)
            .send({
                data: {},
                error: false,
                message: "User deleted successfully",
            });
    } catch (e) {
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }
}

module.exports.blockUnblockUser = async (req, res) => {
    console.log("in get User Profile api");

    const { body: { isBlocked, userId } } = req;

    try {
        const profile = await User.updateOne({ _id: userId }, { isBlocked: !isBlocked }, { new: true, upsert: false });

        res
            .status(200)
            .send({
                data: {},
                error: false,
                message: `User ${isBlocked ? 'Unblocked' : 'Blocked'} successfully`,
            });
    } catch (e) {
        console.log('error in api', e.message)
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }
}

