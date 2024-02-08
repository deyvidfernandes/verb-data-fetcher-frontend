import { ComponentPropsWithoutRef, ReactNode } from 'react'

interface Props extends ComponentPropsWithoutRef<'p'> {
	label: string
	value: string | number | ReactNode
	subInfo?: boolean
	bigger?: boolean
}

export const TextDisplay = (props: Props) => {
	const { label, value, subInfo, bigger, ...builtInProps } = props

	return (
		<p
			className={`${bigger ? 'text-base' : 'text-sm'} ${subInfo && 'text-gray-700'}`}
			{...builtInProps}
		>
			<span className='font-medium'>{label}: </span>
			{value}
		</p>
	)
}
