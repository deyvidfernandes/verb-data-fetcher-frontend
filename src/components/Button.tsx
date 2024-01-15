import { ComponentPropsWithoutRef, ReactNode } from 'react'

interface Props extends ComponentPropsWithoutRef<'button'> {
	variant: 'green' | 'red' | 'blocked' | 'orange'
	children: ReactNode
}

const Button = (props: Props) => {
	const { variant, children, type, ...builtInProps } = props

	let variantClasses: string

	switch (variant) {
		case 'green':
			variantClasses = 'bg-green'
			break
		case 'red':
			variantClasses = 'bg-red'
			break
		case 'blocked':
			variantClasses = 'bg-gray cursor-not-allowed'
			break
		case 'orange':
			variantClasses = 'bg-orange'
			break
	}

	return (
		<button
			className={`w-80 py-2 ${variantClasses} rounded-lg text-4xl font-semibold text-white uppercase`}
			type={type}
			{...builtInProps}
		>
			{children}
		</button>
	)
}

export default Button
