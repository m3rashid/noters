import { useMutation } from '@tanstack/react-query'
import { FormEvent, useState } from 'react'

import Button from './lib/button'
import apiClient from '../api/client'
import TextInput from './lib/textInput'
import TextAreaInput from './lib/textAreaInput'
import SingleSelectInput from './lib/selectInput'
import Modal from './lib/modal'

const statusOptions = [
	{ label: 'To DO', value: 'todo', id: 'todo' },
	{ label: 'In Progress', value: 'in_progress', id: 'in_progress' },
	{ label: 'Done', value: 'done', id: 'done' },
]

function CreateNote(props: { onSuccess: () => void }) {
	const [open, setOpen] = useState(false)

	const {
		isSuccess,
		isPending,
		mutate: createNote,
	} = useMutation({
		mutationKey: ['createNote', 'getNotes'],
		mutationFn: (data: any) =>
			apiClient('/notes/create', {
				method: 'POST',
				body: JSON.stringify(data),
			}),
	})

	const handleCreateNote = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		console.log('handleCreateNote')
		const formData = Object.fromEntries(new FormData(e.currentTarget))
		createNote(formData, {
			onSuccess: () => {
				setOpen(false)
				props.onSuccess()
			},
		})
	}

	return (
		<div>
			<Button size="small" onClick={() => setOpen(true)}>
				Create Note
			</Button>
			<form onSubmit={handleCreateNote}>
				<Modal
					title="Create Note"
					open={open}
					setOpen={setOpen}
					okButton={{
						size: 'small',
						type: 'submit',
						disabled: isPending,
						label: 'Create Note',
						variant: isPending ? 'disabled' : 'primary',
					}}
					closeButton={{ label: 'Cancel', variant: 'simple', size: 'small' }}
				>
					<div className="flex min-w-80 flex-col gap-4">
						<TextInput name="title" placeholder="Title" required />
						<TextAreaInput name="body" rows={6} placeholder="Write details to your note" />
						<SingleSelectInput
							name="status"
							options={statusOptions}
							default={statusOptions[0].value}
							render={({ option }) => (
								<span>
									{statusOptions.find((op) => op.value === option)?.label || statusOptions[0].label}
								</span>
							)}
						/>
					</div>
				</Modal>
			</form>
		</div>
	)
}

export default CreateNote
