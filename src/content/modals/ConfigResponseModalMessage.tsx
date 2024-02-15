import { ModalMessage } from '@/components/basic/modal/ModalMessage'
import { DBConfigRequestError } from '../../api/database/useSetDatabaseConnection'

interface Props {
	dbRequestError?: DBConfigRequestError
	onConfirmErrorMessage: () => void
	onConfirmSuccessMessage: () => void
}

export const ConfigResponseModalMessage = ({
	dbRequestError,
	onConfirmErrorMessage,
	onConfirmSuccessMessage,
}: Props) => {
	return (
		<ModalMessage
			variant={dbRequestError ? 'error' : 'success'}
			title={dbRequestError?.message || 'Success!'}
			content={
				dbRequestError?.exceptionMessage || 'The connection was successfully established'
			}
			additionalMessage={dbRequestError ? 'Review your configuration and try again' : ''}
			onConfirmation={dbRequestError ? onConfirmErrorMessage : onConfirmSuccessMessage}
		/>
	)
}
