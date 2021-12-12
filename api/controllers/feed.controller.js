const { DailyFeed, validateDailyFeed, } = require("../data/dailyFeed.model");
const { Feed, validateFeed, addOwnerToFeed } = require("../data/feed.model");

module.exports.getAllFeedsofOwner = async (req, res) => {
    console.log("in get All Feeds api");

    const {
        user: { _id },
    } = req;

    try {
        const feeds = await Feed.find({ isDeleted: false, ownerId: _id });
        res.status(200).send({
            data: { feeds },
            error: false,
            message: "All feeds fetched successfully",
        });
    } catch (e) {
        res.status(500).send({
            error: true,
            message: e.mesasge,
            data: {},
        });
    }
};

module.exports.createFeed = async (req, res) => {
    console.log("In create Feed api");
    const {
        body,
        user: { _id },
        body: { feedName, feedType, feedBrand, price, date, quantity },
    } = req;

    const { error } = validateFeed(body);
    if (error)
        return res
            .status(400)
            .send({ error: true, message: error.details[0].message });
    try {
        const feed = await Feed.create({
            ownerId: _id,
            feedName,
            feedBrand,
            feedType,
            price,
            quantity,
            date,
        });

        await addOwnerToFeed(_id, feed._id);

        res.status(201).send({
            data: {},
            error: false,
            message: "Feed added successfully",
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


module.exports.getAllUserDailyFeed = async (req, res) => {
    console.log("in get All User Daily Feeds api");

    const {
        user: { _id },
    } = req;

    try {
        const dailyFeeds = await DailyFeed.find({ isDeleted: false, ownerId: _id }).populate('feedId');

        console.log(dailyFeeds);

        res.status(200).send({
            data: { dailyFeeds },
            error: false,
            message: "Daily feed consumption fetched successfully",
        });
    } catch (e) {
        console.log('Get all Daily FEEDS Failed:', e.message);
        res.status(500).send({
            error: true,
            message: e.mesasge,
            data: {},
        });
    }
};

module.exports.addDailyFeed = async (req, res) => {
    console.log("In add Daily Feed Consumption api");
    const {
        body,
        user: { _id },
        body: { feedId, quantity, price },
    } = req;

    try {
        const { error } = validateDailyFeed(body);
        if (error)
            return res
                .status(400)
                .send({ error: true, message: error.details[0].message });

        const feed = await Feed.findOne(
            { _id: feedId },
        );

        console.log(`totalQuantity: ${feed.quantity}, totalPrice: ${feed.price}`)

        const dailyFeed = await DailyFeed.create({
            ownerId: _id,
            feedId,
            quantity: quantity,
            price: price,
        });

        feed.quantity = feed.quantity - quantity;
        feed.price = feed.price - price;
        feed.save();

        console.log("dailyFeed: ", dailyFeed);

        res.status(201).send({
            data: {},
            error: false,
            message: "Feed added successfully",
        });
    } catch (e) {
        console.log('error: ', e);
        res.status(500).send({
            error: true,
            message: e.mesasge,
            data: {},
        });
    }
};

module.exports.deleteFeedById = async (req, res) => {
    console.log("In delete Feed  Api");

    const {
        params: { feedId },
    } = req;

    try {
        const feed = await Feed.updateOne(
            { _id: feedId },
            { isDeleted: true },
            { new: true, upsert: false }
        );

        res.status(200).send({
            data: {},
            error: false,
            message: "Feed deleted successfully",
        });
    } catch (e) {
        res.status(500).send({
            error: true,
            message: e.mesasge,
            data: {},
        });
    }
};

module.exports.updateFeedById = async (req, res) => {
    console.log("in update Animal Medical Record Api");

    const {
        body,
        params: { id },
        body: { feedName, feedType, feedBrand, quantity, price, date },
    } = req;

    try {
        await Feed.updateOne(
            {
                _id: id,
            },
            {
                feedName,
                feedType,
                feedBrand,
                quantity,
                price,
                date,
            },
            { new: true, upsert: true }
        );

        res.status(200).send({
            data: {},
            error: false,
            message: "Feed updated successfully",
        });
    } catch (e) {
        res.status(500).send({
            error: true,
            message: e.mesasge,
            data: {},
        });
    }
};
