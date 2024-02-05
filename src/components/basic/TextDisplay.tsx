import { ComponentPropsWithoutRef } from 'react'

interface Props extends ComponentPropsWithoutRef<'p'> {
	label: string
	value: string | number
}

export const TextDisplay = (props: Props) => {
	const { label, value, ...builtInProps } = props

	return (
		<p className='text-sm' {...builtInProps}>
			<span className='font-medium'>{label}: </span>
			{value}
		</p>
	)
}
