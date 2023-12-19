import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { io } from "socket.io-client";
import axios from "axios";
import Cookies from "js-cookie";
import Register from "./Register";
import HomePage from "./HomePage";

class SocketCLientOne extends Component {
	constructor(props) {
		super(props);

		this.state = {
			chatMessage: "",
			senderEmail: "",
			receiverEmail: "",
			chats: [],
		};

		this.socket = io("http://localhost:5001/", {
			withCredentials: true,
			extraHeaders: {
				ConnectWithAnshul: "Sure",
			},
		});

		this.socket.on("already_joined", (msg) => {});

		this.socket.on("joined", (msg) => {
			const requestObj = {
				senderId: this.state.senderEmail,
				receiverId: this.state.receiverEmail,
			};

			axios
				.post("http://localhost:6001/chat/", requestObj)
				.then((response) => {
					console.log(response);
					if (response && response.data && response.data.length > 0) {
						console.log("Setting data, ", response.data);

						const transformedArray = response.data.map((item) => ({
							id: item._id,
							msg: item.message,
							sender: item.senderId,
							receiver: item.receiverId,
							createdDate: new Date(item.createdAt),
							updatedDate: new Date(item.updatedAt),
						}));

						this.setState({ chats: transformedArray });
					}
					console.log(this.state.chats);
				})
				.catch((error) => console.error(error));

			console.log(this.state.chats);
		});

		this.socket.on("new_msg", (message) => {
			let transformedMap = message;
			transformedMap["createdDate"] = new Date(message["createdDate"]);
			transformedMap["updatedDate"] = new Date(message["updatedDate"]);

			this.setState((prevState) => ({
				chats: [...prevState.chats, transformedMap],
			}));
		});

		this.sendMessageToTheSocket = this.sendMessageToTheSocket.bind(this);
		this.clearInputField = this.clearInputField.bind(this);
		this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
		this.sendSocketJoinRequest = this.sendSocketJoinRequest.bind(this);
		this.sendJoinRequest = this.sendJoinRequest.bind(this);
		this.clearChats = this.clearChats.bind(this);
	}

	componentDidMount() {
		this.checkForCookies();
	}

	checkForCookies() {
		const myCookieValue = Cookies.get("anshul-chat-user");

		if (myCookieValue) {
			this.setState({ senderEmail: myCookieValue });
		} else {
			this.setState({ senderEmail: "" });
		}
	}

	clearChats() {
		this.setState({ chats: [] });
	}

	sendJoinRequest() {
		this.socket.emit("join", {
			email: this.state.senderEmail,
			connectId: this.socket.id,
		});
	}

	sendSocketJoinRequest() {
		this.socket.emit("join", {
			email: this.state.senderEmail,
			connectId: this.socket.id,
		});
	}

	sendMessageToTheSocket(chatMessage) {
		this.socket.emit("new_msg", {
			message: chatMessage,
			receiverId: this.state.receiverEmail,
			senderId: this.state.senderEmail,
		});

		const message = {
			msg: chatMessage,
			receiver: this.state.receiverEmail,
			sender: this.state.senderEmail,
			id: this.generateSecureRandomKey(16),
			createdDate: new Date(),
			updatedDate: new Date(),
		};

		this.setState((prevState) => ({
			chats: [...prevState.chats, message],
		}));

		this.clearInputField();

		const messageData = {
			receiverId: this.state.receiverEmail,
			senderId: this.state.senderEmail,
			message: chatMessage,
		};

		axios
			.post("http://localhost:6001/chat/saveChats", messageData)
			.then((resp) => console.log(resp))
			.catch((err) => console.error(err));
	}

	clearInputField() {
		this.setState({ chatMessage: "" });
	}

	generateSecureRandomKey(length = 8) {
		const array = new Uint8Array(length);
		window.crypto.getRandomValues(array);
		return Array.from(array, (byte) => byte.toString(16)).join("");
	}

	handleLoginSuccess(senderUsername) {
		this.setState({ senderEmail: senderUsername }, () => {
			this.sendJoinRequest();
		});
	}

	render() {
		return (
			<div
				style={{
					height: "90vh", // Set the height of the parent container to 100% of the viewport height
				}}
			>
				<Container
					className="d-flex flex-column justify-content-center align-items-center"
					style={{
						margin: "1%",
						backgroundColor: "#f0f0f0",
						paddingLeft: "20px",
						paddingRight: "20px",
						boxShadow: "rgba(0, 0, 0, 0.2) 0px 0px 10px",
						height: "98vh",
						overflowY: "auto",
						position: "relative",
					}}
				>
					{this.state.senderEmail ? (
						<HomePage
							onSendMessage={this.sendMessageToTheSocket}
							onSetReceiverId={(data) =>
								this.setState({ receiverEmail: data })
							}
							onfetchChatData={this.sendSocketJoinRequest}
							onClearChats={this.clearChats}
							senderId={this.state.senderEmail}
							receiverId={this.state.receiverEmail}
							chats={this.state.chats}
						></HomePage>
					) : (
						<Register onLogin={this.handleLoginSuccess}></Register>
					)}
				</Container>
			</div>
		);
	}
}

export default SocketCLientOne;
