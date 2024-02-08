import { RefObject, forwardRef, useState } from 'react'
import { Modal, ModalInterface } from '../../components/basic/Modal'
import { useGlobalStateContext } from '@/util/globalState/GlobalStateContext'
import { ConfigForm } from '../forms/ConfigForm'
import { DBConfigValues } from '../forms/DBConfigValues'
import { useGetAvailableDBTypes } from '@/api/database/useGetAvailableDBTypes'
import { useSetDatabaseConnection } from '@/api/database/useSetDatabaseConnection'
import { ConfigResponseModalMessage } from './ConfigResponseModalMessage'

export const ChangeConfigModal = forwardRef(function SetupModal(_, ref) {
	const processConfigState = useGlobalStateContext((v) => v.appGlobalState.processConfiguration)

	const {
		tryDatabaseConnection,
		dbRequestError,
		hasServerResponded,
		cleanConnectionAttempt,
	} = useSetDatabaseConnection()

	const availableDBTypes = useGetAvailableDBTypes()?.map((type) => ({
		label: type,
		value: type,
	}))

	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleSetup = (values: DBConfigValues) => {
		tryDatabaseConnection(values, true)
	}

	const handleConfirmErrorMessage = () => {
		cleanConnectionAttempt()
	}

	const handleConfirmSuccessMessage = () => {
		typedRef.current?.close()
		cleanConnectionAttempt()
	}

	const typedRef = ref as RefObject<ModalInterface>
	return (
		<Modal
			ref={ref}
			onOpen={() => setIsModalOpen(true)}
			onClose={() => setIsModalOpen(false)}
		>
			{isModalOpen && (
				<ConfigForm
					hidden={hasServerResponded}
					variant='change'
					availableDBTypes={availableDBTypes}
					initialValues={{
						...processConfigState.database,
						outputMethod: {
							outputJson: processConfigState.outputJson,
							persistData: processConfigState.persistData,
						},
						baseDataFile: null,
					}}
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
