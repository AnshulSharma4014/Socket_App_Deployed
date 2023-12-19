const mongoose = require("mongoose");
const schema = mongoose.Schema;

const chatSchema = new schema(
	{
		receiverId: {
			type: String,
			required: true,
		},
		senderId: {
			type: String,
			required: true,
		},
		message: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

const Chats = mongoose.model("Chats", chatSchema);
module.exports = Chats;
