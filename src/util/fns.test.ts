import { retryWithTimeout } from './fns'
import { describe, expect, test } from 'vitest'

describe('retryWithTimeout unit tests', () => {
	test('Should repeat 5 times for 5 attempts', async () => {
		let count = 0
		await retryWithTimeout(
			() => {
				count++
			},
			(_, tries) => tries === 4,
			{ attempts: 5, interval: 100 },
		)
		expect(count).toBe(4)
	}, 600)

	test('Should take around 800 milliseconds for 5 attempts and 200 interval', async () => {
		const start = performance.now()
		await retryWithTimeout(
			() => {},
			() => false,
			{ attempts: 5, interval: 200 },
		)
		const end = performance.now()

		const execTime = end - start

		expect(execTime).lessThan(900).greaterThan(700)
	}, 1000)

	test('Should end after throw error if throwError is true', async () => {
		expect(async () => {
			await retryWithTimeout(
				() => {
					throw new Error('Generic error')
				},
				() => false,
				{ attempts: 5, interval: 200, throwError: true },
			)
		}).rejects.toThrowError('Generic error')
	}, 500)

	test('Should continue after throw error if throwError is false', async () => {
		expect(async () => {
			await retryWithTimeout(
				() => {
					throw new Error('Generic error')
				},
				() => false,
				{ attempts: 5, interval: 200 },
			)
		}).not.toThrowError()
	}, 500)
})
