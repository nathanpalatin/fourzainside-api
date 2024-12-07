export function createSlug(title: string) {
	return title
		.toLocaleLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/\s+/g, '-')
}

export function generateCode() {
	return Math.floor(1000 + Math.random() * 9000)
}

export function isValidCPF(cpf: string): boolean {
	cpf = cpf.replace(/[^\d]+/g, '')

	if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
		return false
	}

	let sum = 0
	for (let i = 0; i < 9; i++) {
		sum += parseInt(cpf[i]) * (10 - i)
	}
	let firstDigit = 11 - (sum % 11)
	if (firstDigit >= 10) firstDigit = 0

	sum = 0
	for (let i = 0; i < 10; i++) {
		sum += parseInt(cpf[i]) * (11 - i)
	}
	let secondDigit = 11 - (sum % 11)
	if (secondDigit >= 10) secondDigit = 0

	return firstDigit === parseInt(cpf[9]) && secondDigit === parseInt(cpf[10])
}
