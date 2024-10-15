import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function seed() {
	await prisma.users.create({
		data: {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			avatar: faker.image.avatarGitHub(),
			phone: faker.phone.number(),
			cpf: faker.string.numeric(11),
			birthdate: faker.date.anytime(),
			password: await hash('123456', 1)
		}
	})
}

seed().then(() => {
	console.log('Database seeded!')
})
