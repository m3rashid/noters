import { useState } from 'react'

/**
 * @returns Object with keys that are not in the keys array
 */
export function filterBykeys(obj: Record<string, any>, keys: string[]): Record<string, any> {
	return Object.keys(obj).reduce(
		(acc, key) => ({
			...acc,
			...(!keys.includes(key) ? { [key]: obj[key] } : {}),
		}),
		{},
	)
}

export function formatDate(date: string | number | Date) {
	const d = new Date(date)
	return d.toDateString() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
}

export function ShowBody(props: { body?: string; length?: number }) {
	const [more, setMore] = useState(false)
	const body = props.body || ''
	const length = props.length || 200

	const isMore = body.length > length

	if (!isMore) return <p>{body}</p>

	return (
		<p>
			{more ? body : body.slice(0, length)}
			<span className="cursor-pointer text-primary" onClick={() => setMore((p) => !p)}>
				&nbsp; . . . {more ? 'less' : 'more'}
			</span>
		</p>
	)
}
