import { ComponentPropsWithoutRef, ReactNode } from 'react'

interface Props extends ComponentPropsWithoutRef<'button'> {
	variant: 'green' | 'red' | 'blocked' | 'orange' | 'darkRed' | 'darkGreen'
	square?: boolean
	children: ReactNode
}

const Button = (props: Props) => {
	const { square, variant, children, type, ...builtInProps } = props

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
			className={`py-2 ${square ? 'w-8 h-8' : 'max-w-80 w-full rounded-lg'} 
				${variantClasses} text-2xl font-semibold text-white
				flex items-center justify-center`}
			type={type}
			{...builtInProps}
		>
			{children}
		</button>
	)
}

export default Button
