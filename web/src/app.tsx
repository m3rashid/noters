import { useEffect } from 'react'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import { useAuth } from './hooks/auth'
import { routeTree } from './routeTree.gen'
import Loader from './components/lib/loader'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

function App() {
	const {
		checkAuth,
		auth: { loading },
	} = useAuth()

	useEffect(() => {
		checkAuth().catch(console.log)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (loading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Loader />
			</div>
		)
	}

	return <RouterProvider router={router} />
}

export default App
