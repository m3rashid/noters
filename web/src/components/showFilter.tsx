import { useNotes } from '../hooks/note'
import { statusOptions } from './createNote'
import SingleSelectInput from './lib/selectInput'

const options = [...statusOptions, { label: 'All', value: 'all', id: 'all' }]

function ShowFilter() {
	const { status, setStatus } = useNotes()

	return (
		<SingleSelectInput
			{...{
				options,
				value: status,
				onChange: setStatus,
				default: options[3].value,
				render: ({ option }) => (
					<div className="min-w-20">{options.find((op) => op.value === option)?.label || ''}</div>
				),
			}}
		/>
	)
}

export default ShowFilter
