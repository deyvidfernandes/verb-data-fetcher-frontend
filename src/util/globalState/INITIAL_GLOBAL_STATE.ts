import { AppGlobalState, ProcessStatus } from './types'

export const INITIAL_GLOBAL_STATE: AppGlobalState = {
	processState: {
		status: ProcessStatus.IN_ERROR,
		totalFetchedData: 7,
		enrichedVerbsCount: 0,
		verbsQueued: 260,
		estimatedProcessRemainingTime: 0,
	},
	processConfiguration: {
		outputJson: false,
		persistData: true,
		rawVerbData: [],
		delay: 0.75,
		database: {
			type: '',
			url: '',
			name: '',
			table: '',
			user: '',
			password: '',
		},
	},
}
