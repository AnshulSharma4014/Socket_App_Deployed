import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import Cookies from "js-cookie";

const Register = ({ onLogin }) => {
	const [username, setUsername] = useState("");

	const handleFormSubmit = (event) => {
		event.preventDefault();
		handleLogin();
	};

	function handleLogin() {
		Cookies.set("anshul-chat-user", username, { expires: 200 });
		onLogin(username);
	}

	return (
		<Form onSubmit={handleFormSubmit}>
			<Form.Group controlId="chats" key="random">
				<Form.Label>
					<FaUser style={{ marginRight: "8px" }} />
					Name/Username
				</Form.Label>
				<br />
				<br />
				<Form.Control
					type="text"
					placeholder="Type your name/username here"
					name="message"
					onChange={(event) => setUsername(event.target.value)}
					style={{
						borderRadius: "20px",
						border: "2px solid #ccc",
						padding: "10px",
						outline: "none",
						width: "70%",
					}}
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
					onClick={handleLogin}
				>
					LOGIN
				</Button>
			</Form.Group>
		</Form>
	);
};

export default Register;
