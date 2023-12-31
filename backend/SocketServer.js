//+ Importing Socket Modules
const { Server } = require("socket.io");
const http = require("http");

//+ Importing Mongo DB Connectivity Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//+ Mongo DB Variables & Socket Port
const app = express();
const PORT = 5001;
const uri =
	"mongodb+srv://anshulsharma4014:anshul.sharma@chatapplication.ji1li6c.mongodb.net/";

//+ Required for Mongo DB Only
const conrsOptions = {
	origin: "*", // Replace with your React app's URL
	credentials: true, // Enable passing of cookies, if applicable
};
app.use(cors(conrsOptions));
app.use(express.json());
mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
	console.log("Connected to the Database");
});

const chatRouter = require("./routes/chatRooms");
app.use("/chat", chatRouter);

//+ SOCKETS
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://192.168.33.146:3000", "http://localhost:3000"],
		methods: ["GET", "POST"],
		credentials: true,
		allowedHeaders: ["ConnectWithAnshul"],
	},
});
server.listen(PORT, () => {
	console.log(`Socket Server is running on posrt: ${PORT}`);
});

io.on("connection", (socket) => {
	socket.on("join", function (data) {
		if (socket.adapter.rooms[data.email]) {
			socket.emit("already_joined", {
				msg: "Seems like you are already joined from another device. Please use another email.",
			});
		} else {
			socket.join(data.email);
			console.log("Joined!");

			socket.emit("joined");
		}
	});

	socket.on("new_msg", (request) => {
		if (request && request.message && request.receiverId) {
			io.sockets.in(request.receiverId).emit("new_msg", {
				id: generateRandomKey(16),
				msg: request.message,
				sender: request.senderId,
				receiver: request.receiverId,
				createdDate: new Date(),
				updatedDate: new Date(),
			});
		} else {
			io.sockets.in(request.senderId).emit("no_user_messge_sent", {
				msg: "Did not get receiver information. Please try again.",
			});
		}
	});
});

io.engine.on("connection_error", (err) => {
	console.log(err.req); // the request object
	console.log(err.code); // the error code, for example 1
	console.log(err.message); // the error message, for example "Session ID unknown"
	console.log(err.context); // some additional error context
});

app.listen(6001, () => {
	console.log(`Server is running on port 6001`);
});

function generateRandomKey(length = 8) {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters.charAt(randomIndex);
	}

	return result;
}
