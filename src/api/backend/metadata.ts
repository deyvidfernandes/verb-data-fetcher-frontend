export const BACKEND_API_ADDRESS = 'http://localhost:8080/api/'

export interface ErrorResponse {
	path: string
	message: string
	exceptionMessage: string
	status: number
}

export type BackendAPIResponse<T> =
	| { data: T; ok: true }
	| { data: ErrorResponse; ok: false }
