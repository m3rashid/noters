import { useMutation } from '@tanstack/react-query'
import { Dispatch, FormEvent, SetStateAction } from 'react'

import { Note } from '../types'
import Modal from './lib/modal'
import Button from './lib/button'
import apiClient from '../api/client'
import TextInput from './lib/textInput'
import TextAreaInput from './lib/textAreaInput'
import SingleSelectInput from './lib/selectInput'
import Loader from './lib/loader'

export const statusOptions = [
	{ label: 'To Do', value: 'todo', id: 'todo' },
	{ label: 'In Progress', value: 'in_progress', id: 'in_progress' },
	{ label: 'Done', value: 'done', id: 'done' },
]

export type CreateNoteFormProps = {
	onSuccess: () => void
	note?: Note
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
}

function CreateNoteForm(props: CreateNoteFormProps) {
	const isEdit = !!props.note

	const { isPending, mutate } = useMutation({
		mutationKey: ['createNote', 'getNotes'],
		mutationFn: (data: any) =>
			apiClient(isEdit ? '/notes/update' : '/notes/create', {
				method: 'POST',
				body: JSON.stringify(isEdit ? { ...props.note, ...data } : data),
			}),
	})

	function handleCreateNote(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement))
		if (!formData.title || !formData.status) return
		mutate(formData, {
			onSuccess: () => {
				props.setOpen(false)
				props.onSuccess()
			},
		})
	}

	return (
		<Modal open={props.open} title="Create Note" setOpen={props.setOpen}>
			<form onSubmit={handleCreateNote}>
				<div className="flex min-w-80 flex-col gap-4">
					<TextInput name="title" placeholder="Title" required defaultValue={props.note?.title} />
					<TextAreaInput
						name="body"
						rows={6}
						placeholder="Write details to your note"
						defaultValue={props.note?.body}
					/>
					<SingleSelectInput
						name="status"
						options={statusOptions}
						default={props.note?.status || statusOptions[0].value}
						render={({ option }) => (
							<span>
								{statusOptions.find((op) => op.value === option)?.label || statusOptions[0].label}
							</span>
						)}
					/>

					<div className="mt-14 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
						<Button {...{ label: 'Cancel', variant: 'simple', size: 'small' }} />
						<Button
							{...{
								size: 'small',
								type: 'submit',
								disabled: isPending,
								label: isEdit ? 'Update Note' : 'Create Note',
								variant: isPending ? 'disabled' : 'primary',
								rightIcon: isPending ? () => <Loader className="h-4 w-4" /> : undefined,
							}}
						/>
					</div>
				</div>
			</form>
		</Modal>
	)
}

export default CreateNoteForm
