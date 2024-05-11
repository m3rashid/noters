import { useQuery } from '@tanstack/react-query'

import { Note } from '../types'
import Loader from './lib/loader'
import apiClient from '../api/client'
import { useNotes } from '../hooks/note'

function ShowNotes() {
	const { status } = useNotes()

	const { data, isLoading } = useQuery({
		queryKey: ['getNotes'],
		queryFn: () => apiClient('/notes', { method: 'GET' }),
	})

	const notes = (data?.notes || []).filter(
		(note: Note) => status === 'all' || note.status === status,
	)

	return (
		<>
			<div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2">
				{isLoading ? (
					<Loader />
				) : (
					notes.map((note: Note) => (
						<div
							key={note.id}
							className="rounded-lg border-b border-gray-200 bg-white px-3 py-2 shadow-md"
						>
							<h2 className="text-lg font-bold">{note.title}</h2>
							<p>{note.body}</p>
							<p className="mt-6 text-sm text-gray-700">{new Date(note.createdAt).toUTCString()}</p>
						</div>
					))
				)}
			</div>
		</>
	)
}

export default ShowNotes
