import { Link } from '@tanstack/react-router'

import { useAuth } from '../hooks/auth'

function Header() {
	const {
		auth: { isAuthenticated, user },
	} = useAuth()

	if (!isAuthenticated) return null
	return (
		<div className="flex h-12 items-center justify-between gap-2 border-b border-gray-200 p-2">
			<div className="flex select-none items-center gap-4">
				<Link to="/" className="[&.active]:font-bold">
					Home
				</Link>
				<Link to="/about" className="[&.active]:font-bold">
					About
				</Link>
			</div>

			<div className="flex items-center gap-4">
				<span className="select-none text-sm font-semibold">{user?.name}</span>
			</div>
		</div>
	)
}

export default Header
