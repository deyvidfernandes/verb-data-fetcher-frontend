import error from '@/assets/circle-exclamation-solid.svg'
import ok from '@/assets/circle-check-solid.svg'
import Button from './Button'

interface Props {
	variant: 'error' | 'success'
	title: string
	content: string
	additionalMessage: string
	onConfirmation?: () => void
}

export const ModalMessage = ({
	variant,
	title,
	content,
	additionalMessage,
	onConfirmation,
}: Props) => {
	const isErrorVariant = variant === 'error'
	return (
		<div
			className={`flex flex-col p-4 border-2 rounded-lg items-center gap-2 ${
				isErrorVariant
					? 'bg-brandLightRed border-brandRed'
					: 'bg-brandLightGreen border-brandGreen'
			}`}
		>
			<img src={isErrorVariant ? error : ok} className='w-20' alt='Message type icon' />
			<p className='text-black text-2xl font-semibold text-center capitalize'>{title}</p>
			<p className='text-black text-sm font-medium'>
				{isErrorVariant && <span className='font-semibold'>Error message: </span>}
				{content}
			</p>
			{additionalMessage && <p className='text-black font-medium'>{additionalMessage}</p>}
			<Button
				variant={isErrorVariant ? 'darkRed' : 'darkGreen'}
				onClick={onConfirmation}
			>
				OK
			</Button>
		</div>
	)
}
