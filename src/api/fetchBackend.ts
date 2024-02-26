import { ErrorResponse } from './database/metadata'

export type BackendAPIResponse<T> =
	| { data: T; ok: true }
	| { data: ErrorResponse; ok: false }

export const fetchBackend = async <T>(
	input: RequestInfo | URL,
	init?: RequestInit,
): Promise<BackendAPIResponse<T>> => {
	const res = await fetch(input, init)
	const data = await res.json()

	return data.ok
		? { data: data as T, ok: data.ok }
		: { data: data as ErrorResponse, ok: data.ok }
}
