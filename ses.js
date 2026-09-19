const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

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

const ses = new SESClient({
    region: "eu-west-1",
    credentials:
        secrets.AWS_KEY && secrets.AWS_SECRET
            ? {
                  accessKeyId: secrets.AWS_KEY,
                  secretAccessKey: secrets.AWS_SECRET,
              }
            : undefined,
});

exports.sendEmail = (to, subject, text) => {
    return ses.send(
        new SendEmailCommand({
            Source: "Admin Kite.Inc. <destiny.tractor@spicedling.email>",
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Subject: {
                    Data: subject,
                },
                Body: {
                    Text: {
                        Data: text,
                    },
                },
            },
        })
    );
};
