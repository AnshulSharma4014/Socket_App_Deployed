const mongoose = require("mongoose");
const schema = mongoose.Schema;

const fetchChatSchema = new schema({
	senderId: {
		type: String,
		required: true,
	},
	receiverId: {
		type: String,
		required: true,
	},
});

const FetchChats = mongoose.model("FetchChats", fetchChatSchema);
module.exports = FetchChats;
