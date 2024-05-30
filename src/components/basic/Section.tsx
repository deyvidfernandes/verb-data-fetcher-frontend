import { ReactNode } from 'react'

interface Props {
	title: string
	children: ReactNode
	id?: string
}

export const Section = ({ title, children, id }: Props) => {
	return (
		<section className='flex flex-col gap-4 w-full items-center'>
			<h2 className='text-3xl font-semibold capitalize' id={id}>
				{title}
			</h2>
			{children}
		</section>
	)
}
