import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import apiClient from '../api/client'
import { useQuery } from '@tanstack/react-query'
import Loader from '../components/lib/loader'
import { useAuth } from '../hooks/auth'

export const Route = createLazyFileRoute('/')({
	component: Index,
})

function Index() {
	const navigate = useNavigate()
	const {
		auth: { isAuthenticated },
	} = useAuth()
	const { data, isLoading } = useQuery({
		queryKey: ['getNotes'],
		queryFn: () => apiClient('/notes', { method: 'GET' }),
	})

	if (!isAuthenticated) {
		navigate({ to: '/auth' })
		return null
	}

	return (
		<div className="p-2">
			<h1 className="text-2xl font-bold">Notes</h1>
			{isLoading ? (
				<Loader />
			) : (
				<ul>
					{data.notes.map((note: any) => (
						<li key={note.id} className="border-b border-gray-200 py-2">
							<h2 className="text-lg font-bold">{note.title}</h2>
							<p>{note.body}</p>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
