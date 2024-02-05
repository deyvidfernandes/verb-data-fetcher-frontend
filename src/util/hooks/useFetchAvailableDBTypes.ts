import { useEffect } from "react"

export const useFetchAvailableDBTypes = (callback: (types: string[]) => void) => {
   useEffect(() => {
		const fetchAvailableDatabaseTypes = async () => {
			const response = await fetch('http://localhost:8080/api/database/available-types')
			const resData: string[] = await response.json()
			callback(resData)
		}
		fetchAvailableDatabaseTypes()
	}, [callback])
}