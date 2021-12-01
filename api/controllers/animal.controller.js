const { Animal, validateAnimal, addOwnerToCattle } = require("../data/animal.modal");
const csv = require('fast-csv');
const fs = require('fs');
const path = require("path");


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
    console.log("in get All User Animal api");

    const { user: { _id } } = req;
    try {

        const animals = await Animal.find({ isDeleted: false, ownerId: _id });

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


module.exports.bulkCreateAnimals = async (req, res) => {
    console.log("In Bulk Upload Animals Api", req.file);
    const {
        user: { _id }
    } = req;

    try {
        let csvData = [];
        let filePath = path.join(__dirname, "../../public/uploads/") + req.file.filename;
        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on("error", (error) => {
                throw error.message;
            })
            .on("data", (row) => {
                console.log('row: ', row);
                csvData.push(row);
            })
            .on("end", async () => {
                let dataToInsert = csvData.map(data => ({ ownerId: _id, ...data }))
                const bulkAnimals = await Animal.insertMany(dataToInsert);
            })

        res.status(200).send({ error: false, data: {}, message: 'Animals uploaded successfully' })
    }
    catch (e) {
        res.status(500).send({ error: true, message: e.message, data: {} })
    }
};



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
        file,
        params: { id },
        body: {
            cattleId,
            weight,
            age,
            price,
            sex,
            cattleType,
            breedType,
            anticipationDate,
            childCount,
        }
    } = req;

    var picture = body?.picture;
    if (file) {
        const url = req.protocol + '://' + req.get('host');
        picture = url + req.file.path.replace(/\\/g, "/").substring("public".length);
    }

    const data = {
        cattleId,
        weight,
        age,
        price,
        sex,
        cattleType,
        breedType,
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
            breedType,
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