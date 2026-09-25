const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress,subject,body) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}</h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "This is the data",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};


const run = async (subject,body) => {
  const sendEmailCommand = createSendEmailCommand(
    "shivamtej123456789@gmail.com",   // ✅ verified receiver
    "techshivamtej@gmail.com",  // ✅ verified sender
    subject,
    body     // ✅ verified sender
  );

  try {
    const result = await sesClient.send(sendEmailCommand);
    //console.log("✅ Email sent successfully:", result);
    return result;
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw err;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };