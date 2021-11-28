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


module.exports.send = (req, res, next) => {
    return upload().single('profilePicture')(req, res, () => {
        if (!req.file) return res.json({ error: 'invalid file type' });
        next();
    });
};
