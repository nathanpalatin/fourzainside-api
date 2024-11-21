import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function seed() {
	await prisma.users.create({
		data: {
			name: 'Nathan Palatin',
			username: 'nathanpalatin',
			email: 'nath.palatin@gmail.com',
			avatar: 'nathan.jpg',
			emailVerified: true,
			phone: '+5547999999999',
			cpf: '999.999.999-99',
			birthdate: '1993-06-14',
			password: await hash('123456', 1)
		}
	})

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

	const mentor = await prisma.users.create({
		data: {
			name: 'Maia Giacomelli',
			username: 'maia_giacomelli',
			email: 'maia_giacomelli@hotmail.com',
			avatar: 'maia.jpg',
			emailVerified: true,
			phone: '+5547999999991',
			cpf: '999.999.999-91',
			birthdate: '1995-02-20',
			password: await hash('123456', 1)
		}
	})

	const course = await prisma.courses.create({
		data: {
			title: 'Performa',
			type: 'Saúde',
			userId: mentor.id,
			description: faker.lorem.words(200),
			slug: 'performa',
			image: faker.image.urlPicsumPhotos()
		}
	})

	await prisma.lessons.create({
		data: {
			title: 'Piloto',
			duration: 120,
			video: 'https://www.youtube.com/watch?v=M11PBJbFApw',
			courseId: course.id,
			description: faker.lorem.sentence(200),
			slug: 'piloto'
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
