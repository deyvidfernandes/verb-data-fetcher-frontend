export interface AppGlobalState {
	processState: ProcessState
	processConfiguration: ProcessConfiguration
	UIState: UIState
}

interface UIState {
	verbOnFocus: string
}

export interface ProcessConfiguration {
	delay: number
	outputJson: boolean
	persistData: boolean
	dataSource: DataSource | null
	database: Database
}

export interface ProcessState {
	status: ProcessStatus
	enrichedVerbsCount: number
	errors: ProcessError[]
	verbsQueued: number
	totalFetchedData: number
	lastEnrichmentDuration: number[]
}

export interface Database {
	type: string
	url: string
	name: string
	table: string
	user: string
	password: string
}

export interface DataSource {
	rawVerbData: RawVerb[]
	fileSize: number
	fileName: string
}

export interface RawVerb {
	infinitive: string
	simplePastUS: string
	pastParticipleUS: string
	simplePastUK: string
	pastParticipleUK: string
}

export enum ProcessStatus {
	WAITING_SETUP = 0,
	FETCHING = 1,
	IN_COOLDOWN = 2,
	IN_ERROR = 3,
	WAITING_CONFIRMATION_TO_SAVE = 4,
	PAUSED = 5,
}

export interface ProcessError {
	status: 'error' | 'warning' | 'corrected'
	verbIndex: number
	verbName: string
	verbId: string
	id: string
	info: string
}
