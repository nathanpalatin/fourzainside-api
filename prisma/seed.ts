import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function seed() {
	await prisma.user.create({
		data: {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			avatar: faker.image.avatarGitHub(),
			phone: '+551234567890',
			password: await hash('123456', 6)
		}
	})

	await prisma.wallet.create({
		data: {
			userId: 1,
			balance: 0
		}
	})
}

seed().then(() => {
	console.log('Database seeded!')
})
