import { ReactNode } from 'react'

export type ListComponent = {
	component: ReactNode
	key: string
}

export type ListComponentArray = {
	components: ListComponent[]
	key: string
}
