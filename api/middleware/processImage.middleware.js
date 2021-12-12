const spawn = require("child_process").spawn;

module.exports.ProcessmiddleWare = async (req, res, next) => {
    const { file } = req;
    console.log('files: ', file)
    let fileName = file.path.replace(/\\/g, "/").substring("public".length);
    fileName = fileName.substring(fileName.lastIndexOf('/'), fileName.length);

    console.log("fileName from node js", fileName);
    const pythonProcess = spawn('python', ["../public/uploads/ocrFyp.py", fileName]);
    pythonProcess.stdout.on('data', (data) => {
        // Do something with the data returned from python script
        console.log('data in Node: ', data);
    });
}