export default function nameValidation(name: string) {
	const regex = /[0-9]/;
	return regex.test(name);
}
