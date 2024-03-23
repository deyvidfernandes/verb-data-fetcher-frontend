import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import Button from '../Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export interface ModalMessageProps {
	variant: 'error' | 'success'
	title: string
	content?: string
	additionalMessage?: string
	onConfirmation?: () => void
}

export const ModalMessage = ({
	variant,
	title,
	content,
	additionalMessage,
	onConfirmation,
}: ModalMessageProps) => {
	const isErrorVariant = variant === 'error'
	return (
		<div
			className={`flex flex-col p-4 border-2 rounded-lg items-center gap-2 justify-center h-full ${
				isErrorVariant
					? 'bg-brandLightRed border-brandRed'
					: 'bg-brandLightGreen border-brandGreen'
			}`}
		>
			{isErrorVariant ? (
				<FontAwesomeIcon icon={faExclamationCircle} className='text-brandRed text-8xl' />
			) : (
				<FontAwesomeIcon icon={faCheckCircle} className='text-brandGreen text-8xl' />
			)}
			<p className='text-black text-2xl font-semibold text-center capitalize'>{title}</p>
			{content && (
				<p className='text-black text-sm font-medium'>
					{isErrorVariant && <span className='font-semibold'>Error message: </span>}
					{content}
				</p>
			)}
			{additionalMessage && <p className='text-black font-medium'>{additionalMessage}</p>}
			<Button variant={isErrorVariant ? 'darkRed' : 'darkGreen'} onClick={onConfirmation}>
				OK
			</Button>
		</div>
	)
}
