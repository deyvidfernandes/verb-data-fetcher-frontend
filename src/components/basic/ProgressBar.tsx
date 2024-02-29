type Props = {
	progress: number
}

// progress bar based on https://github.com/lucagez/bars
const barTexture: React.CSSProperties = {
	backgroundColor: '#FF9A24',
	backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23CC6E00' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
	boxShadow: 'inset 0px 0px 1px 1px #00000055',
}

export const ProgressBar = (props: Props) => {
	const { progress } = props
	const formattedProgress = 100 * progress
	const roundedProgress = Math.round(formattedProgress)

	return (
		<div className='flex items-center justify-between gap-2 h-8 w-full'>
			<div id='progressBarFrame' className='h-8 w-full bg-gray-100 rounded-md p-1'>
				<div
					id='progressBar'
					className={`h-full w-[${formattedProgress}%] bg-brandOrange rounded-md transition-all bars`}
					style={{
						...barTexture,
						width: `${formattedProgress}%`,
						transitionDuration: '200ms',
					}}
				/>
			</div>
			<p
				id='progressBarNumericDisplay'
				className='flex items-center justify-center h-8 text-xl font-medium min-w-16 bg-gray-100 rounded-md'
			>
				{roundedProgress}%
			</p>
		</div>
	)
}
