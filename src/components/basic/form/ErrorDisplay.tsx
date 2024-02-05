interface Props {
	errorMessage: string
	center?: boolean
}

export const ErrorDisplay = (props: Props) => {
	const { errorMessage, center } = props
	return (
		<div className={`text-sm text-brandRed ${ center ? 'text-center' : '' }`}>
			<p>{errorMessage}</p>
		</div>
	)
}
