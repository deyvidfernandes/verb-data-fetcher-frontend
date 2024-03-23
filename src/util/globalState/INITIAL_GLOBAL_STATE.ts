import { AppGlobalState, ProcessStatus } from './types'

export const INITIAL_GLOBAL_STATE: AppGlobalState = {
	processState: {
		status: ProcessStatus.WAITING_SETUP,
		totalFetchedData: 0,
		errors: [],
		enrichedVerbsCount: 0,
		lastEnrichmentDuration: [], // this does not consider the delay
		verbsQueued: 0,
	},
	processConfiguration: {
		outputJson: false,
		persistData: true,
		dataSource: null,
		delay: 4,
		database: {
			type: '',
			url: '',
			name: '',
			table: '',
			user: '',
			password: '',
		},
	},
	UIState: {
		verbOnFocus: '',
	},
}
