import { Link } from "@tanstack/react-router"

import { useAuth } from "../hooks/auth"

function Header( ) {
	const { auth: { isAuthenticated }} = useAuth()

	if (!isAuthenticated) return null
	return (
		<>
			<div className='p-2 flex gap-2'>
        <Link to='/' className='[&.active]:font-bold'>
          Home
        </Link>{' '}
        <Link to='/about' className='[&.active]:font-bold'>
          About
        </Link>
      </div>
      <hr />
		</>
	)
}

export default Header
