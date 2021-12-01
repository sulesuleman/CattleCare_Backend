const { Health } = require("../data/health.model");
const { Animal } = require("../data/animal.modal");
const { Feed } = require("../data/feed.model");


module.exports.getAllFarmerStats = async (req, res) => {
    console.log("in get All Farmer Stats api");

    const { user: { _id, email, name, role } } = req;

    try {
        const totalStats = await Feed.count({ isDeleted: false, ownerId: _id });
        const totalAnimals = await Animal.count({ isDeleted: false, ownerId: _id });
        console.log(totalStats, totalAnimals);

        res
            .status(200)
            .send({
                data: { totalStats, totalAnimals, },
                error: false,
                message: "All medical history fetched successfully",
            });
    } catch (e) {
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }

}
