import { ReactNode } from 'react'

interface Props {
	sections: {
		id: number
		title: string
		content: ReactNode
		flex?: number
	}[]
}

export const SectionRowList = ({ sections }: Props) => {
	return (
		<div className='flex w-full h-56 border-brandOrange border-2 rounded-b-lg rounded-tr-lg'>
			{sections.map(({ content, flex, title, id }, idx) => {
				const isLastSection = sections.length - 1 === idx
				return (
					<div
						key={id}
						className={`flex flex-1 flex-col h-full ${
							!isLastSection && 'border-r-2'
						} border-brandOrange`}
						style={{ flex }}
					>
						<div className='h-10 border-b-2 px-8 py-2 border-brandOrange'>
							<p className='text-lg font-semibold'>{title}</p>
						</div>
						<div className='px-8 py-2 h-full overflow-y-scroll'>{content}</div>
					</div>
				)
			})}
		</div>
	)
}
