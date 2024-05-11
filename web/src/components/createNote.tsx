import { useState } from 'react'

import Button from './lib/button'
import CreateNoteForm from './createNoteForm'

function CreateNote(props: { onSuccess: () => void }) {
	const [open, setOpen] = useState(false)

	return (
		<div>
			<Button size="small" onClick={() => setOpen(true)}>
				Create Note
			</Button>

			<CreateNoteForm {...{ open, setOpen, onSuccess: props.onSuccess }} />
		</div>
	)
}

export default CreateNote
