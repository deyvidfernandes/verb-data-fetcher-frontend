import { RefObject, forwardRef, useState } from 'react'
import { Modal, ModalInterface } from '../../components/basic/Modal'
import { useGlobalStateContext } from '@/util/globalState/GlobalStateContext'
import { ConfigForm } from '../forms/ConfigForm'
import { DBConfigValues } from '../forms/DBConfigValues'
import { useGetAvailableDBTypes } from '@/api/database/useGetAvailableDBTypes'
import { useSetDatabaseConnection } from '@/api/database/useSetDatabaseConnection'
import { ConfigResponseModalMessage } from './ConfigResponseModalMessage'
import { INITIAL_GLOBAL_STATE } from '@/util/globalState/INITIAL_GLOBAL_STATE'

export const ChangeConfigModal = forwardRef(function SetupModal(_, ref) {
	const processConfigState = useGlobalStateContext(
		(v) => v.appGlobalState.processConfiguration,
	)
	const dispatchGlobalAction = useGlobalStateContext((v) => v.dispatchGlobalAction)

	const dbConnection = useSetDatabaseConnection()


	const availableDBTypes = useGetAvailableDBTypes()?.map((type) => ({
		label: type,
		value: type,
	}))

	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleSetup = async (values: DBConfigValues) => {
		const updateAppGlobalState = async (values: DBConfigValues) => {
			const { outputMethod } = values
			const initialDBConfigValues = INITIAL_GLOBAL_STATE.processConfiguration.database

			dispatchGlobalAction({
				type: 'CHANGE_DATABASE_CONFIGURATION',
				payload: {
					database: {
						...(outputMethod.persistData ? values : initialDBConfigValues),
					},
					...outputMethod,
				},
			})
		}

		if (values.outputMethod.persistData) {
			const successfulConnection = await dbConnection.request(values)
			if (successfulConnection) updateAppGlobalState(values)
		}
		else {
			updateAppGlobalState(values)
			typedRef.current?.close()
		}
	}

	const handleConfirmErrorMessage = () => {
		dbConnection.cleanAttempt()
	}

	const handleConfirmSuccessMessage = () => {
		typedRef.current?.close()
		dbConnection.cleanAttempt()
	}

	const typedRef = ref as RefObject<ModalInterface>
	const hasServerResponded = !!dbConnection.responseData
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
					dbRequestError={dbConnection.responseData?.error}
					handleConfirmErrorMessage={handleConfirmErrorMessage}
					handleConfirmSuccessMessage={handleConfirmSuccessMessage}
				/>
			)}
		</Modal>
	)
})
