import { useState } from "react";
import Modal from "react-modal";
import { FaComments } from "react-icons/fa";
import { toSentenceCase } from "./Utility";
import "../App.css";

Modal.setAppElement("#root");

const NewChat = (props) => {
	const [receiverId, setReceiverId] = useState("");
	const modalStyle = {
		content: {
			height: "40vh",
			width: "40vw",
			margin: "auto", // Center the modal
			top: "40%", // Center vertically
			left: "50%", // Center horizontally
			transform: "translate(-50%, -50%)", // Center the modal exactly
			borderRadius: "10px", // Optional: Add border-radius for rounded corners
			padding: "20px", // Optional: Add padding for content
		},
	};

	const contentStyle = {
		marginLeft: "12%",
	};

	function connectToTheChatRoom() {
		if (props.senderId && receiverId) {
			props.onSendJoinRequest(receiverId);
			props.onRequestClose();
		}
	}

	return (
		<>
			<Modal
				isOpen={props.isOpen}
				onRequestClose={props.onRequestClose}
				contentLabel="Chat Modal"
				style={modalStyle}
			>
				<div style={contentStyle}>
					<h2>Start a Chat</h2>
					<label>
						Enter Username:
						<br />
						<br />
						<input
							type="text"
							value={receiverId}
							onChange={(e) => setReceiverId(e.target.value)}
							className="New-Chat-Input"
						/>
					</label>
					<br />
					<br />
					<button
						className="New-Chat-User-Select-Button"
						onClick={connectToTheChatRoom}
					>
						<FaComments style={{ marginRight: "8px" }} />
						Start Chatting{" "}
						{receiverId ? "with " + toSentenceCase(receiverId) : ""}
					</button>
				</div>

				<button
					style={{
						position: "absolute",
						top: "10px",
						right: "10px",
						cursor: "pointer",
						border: "none",
						background: "transparent",
						fontSize: "16px",
					}}
					onClick={props.onRequestClose}
				>
					&#10006;
				</button>
			</Modal>
		</>
	);
};

export default NewChat;
