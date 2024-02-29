import { advancedFetch, advancedRequestInit } from '@/util/fns'
import { BackendAPIResponse } from './metadata'

export const fetchBackend = async <T>(
	input: RequestInfo | URL,
	init?: advancedRequestInit,
): Promise<BackendAPIResponse<T>> => {
	let res: Response
	if (init) res = await advancedFetch(input, init)
	else res = await fetch(input)

	let data
	try {
		data = await res.json()
	} catch (error) {
		// Response did not return JSON content
	}

	const result: BackendAPIResponse<T> = {
		ok: res.ok,
		data: data,
	}

	return result
}
