import { RefObject, forwardRef, useState } from 'react'
import { Modal, ModalInterface } from '../../components/basic/Modal'
import { ConfigForm } from '../forms/ConfigForm'
import { DBConfigValues } from '../forms/DBConfigValues'
import { useGetAvailableDBTypes } from '@/util/backendHooks/useGetAvailableDBTypes'
import { useSetDatabaseConnection } from '../../util/backendHooks/useSetDatabaseConnection'
import { ConfigResponseModalMessage } from './ConfigResponseModalMessage'

export const SetupModal = forwardRef(function SetupModal(_, ref) {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const availableDBTypes = useGetAvailableDBTypes()?.map((type) => ({
		label: type,
		value: type,
	}))

	const {
		tryDatabaseConnection,
		dbRequestError,
		hasServerResponded,
		cleanConnectionAttempt,
	} = useSetDatabaseConnection()

	const handleSetup = (values: DBConfigValues) => {
		tryDatabaseConnection(values)
	}

	const handleConfirmErrorMessage = () => {
		cleanConnectionAttempt()
	}

	const handleConfirmSuccessMessage = () => {
		typedRef.current?.close()
	}

	const typedRef = ref as RefObject<ModalInterface>

	return (
		<Modal
			onOpen={() => setIsModalOpen(true)}
			onClose={() => setIsModalOpen(false)}
			ref={ref}
		>
			{isModalOpen && (
				<ConfigForm
					hidden={hasServerResponded}
					variant='setup'
					availableDBTypes={availableDBTypes}
					handleClose={() => typedRef.current?.close()}
					onSubmit={handleSetup}
				/>
			)}
			{hasServerResponded && (
				<ConfigResponseModalMessage
					dbRequestError={dbRequestError}
					handleConfirmErrorMessage={handleConfirmErrorMessage}
					handleConfirmSuccessMessage={handleConfirmSuccessMessage}
				/>
			)}
		</Modal>
	)
})
