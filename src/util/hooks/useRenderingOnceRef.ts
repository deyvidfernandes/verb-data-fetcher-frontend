import { useEffect, useRef, useState } from 'react'

export const useRerenderingOnceRef = <I>() => {
	const ref = useRef<I>(null)
	const [, setRefAcquired] = useState(false)

	useEffect(() => {
		setRefAcquired(true)
	}, [])
	return ref
}
