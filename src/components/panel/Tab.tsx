import { ReactNode } from 'react'

interface Props {
	children: ReactNode
}

export const Tab = (props: Props) => {
	const { children } = props
	return <div className='flex flex-col gap-2 px-4 py-2 '>{children}</div>
}
