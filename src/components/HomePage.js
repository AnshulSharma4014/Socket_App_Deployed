// ChatList.js
import React from "react";
import { useState, useRef, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { FaPaperPlane, FaArrowLeft } from "react-icons/fa";
import ChatBubble from "./ChatBubble";
import NewChat from "./NewChat";

const HomePage = (props) => {
	const [chatWithUser, setChatWithUser] = useState(false);
	const [chatMessage, setChatMessage] = useState("");
	const [showNewChatModal, setShowNewChatModal] = useState(false);

	const recentlyChattedUsers = [
		{ receiveId: "Tejaswini", name: "User 1" },
		{ receiveId: "Sushma", name: "User 2" },
		{ receiveId: "Giri", name: "User 3" },
		{ receiveId: "Govardhan", name: "User 4" },
		{ receiveId: "Anshul", name: "User 5" },
		// Add more user data as needed
	];

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

	const handleFormSubmit = (evt) => {
		evt.preventDeault();
		sendMessage();
		scrollToBottom();
	};

	const sendMessage = () => {
		props.onSendMessage(chatMessage);
		clearInput();
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

	return (
		<div>
			{chatWithUser ? (
				<>
					<Form onSubmit={handleFormSubmit}>
						<Form.Group controlId="chats" key="random">
							<div
								ref={chatContainerRef}
								style={{
									overflowY: "auto",
									maxHeight: "95vh", // Adjust the max height as needed
									position: "relative",
								}}
							>
								<span
									style={{
										position: "sticky", // Make the span sticky
										top: 0,
										backgroundColor: "#f0f0f0", // Match the container background color
										padding: "10px", // Add padding as needed
										display: "flex",
										alignItems: "center",
										zIndex: 1, // Ensure the span stays above the scrolling content
									}}
								>
									<FaArrowLeft
										onClick={handleBack}
										style={{
											cursor: "pointer",
											marginRight: "25px",
										}}
									/>
									Hi {props.senderId}, you are currently
									chatting with {props.receiverId}!
								</span>
								<br />
								<br />
								{props.chats && props.chats.length > 0
									? props.chats.map((item) => {
											return (
												<div key={item.id}>
													<ChatBubble
														message={item.msg}
														sender={item.sender}
														createdDate={
															item.createdDate
														}
														senderEmail={
															props.senderId
														}
													/>
												</div>
											);
									  })
									: ""}
								<br />
								<br />

								<span
									style={{
										position: "sticky",
										bottom: 0,
										backgroundColor: "#f0f0f0",
										padding: "10px",
										display: "flex",
										alignItems: "center",
										zIndex: 1,
										width: "90%",
									}}
								>
									<Form.Label>
										Message {props.receiverId}&nbsp;&nbsp;
									</Form.Label>
									<Form.Control
										type="text"
										placeholder="Type your message here..."
										name="message"
										onChange={(evt) =>
											setChatMessage(evt.target.value)
										}
										style={{
											borderRadius: "20px",
											border: "2px solid #ccc",
											padding: "10px",
											outline: "none",
											width: "70%",
										}}
										value={chatMessage || ""}
									/>
									<Button
										variant="primary"
										style={{
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
						<h2>Recently Chatted Users</h2>
						<ul>
							{recentlyChattedUsers.map((user) => (
								<li
									key={user.receiveId}
									data-name={user.receiveId}
									onClick={handleChatClick}
									style={{
										cursor: "pointer",
									}}
								>
									{user.receiveId}
								</li>
							))}
						</ul>

						{/* New Chat Button */}
						<button
							style={{
								position: "absolute",
								bottom: "20px",
								right: "20px",
								padding: "10px",
								fontSize: "16px",
							}}
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
