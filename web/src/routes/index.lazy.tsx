import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'

import apiClient from '../api/client'
import { useAuth } from '../hooks/auth'
import Loader from '../components/lib/loader'
import NoteCard from '../components/noteCard'
import CreateNote from '../components/createNote'

export const Route = createLazyFileRoute('/')({
	component: Index,
})

function Index() {
	const navigate = useNavigate()
	const {
		auth: { isAuthenticated },
	} = useAuth()
	const { data, isLoading, refetch } = useQuery({
		queryKey: ['getNotes'],
		queryFn: () => apiClient('/notes', { method: 'GET' }),
	})

	if (!isAuthenticated) {
		navigate({ to: '/auth' })
		return null
	}

	return (
		<div className="flex h-[calc(100vh-48px)] justify-center overflow-y-auto bg-slate-100 bg-[url(/paper.svg)] p-2">
			<div className="w-full max-w-[800px]">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold">Notes</h1>
					<CreateNote onSuccess={refetch} />
				</div>
				{isLoading ? (
					<Loader />
				) : (
					<div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{data.notes.map((note: any) => (
							<NoteCard key={note.id} {...note} />
						))}
					</div>
				)}
			</div>
		</div>
	)
}
