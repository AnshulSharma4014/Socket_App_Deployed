const express = require("express");
const cors = require("cors");
const chatModal = require("../models/chats");
const fetchChatModal = require("../models/fetchChats");

const router = express.Router();
const corsOptions = {
	origin: ["http://localhost:3000", "http://192.168.33.146:3000"], // Replace with your React app's URL
};

// Create a new chat
router.post("/saveChats", cors(corsOptions), async (req, res) => {
	try {
		const chat = new chatModal(req.body);
		await chat.save();
		res.status(201).json(chat);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Retrieve all chats
router.post("/", cors(corsOptions), async (req, res) => {
	try {
		const allChats = new fetchChatModal(req.body);
		const chats = await chatModal
			.find({
				$or: [
					{
						senderId: allChats.senderId,
						receiverId: allChats.receiverId,
					},
					{
						senderId: allChats.receiverId,
						receiverId: allChats.senderId,
					},
				],
			})
			.sort({ createdDate: "asc" }) // 'asc' for ascending, 'desc' for descending
			.exec();

		res.json(chats);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
});

// Add other endpoints as needed (update, delete, etc.)

module.exports = router;
