const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    try {
        secrets = require("./secrets");
    } catch (err) {
        secrets = process.env;
    }
}

const s3 = new S3Client({
    region: "us-east-1",
    credentials:
        secrets.AWS_KEY && secrets.AWS_SECRET
            ? {
                  accessKeyId: secrets.AWS_KEY,
                  secretAccessKey: secrets.AWS_SECRET,
              }
            : undefined,
});

exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("s3.js: req.file isn't there");
        return res.sendStatus(500);
    }

    const { filename, mimetype, size, path } = req.file;

    s3.send(
        new PutObjectCommand({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
    )
        .then(() => {
            console.log("s3.js: amazon put object complete, everything worked");
            next();
            fs.unlink(path, () => {});
        })
        .catch((err) => {
            console.log("CATCH in s3.js in upload put object in s3.js:", err);
            res.sendStatus(500);
        });
};
