import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'

import apiClient from '../api/client'
import { NotesProvider } from '../hooks/note'
import ShowNotes from '../components/showNotes'
import CreateNote from '../components/createNote'
import ShowFilter from '../components/showFilter'
import { useAuth } from '../hooks/auth'

export const Route = createLazyFileRoute('/')({
	component: Index,
})

function Index() {
	const { auth } = useAuth()
	const navigate = useNavigate({ from: '/' })

	const { refetch } = useQuery({
		queryKey: ['getNotes'],
		queryFn: () => apiClient('/notes', { method: 'GET' }),
		retry: auth.isAuthenticated ? 3 : false,
	})

	return (
		<NotesProvider>
			<div className="flex h-[calc(100vh-48px)] justify-center overflow-y-auto bg-slate-200 bg-[url(/paper.svg)] p-2">
				<div className="mt-4 w-full max-w-[800px]">
					{auth.isAuthenticated ? (
						<>
							<div className="flex items-center justify-between">
								<h1 className="text-2xl font-bold">Notes</h1>

								<div className="flex gap-2">
									<CreateNote onSuccess={refetch} />
									<ShowFilter />
								</div>
							</div>

							<ShowNotes />
						</>
					) : (
						<div className="flex flex-col items-center justify-center gap-2 rounded-lg border-b border-gray-200 bg-white px-3 py-32 shadow-md">
							<h2 className="text-center text-lg font-bold">You are not logged in</h2>
							<div
								className="cursor-pointer text-center text-blue-500"
								onClick={() => navigate({ to: '/auth', search: { type: 'login' } })}
							>
								Login to view your notes
							</div>
						</div>
					)}
				</div>
			</div>
		</NotesProvider>
	)
}
