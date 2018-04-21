const Storage = require("@google-cloud/storage");
const fs = require('fs');
const CLOUD_BUCKET = "thisisnewbucketlol";
const storage = Storage({  
  projectId: 'prime-pod-200918',
  keyFilename: './keyfile.json'
});
const bucket = storage.bucket(CLOUD_BUCKET);
const express = require('express');
const Multer = require('multer');
const app = express();

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 100 * 1024 * 1024 // 100 MB file
    }
});

app.post('/', multer.any(), function(req, res){

    if (!req.files) {
        res.status(400).send('No file uploaded.');
        return;
    }

    req.files.map(funtime => {
        const blob = bucket.file(`${funtime.originalname}`); // PUT EXTENSION IN FILE NAME FEK
        const blobStream = blob.createWriteStream();
        // const blobStream = blob.createWriteStream({
        //     metadata: {
        //       contentType: req.file.mimetype
        //     }
        // });
        blobStream.on('finish', () => {
            console.log("uploaded a file");
        });
        blobStream.end(funtime.buffer);
    });

    res.status(200).send("uploaded!");


});

app.listen(80, () => {
    console.log(`App listening on port 80`);
    console.log("Press Ctrl+C to quit.");
});
