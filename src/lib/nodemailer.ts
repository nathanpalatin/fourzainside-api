import nodemailer from 'nodemailer'
import { env } from '../env'

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: env.GMAIL_USER,
		pass: env.GMAIL_APP_PASS
	}
})

export async function sendMail(to: string, subject: string, text: string) {
	await transporter.sendMail({
		from: `"[Cadastro] - Fourza Inside" <noreply@fourzainside.com>`,
		to,
		subject,
		text,
		html: `<p>${text}</p>`
	})
}
