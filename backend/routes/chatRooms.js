const express = require("express");
const cors = require("cors");
const chatModal = require("../controller/models/chats");
const recentChatModal = require("../controller/models/recentChats");

const router = express.Router();
const baseUrl = process.env.BASE_URL;
const baseUrlLocal = process.env.BASE_URL_LOCAL;

const corsOptions = {
	origin: [baseUrl, baseUrlLocal], // Replace with your React app's URL
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
		const senderId = req.body.senderId;
		const receiverId = req.body.receiverId;

		const chats = await chatModal
			.find({
				$or: [
					{
						senderId: senderId,
						receiverId: receiverId,
					},
					{
						senderId: receiverId,
						receiverId: senderId,
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

// Save Recent Chat Users
router.post("/saveRecentlyTextedUsers", cors(corsOptions), async (req, res) => {
	try {
		const chat = new recentChatModal(req.body);
		const existingChat = await recentChatModal.findOne({
			senderId: req.body.senderId,
			receiverId: req.body.receiverId,
		});

		if (!existingChat) {
			await chat.save();
			res.status(201).json(chat);
		} else {
			res.status(200);
		}
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.post(
	"/fetchRecentlyTextedUsers",
	cors(corsOptions),
	async (req, res) => {
		try {
			const recentChats = await recentChatModal
				.find({ senderId: req.body.senderId })
				.sort({ createdDate: "desc" }) // 'asc' for ascending, 'desc' for descending
				.exec();

			res.json(recentChats);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}
);

module.exports = router;
