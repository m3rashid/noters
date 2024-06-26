import {
	Dispatch,
	PropsWithChildren,
	SetStateAction,
	createContext,
	useContext,
	useState,
} from 'react'

import { User } from '../types'
import { baseUrl } from '../api/client'

export type Auth = {
	isAuthenticated: boolean
	user: User | null
	loading: boolean
}

const authDefaultState: Auth = {
	isAuthenticated: false,
	user: null,
	loading: true,
}

const authContext = createContext<[auth: Auth, setAuth: Dispatch<SetStateAction<Auth>>]>([
	authDefaultState,
	() => {},
])

export function AuthProvider(props: PropsWithChildren) {
	const [auth, setAuth] = useState<Auth>(authDefaultState)
	return <authContext.Provider value={[auth, setAuth]}>{props.children}</authContext.Provider>
}

export function useAuth() {
	const [auth, setAuth] = useContext(authContext)

	function logout() {
		localStorage.removeItem('token')
		setAuth({ isAuthenticated: false, user: null, loading: false })
	}

	async function checkAuth() {
		try {
			const res = await fetch(baseUrl + '/auth/user', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			const data = await res.json()
			if (!data.id) throw new Error('No User')
			setAuth({ isAuthenticated: true, user: data, loading: false })
		} catch (err: unknown) {
			setAuth({ isAuthenticated: false, user: null, loading: false })
		}
	}

	return {
		auth,
		logout,
		setAuth,
		checkAuth,
	}
}
