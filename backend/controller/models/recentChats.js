const mongoose = require("mongoose");
const schema = mongoose.Schema;

const recentChatsSchema = new schema(
	{
		receiverId: {
			type: String,
			required: true,
		},
		senderId: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const RecentChats = mongoose.model("RecentChats", recentChatsSchema);
module.exports = RecentChats;
