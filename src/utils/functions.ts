import { env } from '../env'

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
