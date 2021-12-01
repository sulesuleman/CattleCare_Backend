const { Feed, validateFeed } = require("../data/feed.model");


module.exports.getAllFeedsofOwner = async (req, res) => {
    console.log("in get All Feeds api");

    const { user: { _id } } = req;

    try {
        const feeds = await Feed.find({ isDeleted: false, ownerId: _id });
        res
            .status(200)
            .send({
                data: { feeds },
                error: false,
                message: "All feeds fetched successfully",
            });
    } catch (e) {
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }

}


module.exports.createFeed = async (req, res) => {
    console.log("In create Feed api");
    const {
        body,
        user: { _id, name, role, email },
        body: {
            feedName,
            feedType,
            feedBrand,
            price,
            date,
            quantity,
        }
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
        })

        // await addAnimalToFeed(feedId, medicalRecord._id);

        res
            .status(201)
            .send({
                data: {},
                error: false,
                message: "Feed added successfully",
            });
    } catch (e) {
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }
};


module.exports.deleteFeedById = async (req, res) => {
    console.log("In delete Feed  Api");

    const {
        params: { feedId }
    } = req;

    try {
        const feed = await Feed.updateOne(
            { _id: feedId },
            { isDeleted: true },
            { new: true, upsert: false })


        res
            .status(200)
            .send({
                data: {},
                error: false,
                message: "Feed deleted successfully",
            });

    } catch (e) {
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }
};

module.exports.updateFeedById = async (req, res) => {
    console.log("in update Animal Medical Record Api");

    const {
        body,
        params: { id },
        body: {
            feedName,
            feedType,
            feedBrand,
            quantity,
            price,
            date
        }
    } = req;

    try {

        await Feed.updateOne({
            _id: id,
        }, {
            feedName,
            feedType,
            feedBrand,
            quantity,
            price,
            date
        }, { new: true, upsert: true });

        res
            .status(200)
            .send({
                data: {},
                error: false,
                message: "Feed updated successfully",
            });
    } catch (e) {
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }
};