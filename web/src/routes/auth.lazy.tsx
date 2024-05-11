import { useEffect, useState } from 'react'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'

import { useAuth } from '../hooks/auth'
import CredentialsLogin, { LoginWithCredentialsProps } from '../components/credentialsAuth'

export const Route = createLazyFileRoute('/auth')({
	component: Auth,
})

function Auth() {
	const navigate = useNavigate({ from: '/auth' })
	const {
		auth: { isAuthenticated },
	} = useAuth()
	const [type, setType] = useState<LoginWithCredentialsProps['type']>('register')

	useEffect(() => {
		if (isAuthenticated) {
			navigate({ to: '/', replace: true })
		}
	}, [])

	return (
		<div className="flex h-[calc(100vh-48px)] items-center justify-center bg-pageBg">
			<div className="flex w-full max-w-96 flex-col gap-4 rounded-lg bg-white px-6 py-12">
				<h2 className="text-center text-xl font-semibold">
					{type === 'login' ? 'Login to Continue' : 'Register to get Started'}
				</h2>

				<CredentialsLogin type={type} />
				<p
					onClick={() => setType((prev) => (prev === 'login' ? 'register' : 'login'))}
					className="mb-1 cursor-pointer text-center text-sm text-primary hover:text-danger"
				>
					{type === 'login'
						? "Don't have an account? Register Instead"
						: 'Already have an account? Login Instead'}
				</p>
			</div>
		</div>
	)
}
