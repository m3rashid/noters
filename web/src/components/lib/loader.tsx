import { twMerge } from 'tailwind-merge'

export type LoaderProps = {
	className?: string
}

function Loader(props: LoaderProps) {
	return (
		<div>
			<img
				className={twMerge('h-20 w-20 animate-spin', props.className)}
				src="https://www.svgrepo.com/show/70469/loading.svg"
				alt="Loading icon"
			/>
		</div>
	)
}

export default Loader
