// this is the code for the server to remove all the msges after 24 hrs 

import cron from "node-cron";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const startCleanupJob = () => {
    cron.schedule("0 * * * *", async () => {
        console.log("🕒 Cleanup job running...");
        try {
            const users = await User.find({ isDisappearing: true }).select("_id");
            // const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const cutoffTime = new Date(Date.now() - 10 * 1000);


            for (let user of users) {
                const result = await Message.deleteMany({
                    $and: [
                        { $or: [{ senderId: user._id }, { reciverId: user._id }] },
                        { createdAt: { $lt: cutoffTime } }
                    ]
                });
                if (result.deletedCount > 0) {
                    console.log(`🧹 Deleted ${result.deletedCount} old messages for user ${user._id}`);
                }
            }
        } catch (err) {
            console.error("❌ Cleanup job failed:", err);
        }
    });
};
