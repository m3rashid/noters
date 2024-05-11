import { useQuery } from '@tanstack/react-query'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

import { Note } from '../types'
import Loader from './lib/loader'
import NoteCard from './noteCard'
import apiClient from '../api/client'
import { useNotes } from '../hooks/note'

function ShowNotes() {
	const { status } = useNotes()

	const { data, isLoading, refetch } = useQuery({
		queryKey: ['getNotes'],
		queryFn: () => apiClient('/notes', { method: 'GET' }),
	})

	const notes = (data?.notes || []).filter(
		(note: Note) => status === 'all' || note.status === status,
	)

	return (
		<ResponsiveMasonry columnsCountBreakPoints={{ 300: 1, 650: 2 }}>
			{isLoading ? (
				<Loader />
			) : (
				<Masonry gutter="1rem" className="mt-4">
					{notes.map((note: Note) => (
						<NoteCard key={note.id} {...{ note, refetch }} />
					))}
				</Masonry>
			)}
		</ResponsiveMasonry>
	)
}

export default ShowNotes
