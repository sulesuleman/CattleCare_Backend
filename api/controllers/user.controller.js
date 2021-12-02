const { Health } = require("../data/health.model");
const { Animal } = require("../data/animal.modal");
const { Feed } = require("../data/feed.model");
const { User } = require("../data/user.model");

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

    const { user: { _id } } = req;

    try {
        const profile = await User.updateOne({ _id: _id }, { isDeleted: true }, { new: true, upsert: false });

        res
            .status(200)
            .send({
                data: {},
                error: false,
                message: "Profile fetched successfully",
            });
    } catch (e) {
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }
}

