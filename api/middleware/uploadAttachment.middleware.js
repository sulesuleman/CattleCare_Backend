var multer = require('multer');
var path = require('path');

let upload = () => {
    return multer({
        fileSize: 4000000,
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/uploads');
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + path.extname(file.originalname));
            },
        }),
    });
};


module.exports.ImgMiddle = (req, res, next) => {
    return upload().single('picture')(req, res, () => {
        if (req?.body?.picture) {
            return next();
        }
        else if (!req.file) return res.json({ error: 'invalid file type' });
        next();
    });
};

module.exports.csvMiddle = (req, res, next) => {
    return upload().single('csvFile')(req, res, () => {
        if (!req.file) return res.json({ error: 'No file uploaded' });
        // if (!req.file.mimetype.includes("csv")) return res.json({ error: 'Please upload only csv file' })
        else next();
    });
};
