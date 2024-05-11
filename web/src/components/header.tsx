import { useNavigate } from '@tanstack/react-router'

import { useAuth } from '../hooks/auth'

function Header() {
	const { auth } = useAuth()
	const navigate = useNavigate()

	const handleClick = () => {
		if (auth.isAuthenticated) {
			window.localStorage.removeItem('token')
			window.location.reload()
		} else {
			navigate({ to: '/auth' })
		}
	}

	return (
		<div className="flex h-12 items-center justify-between gap-2 border-b border-gray-200 p-2">
			<div className="flex select-none items-center gap-4">
				<h2 onClick={() => navigate({ to: '/' })} className="text-lg font-bold">
					Noters
				</h2>
			</div>

			<div className="flex items-center gap-4">
				<span className="cursor-pointer select-none text-sm font-semibold" onClick={handleClick}>
					{auth.isAuthenticated ? 'Logout' : 'Login'}
				</span>
			</div>
		</div>
	)
}

export default Header
