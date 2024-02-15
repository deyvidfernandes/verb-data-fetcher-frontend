// biome-ignore lint/suspicious/noExplicitAny: This function must accept any input type
export function isRequired(value: any) {
	let error
	if (!value) {
		error = 'This field is required'
	}
	return error
}

export function validateOutputMethods(value: { persistData: true; outputJson: false }) {
	let error
	if (!value.outputJson && !value.persistData) {
		error = 'Select at least one option'
	}
	return error
}
