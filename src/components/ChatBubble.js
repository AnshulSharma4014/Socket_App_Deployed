const ChatBubble = ({ message, sender, createdDate, senderEmail }) => {
	const isMyMessage = sender === senderEmail;
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column", // Stack elements vertically
				alignItems: isMyMessage ? "flex-end" : "flex-start",
			}}
		>
			<div
				style={{
					maxWidth: "70%",
					padding: "10px",
					borderRadius: "10px",
					margin: "10px",
					background: isMyMessage ? "#DCF8C6" : "#FFFFFF",
					alignSelf: isMyMessage ? "flex-end" : "flex-start",
					marginLeft: isMyMessage ? "auto" : "inherit", // Add some space on the left for my messages
					marginRight: isMyMessage ? "inherit" : "auto",
				}}
			>
				{message}
			</div>
			<div
				style={{
					fontSize: "12px",
					color: "#888", // Add your desired color
					marginTop: "5px", // Add space between message and time
				}}
			>
				{formatTime(createdDate)}{" "}
				{/* Replace 'formatTime' with your time formatting function */}
			</div>
		</div>
	);
};

function formatTime(dateValue) {
	if (dateValue) {
		const dayValue = parseInt(dateValue.getDay());
		const monthValue = parseInt(dateValue.getMonth());
		const hourValue = parseInt(dateValue.getHours());
		const minuteValue = parseInt(dateValue.getMinutes());

		return (
			(dayValue < 10 ? `0${dayValue}` : dayValue) +
			"/" +
			(monthValue < 10 ? `0${monthValue}` : monthValue) +
			"/" +
			dateValue.getFullYear() +
			", " +
			(hourValue < 10 ? `0${hourValue}` : hourValue) +
			":" +
			(minuteValue < 10 ? `0${minuteValue}` : minuteValue)
		);
	}
	return "";
}

export default ChatBubble;
