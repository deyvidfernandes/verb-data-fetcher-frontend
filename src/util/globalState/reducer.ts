import actionCreatorFactory from 'typescript-fsa'
import { AppGlobalState, DataSource, Database, ProcessStatus } from './types'
import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { Reducer, useReducer } from 'react'
import { INITIAL_GLOBAL_STATE } from './INITIAL_GLOBAL_STATE'
import { ControlledSessionStorage } from './ControlledSessionStorage'

const actionCreator = actionCreatorFactory()

const createHandlerWithAction = <State, Payload>(
	actionType: string,
	handler: (state: State, payload: Payload) => State,
) => {
	const action = actionCreator<Payload>(actionType)
	return { handler, action }
}

const addFetchedVerb = createHandlerWithAction<
	AppGlobalState,
	{ verbDataSize: number; enrichmentDuration: number }
>('ADD_FETCHED_VERB', (state, payload) => {
	const lastEnrichmentDuration = [...state.processState.lastEnrichmentDuration]
	if (lastEnrichmentDuration.length === 10) lastEnrichmentDuration.pop()
	lastEnrichmentDuration.push(payload.enrichmentDuration)
	return {
		processConfiguration: {
			...state.processConfiguration,
			database: { ...state.processConfiguration.database },
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			dataSource: { ...state.processConfiguration.dataSource! },
		},
		processState: {
			...state.processState,
			enrichedVerbsCount: state.processState.enrichedVerbsCount + 1,
			lastEnrichmentDuration: lastEnrichmentDuration,
			totalFetchedData: state.processState.totalFetchedData + payload.verbDataSize,
		},
	}
})

const changeStatus = createHandlerWithAction<AppGlobalState, { status: ProcessStatus }>(
	'CHANGE_STATUS',
	(state, payload) => {
		return {
			processConfiguration: {
				...state.processConfiguration,
				database: { ...state.processConfiguration.database },
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				dataSource: { ...state.processConfiguration.dataSource! },
			},
			processState: {
				...state.processState,
				status: payload.status,
			},
		}
	},
)

const changeRequisitionDelay = createHandlerWithAction<AppGlobalState, { delay: number }>(
	'CHANGE_REQUISITION_DELAY',
	(state, payload) => {
		ControlledSessionStorage.setRequisitionDelay(payload.delay)
		return {
			processConfiguration: {
				...state.processConfiguration,
				delay: payload.delay,
				database: { ...state.processConfiguration.database },
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				dataSource: { ...state.processConfiguration.dataSource! },
			},
			processState: {
				...state.processState,
			},
		}
	},
)

const changeDatabaseConfiguration = createHandlerWithAction<
	AppGlobalState,
	{ database: Database; outputJson: boolean; persistData: boolean }
>('CHANGE_DATABASE_CONFIGURATION', (state, payload) => {
	return {
		processConfiguration: {
			...payload,
			delay: state.processConfiguration.delay,
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			dataSource: { ...state.processConfiguration.dataSource! },
		},
		processState: {
			...state.processState,
		},
	}
})

const setupProcess = createHandlerWithAction<
	AppGlobalState,
	{
		database: Database
		outputJson: boolean
		persistData: boolean
		dataSource: DataSource
	}
>('SETUP_PROCESS', (state, payload) => {
	return {
		processConfiguration: {
			...payload,
			delay: state.processConfiguration.delay,
		},
		processState: {
			...state.processState,
			verbsQueued: payload.dataSource.rawVerbData.length,
		},
	}
})

export type Action =
	| {
			type: 'ADD_FETCHED_VERB'
			payload: { verbDataSize: number; enrichmentDuration: number }
	  }
	| { type: 'CHANGE_STATUS'; payload: { status: ProcessStatus } }
	| { type: 'CHANGE_REQUISITION_DELAY'; payload: { delay: number } }
	| {
			type: 'CHANGE_DATABASE_CONFIGURATION'
			payload: {
				outputJson: boolean
				persistData: boolean
				database: Database
			}
	  }
	| {
			type: 'SETUP_PROCESS'
			payload: {
				database: Database
				dataSource: DataSource
				outputJson: boolean
				persistData: boolean
			}
	  }

const globalAppStateReducer = reducerWithInitialState(INITIAL_GLOBAL_STATE)
	.case(addFetchedVerb.action, addFetchedVerb.handler)
	.case(changeStatus.action, changeStatus.handler)
	.case(changeRequisitionDelay.action, changeRequisitionDelay.handler)
	.case(changeDatabaseConfiguration.action, changeDatabaseConfiguration.handler)
	.case(setupProcess.action, setupProcess.handler)
	.build()

export const useGlobalStateReducer = () =>
	useReducer<Reducer<AppGlobalState, Action>>(globalAppStateReducer, INITIAL_GLOBAL_STATE)
