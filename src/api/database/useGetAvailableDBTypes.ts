import { useEffect, useState } from 'react'
import { BACKEND_API_ADDRESS } from './metadata'

export const useGetAvailableDBTypes = () => {
	const [availableDBTypes, setAvailableDBTypes] = useState<string[]>()

	useEffect(() => {
		const fetchAvailableDatabaseTypes = async () => {
			const response = await fetch(`${BACKEND_API_ADDRESS}database/available-types`)
			const resData: string[] = await response.json()
			setAvailableDBTypes([...resData])
		}
		fetchAvailableDatabaseTypes()
	}, [])

	return availableDBTypes
}
