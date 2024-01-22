import actionCreatorFactory from 'typescript-fsa'
import { AppGlobalState, ProcessConfiguration, ProcessStatus } from './types'
import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { Reducer, useReducer } from 'react'
import { INITIAL_GLOBAL_STATE } from './initialGlobalState'

const actionCreator = actionCreatorFactory()

const createHandlerWithAction = <State, Payload>(
	actionType: string,
	handler: (state: State, payload: Payload) => State,
) => {
	const action = actionCreator<Payload>(actionType)
	return { handler, action }
}

const addFetchedVerb = createHandlerWithAction<AppGlobalState, { verbDataSize: number }>(
	'ADD_FETCHED_VERB',
	(state, payload) => {
		return {
			processConfiguration: {
				...state.processConfiguration,
				database: { ...state.processConfiguration.database },
			},
			processState: {
				...state.processState,
				verbsQueued: state.processState.verbsQueued - 1,
				enrichedVerbsCount: state.processState.enrichedVerbsCount + 1,
				totalFetchedData: state.processState.totalFetchedData + payload.verbDataSize,
			},
		}
	},
)

const changeStatus = createHandlerWithAction<AppGlobalState, { status: ProcessStatus }>(
	'CHANGE_STATUS',
	(state, payload) => {
		return {
			processConfiguration: {
				...state.processConfiguration,
				database: { ...state.processConfiguration.database },
			},
			processState: {
				...state.processState,
				status: payload.status,
			},
		}
	},
)

const changeConfiguration = createHandlerWithAction<
	AppGlobalState,
	{ configuration: ProcessConfiguration }
>('CHANGE_CONFIGURATION', (state, payload) => {
	return {
		processConfiguration: payload.configuration,
		processState: {
			...state.processState,
		},
	}
})

export type Action =
	| { type: 'ADD_FETCHED_VERB'; payload: { verbDataSize: number } }
	| { type: 'CHANGE_STATUS'; payload: { status: ProcessStatus } }
	| { type: 'CHANGE_CONFIGURATION'; payload: { configuration: ProcessConfiguration } }

const globalAppStateReducer = reducerWithInitialState(INITIAL_GLOBAL_STATE)
	.case(addFetchedVerb.action, addFetchedVerb.handler)
	.case(changeStatus.action, changeStatus.handler)
	.case(changeConfiguration.action, changeConfiguration.handler)
	.build()

export const useGlobalStateReducer = () =>
	useReducer<Reducer<AppGlobalState, Action>>(globalAppStateReducer, INITIAL_GLOBAL_STATE)
