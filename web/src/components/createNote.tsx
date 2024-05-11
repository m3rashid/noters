import { useMutation } from '@tanstack/react-query'
import { FormEvent, useState } from 'react'

import Button from './lib/button'
import apiClient from '../api/client'
import TextInput from './lib/textInput'
import TextAreaInput from './lib/textAreaInput'
import SingleSelectInput from './lib/selectInput'
import { XMarkIcon } from '@heroicons/react/16/solid'

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
		const formData = Object.fromEntries(new FormData(e.currentTarget))
		createNote(formData, {
			onSuccess: () => {
				setOpen(false)
				props.onSuccess()
			},
		})
	}

	return (
		<>
			<Button onClick={() => setOpen(true)}>Create Note</Button>
			{open ? (
				<div className="absolute left-0 top-0 z-30 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50">
					<div className="relative z-50 rounded-md bg-white px-4 py-8">
						<Button
							leftIcon={XMarkIcon}
							onClick={() => setOpen(false)}
							variant="simple"
							className="absolute right-2 top-2 rounded-full border-none px-2 shadow-sm"
						/>

						<h2 className="mb-6 text-left text-xl font-bold">Create Note</h2>

						<form onSubmit={handleCreateNote} className="z-40 flex min-w-80 flex-col gap-4">
							<TextInput name="title" label="Title" required />
							<TextAreaInput name="body" label="Body" rows={6} />
							<SingleSelectInput
								name="status"
								options={statusOptions}
								default={statusOptions[0].value}
								render={({ option }) => (
									<span>
										{statusOptions.find((op) => op.value === option)?.label ||
											statusOptions[0].label}
									</span>
								)}
							/>
							<Button
								disabled={isPending}
								type="submit"
								variant={isPending ? 'disabled' : 'primary'}
							>
								Create Note
							</Button>
						</form>
					</div>
				</div>
			) : null}
		</>
	)
}

export default CreateNote
