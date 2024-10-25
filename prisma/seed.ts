import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function seed() {
	await prisma.users.create({
		data: {
			name: faker.person.fullName(),
			username: faker.person.fullName().toLocaleLowerCase().replace(' ', ''),
			email: faker.internet.email().toLocaleLowerCase(),
			avatar: faker.image.avatarGitHub(),
			phone: faker.phone.number({ style: 'international' }),
			cpf:
				faker.string.numeric(9).padStart(9, '0') +
				'-' +
				faker.string.numeric(2),
			birthdate: faker.date.anytime().toISOString(),
			password: await hash('123456', 1)
		}
	})
}

seed().then(() => {
	console.log('Database seeded!')
})
