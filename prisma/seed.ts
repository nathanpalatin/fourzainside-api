import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function seed() {
	await prisma.users.create({
		data: {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			username: faker.internet.displayName(),
			avatar: faker.image.avatarGitHub(),
			phone: '+551234567890',
			password: await hash('123456', 6)
		}
	})
}

seed().then(() => {
	console.log('Database seeded!')
})
