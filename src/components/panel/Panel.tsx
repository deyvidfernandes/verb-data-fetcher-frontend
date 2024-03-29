import { ReactNode } from 'react'

type Props = {
	header?: ReactNode
	children: ReactNode
}

const Panel = (props: Props) => {
	const { header, children } = props

	if (header) {
		return (
			<div className='h-fit w-full'>
				<div
					className={
						'h-10 border-t-2 border-x-2 border-brandOrange rounded-t-lg overflow-clip'
					}
				>
					{header}
				</div>
				<hr className='border-t-2 border-brandOrange' />
				<div className=' border-brandOrange border-b-2 border-x-2 rounded-b-lg'>
					{children}
				</div>
			</div>
		)
	}
	return (
		<div className='h-fit w-full border-brandOrange border-2 rounded-lg'>{children}</div>
	)
}

export default Panel
