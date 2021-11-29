const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const config = require("config");
const { Animal, validateAnimal, addOwnerToCattle, validateDeleteAnimal } = require("../data/animal.modal");


module.exports.getAllAnimals = async (req, res) => {
    console.log("in get All Animal api");

    try {

        const animals = await Animal.find({ isDeleted: false }).populate('medicalHistory');

        console.log('Animals: ', animals);

        res
            .status(200)
            .send({
                data: { animals },
                error: false,
                message: "Animals fetched successfully",
            });
    } catch (e) {
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }

}

module.exports.getAllUserAnimals = async (req, res) => {
    console.log("in get All Animal api");

    const { user: { _id } } = req;
    try {

        const animals = await Animal.find({ isDeleted: false, OnwerId: _id });

        console.log('Animals: ', animals);

        res
            .status(200)
            .send({
                data: { animals },
                error: false,
                message: "Animals fetched successfully",
            });
    } catch (e) {
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }

}


module.exports.getSpecificAnimalById = async (req, res) => {
    console.log("in get All Animal api");
    const { params: { animalId } } = req;

    try {
        const animals = await Animal.find({ isDeleted: false, _id: animalId }).populate('medicalHistory');

        console.log('Animals: ', animals);
        res
            .status(200)
            .send({
                data: { animals },
                error: false,
                message: "Animals fetched successfully",

            });
    } catch (e) {
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }

}

module.exports.createAnimals = async (req, res) => {
    console.log("in create Animal api");
    const url = req.protocol + '://' + req.get('host');
    let fileUrl = url + req.file.path.replace(/\\/g, "/").substring("public".length);
    const {
        body,
        user: { _id, name, role, email },
        body: {
            cattleId,
            weight,
            age,
            breedType,
            cattleType,
            sex,
            price,
            anticipationDate,
            childCount,
        }
    } = req;

    const { error } = validateAnimal(body);
    if (error)
        return res
            .status(400)
            .send({ error: true, message: error.details[0].message });
    try {

        const animal = await Animal.create({
            ownerId: _id,
            cattleId,
            weight,
            age,
            price,
            sex,
            cattleType,
            breedType,
            anticipationDate,
            childCount,
            picture: fileUrl
        })

        console.log('New Animal: ', animal);

        await addOwnerToCattle(_id, animal._id);

        res
            .status(201)
            .send({
                data: {},
                error: false,
                message: "Animal added successfully",
            });
    } catch (e) {
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }
};



module.exports.deleteAnimal = async (req, res) => {
    console.log("in delete Animal api");

    const {
        params: { cattleId }
    } = req;

    console.log(cattleId);

    try {
        const animal = await Animal.updateOne(
            { _id: cattleId },
            { isDeleted: true },
            { new: true, upsert: false })

        console.log('New Animal: ', animal);

        res
            .status(200)
            .send({
                data: {},
                error: false,
                message: "Animal Deleted successfully",
            });
    } catch (e) {
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }
};

module.exports.updateAnimal = async (req, res) => {
    console.log("in update Animal api");

    const {
        body,
        params: { id },
        body: {
            profilePicture,
            cattleId,
            weight,
            age,
            price,
            sex,
            cattleType,
            cattlBereed,
            anticipationDate,
            childCount,
        }
    } = req;

    const data = {
        cattleId,
        weight,
        age,
        price,
        sex,
        cattleType,
        cattlBereed,
        anticipationDate,
        childCount
    }

    const { error } = validateAnimal(data);
    if (error)
        return res
            .status(400)
            .send({ error: true, message: error.details[0].message });
    try {

        const animal = await Animal.updateOne({
            _id: id,
        }, {
            cattleId,
            weight,
            age,
            price,
            sex,
            cattleType,
            cattlBereed,
            anticipationDate,
            childCount,
            picture: profilePicture
        }, { new: true, upsert: true });

        console.log('New Animal: ', animal);

        res
            .status(200)
            .send({
                data: {},
                error: false,
                message: "Animal updated successfully",
            });
    } catch (e) {
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }
};