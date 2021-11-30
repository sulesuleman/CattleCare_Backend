const { Health, validateHealth, addAnimalToHealth } = require("../data/health.model");


module.exports.getAllAnimalMedicalHistory = async (req, res) => {
    console.log("in get All Animal Medical Record api");

    const { user: { _id, email, name, role } } = req;

    try {
        const medicalRecord = await Health.find({ isDeleted: false });
        res
            .status(200)
            .send({
                data: { medicalRecord },
                error: false,
                message: "All medical history fetched successfully",
            });
    } catch (e) {
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }

}

module.exports.getMedicalHistoryOfAnimal = async (req, res) => {
    console.log("in get Medical Record  of specific animal api");

    const {
        params: { cattleId }
    } = req;

    try {
        const record = await Health.find({ isDeleted: false, cattleId: cattleId });
        res
            .status(200)
            .send({
                data: { record },
                error: false,
                message: "Medical record fetched successfully",
            });
    } catch (e) {
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }

}


module.exports.createAnimalMedicalRecord = async (req, res) => {
    console.log("In create Animal Medical Reecord api");
    const {
        body,
        user: { _id, name, role, email },
        body: {
            cattleId,
            vaccinationType,
            vaccinationDate,
            vaccinationPeriod,
            diseaseDate,
            diseaseType,
            recoveryStatus,
        }
    } = req;

    const { error } = validateHealth(body);
    if (error)
        return res
            .status(400)
            .send({ error: true, message: error.details[0].message });
    try {

        const medicalRecord = await Health.create({
            cattleId,
            vaccinationType,
            vaccinationDate,
            vaccinationPeriod,
            diseaseDate,
            diseaseType,
            recoveryStatus,
        })

        await addAnimalToHealth(cattleId, medicalRecord._id);

        res
            .status(201)
            .send({
                data: {},
                error: false,
                message: "Medical record added successfully",
            });
    } catch (e) {
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }
};


module.exports.deleteAnimalMedicalRecord = async (req, res) => {
    console.log("In delete Animal Medical Record Api");

    const {
        params: { healthId }
    } = req;

    try {
        const animal = await Health.updateOne(
            { _id: healthId },
            { isDeleted: true },
            { new: true, upsert: false })


        res
            .status(200)
            .send({
                data: {},
                error: false,
                message: "Health Record Deleted successfully",
            });

    } catch (e) {
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }
};

module.exports.updateAnimalMedicalRecord = async (req, res) => {
    console.log("in update Animal Medical Record Api");

    const {
        body,
        params: { id },
        body: {
            vaccinationType,
            vaccinationDate,
            vaccinationPeriod,
            diseaseDate,
            diseaseType,
            recoveryStatus
        }
    } = req;

    try {

        await Health.updateOne({
            _id: id,
        }, {
            vaccinationType,
            vaccinationDate,
            vaccinationPeriod,
            diseaseDate,
            diseaseType,
            recoveryStatus,
        }, { new: true, upsert: true });

        res
            .status(200)
            .send({
                data: {},
                error: false,
                message: "Medical record updated successfully",
            });
    } catch (e) {
        res.status(500).send({
            error: true, message: e.mesasge, data: {}
        })
    }
};