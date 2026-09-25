const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
const ConnectionRequestModel = require("../models/connectionRequestSchema");

// helper function to delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

cron.schedule("51 19 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 0);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequest = await ConnectionRequestModel.find({
      status: "intrested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingRequest.map((req) => req.toUserId.emailId)),
    ];

    //console.log("List of Email Ids", listOfEmails);

    for (const email of listOfEmails) {
      try {
        await sendEmail.run(
          "New friend request pending for " + email,
          "There are so many friend requests, please login to Devtinder.com and check them"
        );

        //console.log(`✅ Email sent to ${email}`);

        // throttle: wait ~1.1 sec between sends
        await sleep(1100);
      } catch (error) {
        //console.log("❌ Error sending to", email, error);
      }
    }
  } catch (error) {
    //console.log("Error From the cronJob is", error);
  }
});