export enum AvailableDatabaseTypes {
	MYSQL = 'MySQL',
	MARIADB = 'Maria',
	POSTGRESQL = 'Postgresql',
}

export enum ProcessStatus {
	WAITING_SETUP = 0,
	FETCHING = 1,
	IN_COOLDOWN = 2,
	IN_ERROR = 3,
	WAITING_CONFIRMATION_TO_SAVE = 4,
	PAUSED = 5,
}

export interface ProcessState {
	status: ProcessStatus
	enrichedVerbsCount: number
	verbsQueued: number
	totalFetchedData: number
	estimatedProcessRemainingTime: number
}

export interface ProcessConfiguration {
	delay: number
	database: {
		type: AvailableDatabaseTypes | null
		url: string | null
		table: string | null
		user: string | null
		password: string | null
	}
}

export interface AppGlobalState {
	processState: ProcessState
	processConfiguration: ProcessConfiguration
}