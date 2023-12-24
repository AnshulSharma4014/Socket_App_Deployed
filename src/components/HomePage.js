// ChatList.js
import React from "react";
import { useState, useRef, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { FaPaperPlane, FaArrowLeft } from "react-icons/fa";
import ChatBubble from "./ChatBubble";
import NewChat from "./NewChat";
import { toSentenceCase } from "./Utility";
import axios from "axios";
import "../App.css";

const HomePage = (props) => {
	const [chatWithUser, setChatWithUser] = useState(false);
	const [chatMessage, setChatMessage] = useState("");
	const [showNewChatModal, setShowNewChatModal] = useState(false);
	const [placeHolderMessage, setPlaceHolderMessage] = useState("Message");
	const [recentlyChattedUsers, setRecentlyChattedUsers] = useState([]);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);

	const handleEmojiSelect = (emoji) => {
		setChatMessage((prevMessage) => prevMessage + emoji);
	};

	useEffect(() => {
		const requestObj = {
			senderId: props.senderId?.toLowerCase(),
		};

		setPlaceHolderMessage("Message " + toSentenceCase(props.receiverId));
		axios
			.post(
				`http://localhost:6001/chat/fetchRecentlyTextedUsers`,
				requestObj
			)
			.then((resp) => {
				console.log(resp);
				setRecentlyChattedUsers(resp.data);
			})
			.catch((err) => console.error(err));
	}, [props]);

	const chatContainerRef = useRef(null);

	useEffect(() => {
		// Scroll to the bottom when component mounts or when new content is added
		scrollToBottom();
	}, [props.chats]);

	const scrollToBottom = () => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	};

	const sendMessage = () => {
		if (chatMessage) {
			props.onSendMessage(chatMessage);
			clearInput();
		}
	};

	const handleChatClick = (event) => {
		const clickedName = event.currentTarget.dataset.name;
		handleSendJoinRequest(clickedName);
	};

	const handleSendJoinRequest = (data) => {
		setChatWithUser(data);
		props.onSetReceiverId(data);
		props.onfetchChatData();
	};

	function handleNewChatButtonClick() {
		setShowNewChatModal(true);
	}

	function handleRequestClose() {
		setShowNewChatModal(false);
		props.onfetchChatData();
	}

	const handleBack = () => {
		setChatWithUser(false);
		props.onClearChats();
	};

	const clearInput = () => {
		setChatMessage("");
	};

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			if (event.target.value) {
				setChatMessage(event.target.value);
				sendMessage();
				scrollToBottom();
			}
		}
	};

	return (
		<div>
			{chatWithUser ? (
				<>
					<Form>
						<Form.Group controlId="chats" key="random">
							<div
								ref={chatContainerRef}
								style={{
									overflowY: "auto",
									maxHeight: "95vh",
									position: "relative",
								}}
							>
								<span
									style={{
										position: "sticky",
										top: 0,
										padding: "10px",
										display: "flex",
										alignItems: "center",
										zIndex: 1,
										backdropFilter: "blur(10px)",
									}}
								>
									<FaArrowLeft
										onClick={handleBack}
										style={{
											cursor: "pointer",
											marginRight: "25px",
										}}
									/>
									Hi {toSentenceCase(props.senderId)}, you are
									currently chatting with{" "}
									{toSentenceCase(props.receiverId)}
								</span>
								<br />
								<br />
								{props.chats && props.chats.length > 0
									? props.chats.map((item) => (
											<div key={item.id}>
												<ChatBubble
													message={item.msg}
													sender={item.sender}
													createdDate={
														item.createdDate
													}
													senderEmail={props.senderId}
												/>
											</div>
									  ))
									: ""}
								<br />
								<br />

								<span
									style={{
										position: "sticky",
										bottom: 0,
										padding: "10px",
										display: "flex",
										alignItems: "center",
										zIndex: 1,
										backdropFilter: "blur(10px)",
									}}
								>
									<Form.Label>&nbsp;&nbsp;</Form.Label>
									<Form.Control
										type="text"
										placeholder={placeHolderMessage}
										name="message"
										onChange={(evt) => {
											if (evt.target.value) {
												setChatMessage(
													evt.target.value
												);
											}
										}}
										onKeyDown={handleKeyPress}
										style={{
											borderRadius: "20px",
											border: "2px solid #ccc",
											padding: "10px",
											outline: "none",
											width: "95vw",
										}}
										value={chatMessage || ""}
									/>

									<Button
										variant="primary"
										style={{
											position: "absolute",
											top: "10px",
											right: "10px",
											cursor: "pointer",
											border: "none",
											background: "transparent",
											fontSize: "16px",
											borderRadius: "20px",
											padding: "10px 20px",
											display: "inline-block",
											marginLeft: "10px",
											maxHeight: "40px",
										}}
										onClick={sendMessage}
									>
										<FaPaperPlane />
									</Button>
								</span>
							</div>
						</Form.Group>
					</Form>
				</>
			) : (
				<>
					<div
						style={{
							position: "relative",
							padding: "20px",
							minHeight: "200px",
						}}
					>
						<h2>Recent Chats</h2>
						<div>
							{recentlyChattedUsers.map((user) => (
								<div
									key={user._id}
									data-name={user.receiverId}
									onClick={handleChatClick}
									className="Recent-Chat-Style"
								>
									{toSentenceCase(user.receiverId)}
									<br />
								</div>
							))}
						</div>

						{/* New Chat Button */}
						<button
							className="New-Chat-Button"
							onClick={handleNewChatButtonClick}
						>
							New Chat
						</button>
					</div>
				</>
			)}

			{showNewChatModal ? (
				<>
					<NewChat
						senderId={props.senderId}
						onSendJoinRequest={handleSendJoinRequest}
						onRequestClose={handleRequestClose}
						isOpen={showNewChatModal}
					></NewChat>
				</>
			) : (
				<></>
			)}
		</div>
	);
};

export default HomePage;
