import { env } from '../env'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: env.GMAIL_USER,
		pass: env.GMAIL_APP_PASS
	}
})

export async function sendMail(to: string, subject: string, text: string) {
	await transporter.sendMail({
		from: `"Vance" <noreply@thevance.co>`,
		to,
		subject,
		text,
		html: `<p>${text}</p>`
	})
}
