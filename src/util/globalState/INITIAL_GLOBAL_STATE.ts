import { AppGlobalState, ProcessStatus } from './types'

export const INITIAL_GLOBAL_STATE: AppGlobalState = {
	processState: {
		status: ProcessStatus.WAITING_SETUP,
		totalFetchedData: 7,
		enrichedVerbsCount: 0,
		verbsQueued: 260,
		estimatedProcessRemainingTime: 0,
	},
	processConfiguration: {
		outputJson: false,
		persistData: true,
		dataSource: null,
		delay: 0.6,
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
