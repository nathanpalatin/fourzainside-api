export class StudentAlreadyEnrolledError extends Error {
	constructor() {
		super('Student already enrolled in this course!')
	}
}
