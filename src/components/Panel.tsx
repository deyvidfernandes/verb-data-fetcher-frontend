import { ReactNode } from 'react'

type Props = {
	header: ReactNode
	children: ReactNode
}

const Panel = (props: Props) => {
	const { header, children } = props

	return (
		<div className='h-fit w-full '>
			<div className={'h-10 border-t-2 border-x-2 border-orange rounded-t-lg overflow-clip'}>
				{header}
			</div>
			<hr className='border-t-2 border-orange' />
			<div className=' border-orange border-b-2 border-x-2 rounded-b-lg'>
				{children}
			</div>
		</div>
	)
}

export default Panel
