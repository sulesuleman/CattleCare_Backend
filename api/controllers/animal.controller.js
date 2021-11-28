const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const config = require("config");
const { Animal, validateAnimal, addOwnerToCattle, validateDeleteAnimal } = require("../data/animal.modal");


module.exports.getAllAnimals = async (req, res) => {
    console.log("in get All Animal api");

    const { user: { _id, email, name, role } } = req;

    console.log(`user: ${_id, email, name, role}`);

    try {

        const animals = await Animal.find({ isDeleted: false })

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


// const createUser = async (req, res, next) => {
//     let fileUrl = req.file.path.replace(/\\/g, "/").substring("public".length);
//     let newUser = {
//         username: req.body.username,
//         password: req.body.password,
//         email: req.body.email,
//         picture: fileUrl,
//         tokenId: req.body.tokenId
//     };

//     let createUser = await new user(newUser).save();

//     if (createUser) {
//         response.successResponse(res, {
//             success: 1,
//             message: "User created successfully",
//             createUser,
//         });
//     }
// };


module.exports.createAnimals = async (req, res) => {
    console.log("in create Animal api");
    let fileUrl = req.file.path.replace(/\\/g, "/").substring("public".length);
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
            picture,
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

    const { error } = validateAnimal(body);
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
            picture
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