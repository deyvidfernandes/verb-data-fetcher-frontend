import { ReactNode } from 'react'

interface Props {
	title: string
	children: ReactNode
}

export const Section = ({ title, children }: Props) => {
	return (
		<section className='flex flex-col gap-4 w-full items-center'>
			<h2 className='text-3xl font-semibold capitalize'>{title}</h2>
			{children}
		</section>
	)
}
