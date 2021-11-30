[1mdiff --git a/api/controllers/health.controller.js b/api/controllers/health.controller.js[m
[1mindex 205efaf..06823f5 100644[m
[1m--- a/api/controllers/health.controller.js[m
[1m+++ b/api/controllers/health.controller.js[m
[36m@@ -134,7 +134,6 @@[m [mmodule.exports.updateAnimalMedicalRecord = async (req, res) => {[m
         body,[m
         params: { id },[m
         body: {[m
[31m-            cattleId,[m
             vaccinationType,[m
             vaccinationDate,[m
             vaccinationPeriod,[m
[36m@@ -144,17 +143,11 @@[m [mmodule.exports.updateAnimalMedicalRecord = async (req, res) => {[m
         }[m
     } = req;[m
 [m
[31m-    const { error } = validateAnimal(body);[m
[31m-    if (error)[m
[31m-        return res[m
[31m-            .status(400)[m
[31m-            .send({ error: true, message: error.details[0].message });[m
     try {[m
 [m
         await Health.updateOne({[m
             _id: id,[m
         }, {[m
[31m-            cattleId,[m
             vaccinationType,[m
             vaccinationDate,[m
             vaccinationPeriod,[m
[1mdiff --git a/api/middleware/uploadAttachment.middleware.js b/api/middleware/uploadAttachment.middleware.js[m
[1mindex f7fdaee..7745697 100644[m
[1m--- a/api/middleware/uploadAttachment.middleware.js[m
[1m+++ b/api/middleware/uploadAttachment.middleware.js[m
[36m@@ -18,7 +18,8 @@[m [mlet upload = () => {[m
 [m
 module.exports.send = (req, res, next) => {[m
     if (req?.body?.picture) {[m
[31m-        return next();[m
[32m+[m[32m        next();[m
[32m+[m[32m        return;[m
     }[m
     return upload().single('picture')(req, res, () => {[m
         if (!req.file) return res.json({ error: 'invalid file type' });[m
