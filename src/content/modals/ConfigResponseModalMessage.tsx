import { ModalMessage } from '@/components/basic/ModalMessage'
import { DBConfigRequestError } from '../../api/database/useSetDatabaseConnection'

interface Props {
	dbRequestError?: DBConfigRequestError
	handleConfirmErrorMessage: () => void
	handleConfirmSuccessMessage: () => void
}

export const ConfigResponseModalMessage = ({
	dbRequestError,
	handleConfirmErrorMessage,
	handleConfirmSuccessMessage,
}: Props) => {
	return (
		<ModalMessage
			variant={dbRequestError ? 'error' : 'success'}
			title={dbRequestError?.message || 'Success!'}
			content={
				dbRequestError?.exceptionMessage || 'The connection was successfully established'
			}
			additionalMessage={dbRequestError ? 'Review your configuration and try again' : ''}
			onConfirmation={
				dbRequestError ? handleConfirmErrorMessage : handleConfirmSuccessMessage
			}
		/>
	)
}
