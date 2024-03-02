import { INITIAL_GLOBAL_STATE } from './INITIAL_GLOBAL_STATE'

let hasInitiated = false
export namespace ControlledSessionStorage {
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	const wrapWithVerify = <F extends Function>(fn: F): F => {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const returnFn = (...args: any[]) => {
			console.log(hasInitiated)
			if (!hasInitiated)
				throw new Error('Tried to to use session storage before initialization')
			return fn(...args)
		}
		return returnFn as unknown as F
	}

	export const getRequisitionDelay = wrapWithVerify(() => {
		return Number(sessionStorage.getItem('delay')) * 1000
	})

	export const setRequisitionDelay = wrapWithVerify((value: number) => {
		return sessionStorage.setItem('delay', value.toString())
	})

	export const init = () => {
		hasInitiated = true
		console.log(hasInitiated)

		if (!sessionStorage.getItem('delay'))
			setRequisitionDelay(INITIAL_GLOBAL_STATE.processConfiguration.delay * 1000)
	}
}
