const {
    Animal,
    validateAnimal,
    addOwnerToCattle,
} = require("../data/animal.modal");
const { Bank } = require("../data/bankDetails.model");
const csv = require("fast-csv");
const fs = require("fs");
const path = require("path");
const { DailyYield, validateDailyYield } = require("../data/dailyYield.model");
const { isEmpty } = require("lodash");

module.exports.getAllAnimals = async (req, res) => {
    console.log("in get All Animal api");

    try {
        const animals = await Animal.find({ isDeleted: false }).populate(
            "medicalHistory"
        );

        console.log("Animals: ", animals);

        res.status(200).send({
            data: { animals },
            error: false,
            message: "Animals fetched successfully",
        });
    } catch (e) {
        res.status(500).send({
            error: true,
            message: e.mesasge,
            data: {},
        });
    }
};

module.exports.getAllUserAnimals = async (req, res) => {
    console.log("in get All User Animal api");

    const {
        user: { _id },
        query: { search },
    } = req;
    try {
        const animals = await Animal.find({
            $and: [
                { isDeleted: false },
                { ownerId: _id },
                {
                    ...(search ? { $text: { $search: search } } : {})
                }]
        });

        res.status(200).send({
            data: { animals },
            error: false,
            message: "Animals fetched successfully",
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            error: true,
            message: e.mesasge,
            data: {}
        });
    }
};

module.exports.getSpecificAnimalById = async (req, res) => {
    console.log("in get All Animal api");
    const {
        params: { animalId },
    } = req;

    try {
        const animals = await Animal.find({
            isDeleted: false,
            _id: animalId,
        }).populate("medicalHistory");

        console.log("Animals: ", animals);
        res.status(200).send({
            data: { animals },
            error: false,
            message: "Animals fetched successfully",
        });
    } catch (e) {
        res.status(500).send({
            error: true,
            message: e.mesasge,
            data: {},
        });
    }
};

module.exports.uploadEarTag = async (req, res) => {
    const { file } = req;

}

module.exports.bulkCreateAnimals = async (req, res) => {
    console.log("In Bulk Upload Animals Api", req.file);
    const {
        user: { _id, email },
    } = req;

    try {
        let csvData = [];

        const bankInfo = await Bank.findOne({ receiptEmail: email });

        const animalCount = await Animal.count({
            $and: [
                { isDeleted: false },
                { ownerId: _id },
            ]
        });

        if (animalCount >= bankInfo.limit) {
            return res.status(200).send({
                error: true,
                message: 'You have exceeded your cattle limit for this package'
            })
        }

        let filePath =
            path.join(__dirname, "../../public/uploads/") + req.file.filename;
        let count = animalCount;
        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on("error", (error) => {
                throw error.message;
            })
            .on("data", async (row) => {
                const animal = await Animal.findOne({ cattleId: row.cattleId, ownerId: _id });
                if (animal === null) {
                    const { error } = await validateAnimal(row);
                    if (error) {
                        console.log('validation error: ', error);
                    }
                    else {
                        if (count >= bankInfo.limit) {
                            return res.status(200).end({
                                error: true,
                                message: 'You have exceeded your cattle limit for this package'
                            })
                        }
                        Animal.create({
                            ownerId: _id,
                            ...row
                        })
                        count = count + 1;
                        // csvData.push(row);
                    }
                }
            })
            .on("end", async () => {
                res
                    .status(200)
                    .send({
                        error: false,
                        data: {},
                        message: "Animals uploaded successfully",
                    });
                //     let dataToInsert = csvData.map((data) => ({ ownerId: _id, ...data }));
                //     console.log('dataToInsert: ', dataToInsert)
                //     const bulkAnimals = await Animal.insertMany(dataToInsert);
            });

    } catch (e) {
        console.log('error', e);
        res.status(500).send({ error: true, message: e.message, data: {} });
    }
};

