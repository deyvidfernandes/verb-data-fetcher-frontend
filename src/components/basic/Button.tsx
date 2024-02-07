import { ComponentPropsWithoutRef, ReactNode } from 'react'

interface Props extends ComponentPropsWithoutRef<'button'> {
	variant: 'green' | 'red' | 'blocked' | 'orange' | 'darkRed' | 'darkGreen'
	children: ReactNode
}

const Button = (props: Props) => {
	const { variant, children, type, ...builtInProps } = props

	let variantClasses: string

	switch (variant) {
		case 'green':
			variantClasses = 'bg-brandGreen'
			break
		case 'red':
			variantClasses = 'bg-brandRed'
			break
		case 'blocked':
			variantClasses = 'bg-gray-400 cursor-not-allowed'
			break
		case 'orange':
			variantClasses = 'bg-brandOrange'
			break
		case 'darkRed':
			variantClasses = 'bg-brandDarkRed'
			break
		case 'darkGreen':
			variantClasses = 'bg-brandDarkGreen'
			break
	}

	return (
		<button
			className={`max-w-80 w-full py-2 ${variantClasses} rounded-lg text-2xl font-semibold text-white`}
			type={type}
			{...builtInProps}
		>
			{children}
		</button>
	)
}

export default Button
