import { AppGlobalState, ProcessStatus } from './types'

export const INITIAL_GLOBAL_STATE: AppGlobalState = {
	processState: {
		status: ProcessStatus.WAITING_SETUP,
		totalFetchedData: 7,
		enrichedVerbsCount: 0,
		verbsQueued: 20,
	},
	processConfiguration: {
		delay: 0.75,
		database: {
			type: null,
			url: null,
			table: null,
			user: null,
			password: null,
		},
	},
}
