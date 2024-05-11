import { Note } from '../types'

function NoteCard(note: Note) {
	return (
		<div className="rounded-lg border-b border-gray-200 bg-white px-3 py-2 shadow-md">
			<h2 className="text-lg font-bold">{note.title}</h2>
			<p>{note.body}</p>
			<p className="mt-6 text-sm text-gray-700">{new Date(note.createdAt).toUTCString()}</p>
		</div>
	)
}

export default NoteCard
