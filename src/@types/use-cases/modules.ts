import type { Modules } from '@prisma/client'

export interface ModuleUseCaseRequest {
	title: string
	description: string
	available: string
	visibility: boolean
	courseId: string
}

export interface ModuleUseCaseResponse {
	module: Modules
}
