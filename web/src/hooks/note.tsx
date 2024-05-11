import {
	Dispatch,
	useState,
	useContext,
	createContext,
	SetStateAction,
	PropsWithChildren,
} from 'react'

type NoteStatus = 'all' | 'todo' | 'in_progress' | 'done'

export type NoteContextType = {
	status: NoteStatus
	setStatus: Dispatch<SetStateAction<NoteStatus>>
}

export const NotesContext = createContext<any>(null)

export function NotesProvider(props: PropsWithChildren) {
	const [status, setStatus] = useState<NoteContextType['status']>('all')

	return (
		<NotesContext.Provider value={{ status, setStatus }}>{props.children}</NotesContext.Provider>
	)
}

export function useNotes() {
	const { status, setStatus } = useContext(NotesContext)

	return {
		status,
		setStatus,
	}
}
