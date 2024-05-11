import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'

import { Note } from '../types'
import apiClient from '../api/client'
import CreateNoteForm from './createNoteForm'
import { ShowBody, formatDate } from '../utils/helpers'

function NoteCard({ note, refetch }: { note: Note; refetch: () => void }) {
	const [editNote, setEditNote] = useState<Note | undefined>(undefined)

	const { mutate: handleDelete } = useMutation({
		mutationKey: ['deleteNote'],
		mutationFn: (noteId: number) =>
			apiClient('/notes/delete', {
				method: 'POST',
				body: JSON.stringify({ id: noteId }),
			}),
		onSuccess: refetch,
	})

	return (
		<>
			<CreateNoteForm
				{...{
					note: editNote,
					open: !!editNote,
					onSuccess: refetch,
					setOpen: () => setEditNote(undefined),
				}}
			/>
			<div
				key={note.id}
				className="relative rounded-lg border-b border-gray-200 bg-white px-3 py-2 shadow-md transition duration-300 ease-in-out hover:shadow-lg"
			>
				<div className="absolute right-2 top-2 flex items-center justify-center gap-2">
					<PencilSquareIcon
						onClick={() => setEditNote(note)}
						className="h-4 w-4 cursor-pointer hover:text-primary"
					/>
					<TrashIcon
						onClick={() => handleDelete(note.id)}
						className="h-4 w-4 cursor-pointer hover:text-red-400"
					/>
				</div>
				<h2 className="text-lg font-bold">{note.title}</h2>
				{note.body ? <ShowBody body={note.body} /> : null}
				<p className="mt-6 text-sm text-gray-400">{formatDate(note.createdAt)}</p>
			</div>
		</>
	)
}

export default NoteCard