module.exports.createAnimals = async (req, res) => {
    console.log("in create Animal api");
    const url = req.protocol + "://" + req.get("host");
    let fileUrl =
        url + req.file.path.replace(/\\/g, "/").substring("public".length);
    const {
        body,
        user: { _id, email },
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
        },
    } = req;

    const { error } = validateAnimal(body);
    if (error)
        return res
            .status(400)
            .send({ error: true, message: error.details[0].message });
    try {

        const bankInfo = await Bank.findOne({ receiptEmail: email });

        const animalCount = await Animal.count({
            $and: [
                { isDeleted: false },
                { ownerId: _id },
            ]
        });

        if (animalCount >= bankInfo.limit) {
            return res.status(200).send({
                error: true,
                message: 'You have exceeded your cattle limit for this package'
            })
        }

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
            picture: fileUrl,
        });

        console.log("New Animal: ", animal);

        await addOwnerToCattle(_id, animal._id);

        res.status(201).send({
            data: {},
            error: false,
            message: "Animal added successfully",
        });
    } catch (e) {
        console.log(`Error obj ${e}`);
        if (e.code === 11000 && e.name === "MongoError") {
            res.status(200).send({
                error: true,
                message: "CattleId already exist",
                data: {},
            });
        } else {
            res.status(500).send({
                error: true,
                message: e.mesasge,
                data: {},
            });
        }
    }
};



module.exports.getAllUserDailyAnimalsFeed = async (req, res) => {
    console.log("in get All User Animal Yield data api");

    const {
        user: { _id },
    } = req;
    try {
        const yields = await DailyYield.find({
            isDeleted: false,
            ownerId: _id
        }).populate('cattleId');

        console.log("Yields: ", yields);

        res.status(200).send({
            data: { yields },
            error: false,
            message: "Daily yield of animals fetched successfully",
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send({
            error: true,
            message: e.mesasge,
            data: {}
        });
    }
};


module.exports.addDailyAnimalYield = async (req, res) => {
    console.log("in create Daily Animal Yield api");
    const url = req.protocol + "://" + req.get("host");
    const {
        body,
        user: { _id },
        body: {
            yieldType,
            price,
            quantity
        },
    } = req;

    const { error } = validateDailyYield(body);
    if (error)
        return res
            .status(400)
            .send({ error: true, message: error.details[0].message });
    try {

        const yields = await DailyYield.create({
            ownerId: _id,
            yieldType,
            price,
            quantity
        });

        console.log("Animal Yield: ", yields);

        res.status(201).send({
            data: {},
            error: false,
            message: "Animal daily yield added successfully",
        });
    } catch (e) {
        console.log('error: ', e.message);
        res.status(500).send({
            error: true,
            message: e.mesasge,
            data: {},
        });
    };
}

module.exports.deleteAnimal = async (req, res) => {
    console.log("in delete Animal api");

    const {
        params: { cattleId },
    } = req;

    console.log(cattleId);

    try {
        const animal = await Animal.updateOne(
            { _id: cattleId },
            { isDeleted: true },
            { new: true, upsert: false }
        );

        console.log("New Animal: ", animal);

        res.status(200).send({
            data: {},
            error: false,
            message: "Animal Deleted successfully",
        });
    } catch (e) {
        res.status(500).send({
            error: true,
            message: e.mesasge,
            data: {},
        });
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
        },
    } = req;

    var picture = body?.picture;
    if (file) {
        const url = req.protocol + "://" + req.get("host");
        picture =
            url + req.file.path.replace(/\\/g, "/").substring("public".length);
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
        childCount,
    };

    const { error } = validateAnimal(data);
    if (error)
        return res
            .status(400)
            .send({ error: true, message: error.details[0].message });
    try {
        const animal = await Animal.updateOne(
            {
                _id: id,
            },
            {
                cattleId,
                weight,
                age,
                price,
                sex,
                cattleType,
                breedType,
                anticipationDate,
                childCount,
                picture,
            },
            { new: true, upsert: true }
        );

        console.log("New Animal: ", animal);

        res.status(200).send({
            data: {},
            error: false,
            message: "Animal updated successfully",
        });
    } catch (e) {
        res.status(500).send({
            error: true,
            message: e.mesasge,
            data: {},
        });
    }
};
