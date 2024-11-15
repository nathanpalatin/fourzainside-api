import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function seed() {
	const user = await prisma.users.create({
		data: {
			name: faker.person.fullName(),
			username: faker.person.fullName().toLocaleLowerCase().replace(' ', ''),
			email: faker.internet.email().toLocaleLowerCase(),
			avatar: faker.image.avatarGitHub(),
			emailVerified: true,
			phone: faker.phone.number({ style: 'international' }),
			cpf:
				faker.string.numeric(9).padStart(9, '0') +
				'-' +
				faker.string.numeric(2),
			birthdate: faker.date.anytime().toISOString(),
			password: await hash('123456', 1)
		}
	})

	const course = await prisma.courses.create({
		data: {
			title: faker.person.fullName(),
			duration: 10,
			type: 'application',
			userId: user.id,
			description: faker.person.fullName().toLocaleLowerCase().replace(' ', ''),
			slug: faker.person.fullName().toLocaleLowerCase().replace(' ', ''),
			image: faker.image.urlPicsumPhotos()
		}
	})

	await prisma.lessons.create({
		data: {
			title: faker.person.fullName(),
			duration: 5,
			video: 'https://www.youtube.com/watch?v=M11PBJbFApw',
			courseId: course.id,
			description: faker.person.fullName().toLocaleLowerCase().replace(' ', ''),
			slug: faker.person.fullName().toLocaleLowerCase().replace(' ', '')
		}
	})

	await prisma.courseEnrollment.create({
		data: {
			userId: user.id,
			courseId: course.id,
			enrolledAt: new Date()
		}
	})
}

seed().then(() => {
	console.log('Database seeded!')
})
