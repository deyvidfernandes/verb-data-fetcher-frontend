import { ComponentPropsWithoutRef, ReactNode } from 'react'

interface Props extends ComponentPropsWithoutRef<'p'> {
	label: string
	value: string | number | ReactNode
	variant?: 'orange' | 'gray'
	bigger?: boolean
}

export const TextDisplay = (props: Props) => {
	const { label, value, variant, bigger, ...builtInProps } = props

	let colorClassName

	switch (variant) {
		case 'gray':
			colorClassName = 'text-gray-700'
			break
		case 'orange':
			colorClassName = 'text-brandOrange'
			break
		default:
			colorClassName = 'text-black'
	}

	return (
		<p
			className={`${bigger ? 'text-base' : 'text-sm'} ${colorClassName} `}
			{...builtInProps}
		>
			<span className='font-medium'>{label}: </span>
			{value}
		</p>
	)
}
