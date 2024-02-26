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

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const limitedDoWhile = async <T>(
	callback: () => T,
	max: number,
	interval = 5000,
): Promise<T> => {
	let result
	let counter = 0
	do {
		if (counter > 0)
			await new Promise((resolve) => {
				setTimeout(resolve, interval)
			})
		counter++
		console.log(counter)
		result = await callback()
	} while (!result && counter < max)
	return result
}
