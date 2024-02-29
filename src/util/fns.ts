export const formatBytes = (bytes: number, decimals = 2) => {
	if (!+bytes) return '0B'

	const k = 1000
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

	const i = Math.floor(Math.log(bytes) / Math.log(k))

	return `${parseFloat((bytes / k ** i).toFixed(dm))}${sizes[i]}`
}

export const arithmeticAverage = (...numbers: number[]) => {
	if (numbers.length === 0) return 0
	return numbers.reduce((acc, currVal) => acc + currVal, 0) / numbers.length
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const findPropInObjectArray = (objs: { [key: string]: any }[], key: string) => {
	return objs.findIndex((obj) => Object.hasOwn(obj, key) && !!obj[key])
}

export class Timer {
	initTime: number

	constructor() {
		this.initTime = new Date().getTime()
	}

	getElapsedTime() {
		return new Date().getTime() - this.initTime
	}
}

export const timeoutPromise = async (interval: number) =>
	new Promise((resolve) => {
		setTimeout(resolve, interval)
	})

export const retryWithTimeout = async <T>(
	callback: () => T,
	evaluate: (res: Awaited<T> | undefined, count?: number) => boolean,
	options: {
		attempts: number
		interval?: number
		throwError?: boolean
	},
): Promise<T | undefined> => {
	const { attempts, interval, throwError } = options
	let result
	let counter = 0
	do {
		if (counter > 0 && interval) await timeoutPromise(interval)
		counter++

		console.log(counter)

		try {
			result = await callback()
		} catch (error) {
			if (throwError) throw error
		}
	} while (!evaluate(result, counter) && counter < attempts)
	return result
}

export type advancedRequestInit = { attempts: number; interval?: number } & RequestInit

export const advancedFetch = async (
	input: RequestInfo | URL,
	init?: advancedRequestInit,
): Promise<Response> => {
	const validateResponse = (res: Response | undefined) => {
		if (!res) throw new Error('advancedFetch did not receive response')
	}
	const evaluate = (res: Response | undefined) => !!res?.ok

	let res: Response | undefined
	if (init)
		res = (await retryWithTimeout(() => fetch(input, init), evaluate, init)) as Response
	else res = await fetch(input)

	validateResponse(res)

	return res
}
