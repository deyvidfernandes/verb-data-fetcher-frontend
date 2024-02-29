import { BackendAPIResponse, ErrorResponse } from './metadata'
import { BACKEND_API_ADDRESS } from './metadata'
import { useState } from 'react'
import { DBConfigValues } from '../../content/forms/DBConfigValues'
import { fetchBackend } from './fetchBackend'

export const useSetDatabaseConnection = () => {
	const [responseData, setResponseData] = useState<RequestResponse>()

	const request = async (values: DBConfigValues): Promise<boolean> => {
		const postDBConfig = async () => {
			const { url, type, name } = values
			const body = {
				table: values.table,
				password: values.password,
				username: values.user,
				url: `${url}/${name}`,
				type: type.toUpperCase(),
			}

			return await fetchBackend<undefined>(`${BACKEND_API_ADDRESS}database/setup`, {
				method: 'POST',
				headers: new Headers({ 'content-type': 'application/json' }),
				body: JSON.stringify(body),
				attempts: 1,
			})
		}

		const handleResponse = (res: BackendAPIResponse<undefined>) => {
			const handleErrorResponse = (res: BackendAPIResponse<undefined>) => {
				const errorData = res.data as ErrorResponse
				setResponseData({
					error: {
						message: errorData.message,
						exceptionMessage: errorData.exceptionMessage,
					},
				})
			}

			setResponseData({})
			if (!res.ok) {
				handleErrorResponse(res)
				return false
			}
			return true
		}

		const configRequestResponse = await postDBConfig()
		console.log(configRequestResponse)
		return handleResponse(configRequestResponse)
	}

	const cleanAttempt = () => {
		setResponseData(undefined)
	}

	return {
		request,
		cleanAttempt,
		responseData,
	}
}

export interface RequestResponse {
	error?: DBConfigRequestError
}

export interface DBConfigRequestError {
	message: string
	exceptionMessage: string
}
