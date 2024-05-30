import { ReactNode } from 'react'

interface Props {
	sections: {
		id: number
		title: string
		content: ReactNode
		flex?: number
	}[]
	variant?: 'orange' | 'red'
	roundedBottom?: boolean
}

export const SectionRowList = ({
	sections,
	variant = 'orange',
	roundedBottom,
}: Props) => {
	const isRedVariant = variant === 'red'
	const borderColorClassName = isRedVariant ? 'border-brandRed' : 'border-brandOrange'

	return (
		<div
			className={`
				flex w-full h-56 ${borderColorClassName} 
				border-2 ${roundedBottom && 'rounded-b-lg'} rounded-tr-lg
			`}
		>
			{sections.map(({ content, flex, title, id }, idx) => {
				const isLastSection = sections.length - 1 === idx
				return (
					<div
						key={id}
						className={`flex flex-1 flex-col h-full 
							${!isLastSection && 'border-r-2'} 
							${borderColorClassName}
						`}
						style={{ flex }}
					>
						<div className={`h-10 border-b-2 px-8 py-2 ${borderColorClassName}`}>
							<p className='text-lg font-semibold'>{title}</p>
						</div>
						<div
							className={`
								px-8 py-2 h-full overflow-y-scroll 
								${isRedVariant && 'red-scrollbar'}
							`}
						>
							{content}
						</div>
					</div>
				)
			})}
		</div>
	)
}
