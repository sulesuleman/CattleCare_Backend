const { Health, validateHealth, addAnimalToHealth } = require("../data/health.model");


module.exports.getAnimalMedicalHistory = async (req, res) => {
    console.log("in get All Animal Medical Record api");

    const { user: { _id, email, name, role } } = req;

    try {
        const medicalRecord = await Health.find({ isDeleted: false });

        res
            .status(200)
            .send({
                data: { medicalRecord },
                error: false,
                message: "Animals fetched successfully",
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

// module.exports.deleteAnimal = async (req, res) => {
//     console.log("in delete Animal api");

//     const {
//         params: { cattleId }
//     } = req;

//     console.log(cattleId);

//     try {
//         const animal = await Animal.updateOne(
//             { _id: cattleId },
//             { isDeleted: true },
//             { new: true, upsert: false })

//         console.log('New Animal: ', animal);

//         res
//             .status(200)
//             .send({
//                 data: {},
//                 error: false,
//                 message: "Animal Deleted successfully",
//             });
//     } catch (e) {
//         res.status(500).send({
//             error: true, message: e.mesasge, data: {}
//         })
//     }
// };

// module.exports.updateAnimal = async (req, res) => {
//     console.log("in update Animal api");

//     const {
//         body,
//         params: { id },
//         body: {
//             picture,
//             cattleId,
//             weight,
//             age,
//             price,
//             sex,
//             cattleType,
//             cattlBereed,
//             anticipationDate,
//             childCount,
//         }
//     } = req;

//     const { error } = validateAnimal(body);
//     if (error)
//         return res
//             .status(400)
//             .send({ error: true, message: error.details[0].message });
//     try {

//         const animal = await Animal.updateOne({
//             _id: id,
//         }, {
//             cattleId,
//             weight,
//             age,
//             price,
//             sex,
//             cattleType,
//             cattlBereed,
//             anticipationDate,
//             childCount,
//             picture
//         }, { new: true, upsert: true });

//         console.log('New Animal: ', animal);

//         res
//             .status(200)
//             .send({
//                 data: {},
//                 error: false,
//                 message: "Animal updated successfully",
//             });
//     } catch (e) {
//         res.status(500).send({
//             error: true, message: e.mesasge, data: {}
//         })
//     }
// };