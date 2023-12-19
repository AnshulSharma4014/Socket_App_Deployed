import { useState } from "react";
import Modal from "react-modal";
import { FaComments } from "react-icons/fa";

Modal.setAppElement("#root");

const NewChat = (props) => {
	const [receiverId, setReceiverId] = useState("");

	function connectToTheChatRoom() {
		if (props.senderId && receiverId) {
			props.onSendJoinRequest(receiverId);
			props.onRequestClose();
		}
	}

	return (
		<>
			{console.log("Ok, in new chat")}
			<Modal
				isOpen={props.isOpen}
				onRequestClose={props.onRequestClose}
				contentLabel="Chat Modal"
			>
				<h2>Start a Chat</h2>
				<label>
					Enter Username:
					<br />
					<br />
					<input
						type="text"
						value={receiverId}
						onChange={(e) => setReceiverId(e.target.value)}
					/>
				</label>
				<br />
				<br />
				<button onClick={connectToTheChatRoom}>
					<FaComments style={{ marginRight: "8px" }} />
					Chat with {receiverId}
				</button>
			</Modal>
		</>
	);
};

export default NewChat;
