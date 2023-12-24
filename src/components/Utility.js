export function toSentenceCase(inputString) {
	if (inputString) {
		return inputString
			.split(". ")
			.map(
				(sentence) =>
					sentence.charAt(0).toUpperCase() + sentence.slice(1)
			)
			.join(". ");
	}
	return "";
}
