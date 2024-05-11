import { FormEvent, useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import Modal from './lib/modal'
import Button from './lib/button'
import apiClient from '../api/client'
import TextInput from './lib/textInput'
import TextAreaInput from './lib/textAreaInput'
import SingleSelectInput from './lib/selectInput'

export const statusOptions = [
	{ label: 'To Do', value: 'todo', id: 'todo' },
	{ label: 'In Progress', value: 'in_progress', id: 'in_progress' },
	{ label: 'Done', value: 'done', id: 'done' },
]

function CreateNote(props: { onSuccess: () => void }) {
	const [open, setOpen] = useState(false)

	const { isPending, mutate } = useMutation({
		mutationKey: ['createNote', 'getNotes'],
		mutationFn: (data: any) =>
			apiClient('/notes/create', {
				method: 'POST',
				body: JSON.stringify(data),
			}),
	})

	const handleCreateNote = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement))
		if (!formData.title || !formData.status) return
		mutate(formData, {
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
			<Modal open={open} title="Create Note" setOpen={setOpen}>
				<form onSubmit={handleCreateNote}>
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

						<div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
							<Button {...{ label: 'Cancel', variant: 'simple', size: 'small' }} />
							<Button
								{...{
									size: 'small',
									type: 'submit',
									disabled: isPending,
									label: 'Create Note',
									variant: isPending ? 'disabled' : 'primary',
								}}
							/>
						</div>
					</div>
				</form>
			</Modal>
		</div>
	)
}

export default CreateNote
