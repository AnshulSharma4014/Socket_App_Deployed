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

		this.socket = io(`http://localhost:5001/`);

		this.socket.on("already_joined", (msg) => {});

		this.socket.on("joined", (msg) => {
			const requestObj = {
				senderId: this.state.senderEmail?.toLowerCase(),
				receiverId: this.state.receiverEmail?.toLowerCase(),
			};

			axios
				.post(`http://localhost:6001/chat/`, requestObj)
				.then((response) => {
					if (response && response.data && response.data.length > 0) {
						const transformedArray = response.data.map((item) => ({
							id: item._id,
							msg: item.message,
							sender: item.senderId?.toLowerCase(),
							receiver: item.receiverId?.toLowerCase(),
							createdDate: new Date(item.createdAt),
							updatedDate: new Date(item.updatedAt),
						}));

						this.setState({ chats: transformedArray });
					}
				})
				.catch((error) => console.error(error));
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
			this.setState({ senderEmail: myCookieValue?.toLowerCase() });
		} else {
			this.setState({ senderEmail: "" });
		}
	}

	clearChats() {
		this.setState({ chats: [] });
	}

	sendJoinRequest() {
		this.socket.emit("join", {
			email: this.state.senderEmail?.toLowerCase(),
			connectId: this.socket.id,
		});
	}

	sendSocketJoinRequest() {
		this.socket.emit("join", {
			email: this.state.senderEmail?.toLowerCase(),
			connectId: this.socket.id,
		});
	}

	sendMessageToTheSocket(chatMessage) {
		this.socket.emit("new_msg", {
			message: chatMessage,
			receiverId: this.state.receiverEmail?.toLowerCase(),
			senderId: this.state.senderEmail?.toLowerCase(),
		});

		const message = {
			msg: chatMessage,
			receiver: this.state.receiverEmail?.toLowerCase(),
			sender: this.state.senderEmail?.toLowerCase(),
			id: this.generateSecureRandomKey(16),
			createdDate: new Date(),
			updatedDate: new Date(),
		};

		this.setState((prevState) => ({
			chats: [...prevState.chats, message],
		}));

		this.clearInputField();

		const messageData = {
			receiverId: this.state.receiverEmail?.toLowerCase(),
			senderId: this.state.senderEmail?.toLowerCase(),
			message: chatMessage,
		};

		axios
			.post(`http://localhost:6001/chat/saveChats`, messageData)
			.then((resp) => console.log(resp))
			.catch((err) => console.error(err));

		axios
			.post(
				"http://localhost:6001/chat/saveRecentlyTextedUsers",
				messageData
			)
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
		this.setState({ senderEmail: senderUsername?.toLowerCase() }, () => {
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
						background: "linear-gradient(45deg, #A9F1DF, #FFBBBB)",
						boxShadow: "rgba(0, 0, 0, 0.2) 0px 0px 10px",
						height: "96vh",
						overflowY: "auto",
						position: "relative",
						borderRadius: "10px",
					}}
				>
					{this.state.senderEmail ? (
						<HomePage
							onSendMessage={this.sendMessageToTheSocket}
							onSetReceiverId={(data) =>
								this.setState({
									receiverEmail: data?.toLowerCase(),
								})
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
