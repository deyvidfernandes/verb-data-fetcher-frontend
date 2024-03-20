import { Context, ReactNode } from 'react'
import { useContextSelector, createContext } from 'use-context-selector'
import { GlobalAction, useGlobalStateReducer } from './reducer'
import { AppGlobalState } from './types'

interface IContext {
	appGlobalState: AppGlobalState
	dispatchGlobalAction: React.Dispatch<GlobalAction>
}

const context = createContext<IContext | null>(null)

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
	const [appGlobalState, dispatchGlobalAction] = useGlobalStateReducer()
	return (
		<context.Provider value={{ appGlobalState, dispatchGlobalAction }}>
			{children}
		</context.Provider>
	)
}

export const useGlobalStateContext = <S,>(selector: (v: IContext) => S): S => {
	return useContextSelector(context as Context<IContext>, selector)
}
