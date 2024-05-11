export type User = {
	id: number
	name: string
	email: string
	createdAt: string
}

export type Note = {
	id: number
	title: string
	body: string
	status: 'todo' | 'in_progress' | 'done'
	createdAt: string
}
