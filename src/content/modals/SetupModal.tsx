import { RefObject, forwardRef, useState } from 'react'
import { Modal, ModalInterface } from '../../components/basic/Modal'
import { ConfigForm } from '../forms/ConfigForm'
import { DBConfigValues } from '../forms/DBConfigValues'
import { useGetAvailableDBTypes } from '@/api/database/useGetAvailableDBTypes'
import { useSetDatabaseConnection } from '../../api/database/useSetDatabaseConnection'
import { ConfigResponseModalMessage } from './ConfigResponseModalMessage'
import { useGlobalStateContext } from '@/util/globalState/GlobalStateContext'
import { INITIAL_GLOBAL_STATE } from '@/util/globalState/INITIAL_GLOBAL_STATE'
import { ProcessStatus, RawVerb } from '@/util/globalState/types'

export const SetupModal = forwardRef(function SetupModal(_, ref) {
	const dispatchGlobalAction = useGlobalStateContext((v) => v.dispatchGlobalAction)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const availableDBTypes = useGetAvailableDBTypes()?.map((type) => ({
		label: type,
		value: type,
	}))

	const dbConnection = useSetDatabaseConnection()

	const handleSetup = async (values: DBConfigValues) => {
		const { outputMethod, baseDataFile } = values

		const updateAppGlobalState = async (values: DBConfigValues) => {
			const initialDBConfigValues = INITIAL_GLOBAL_STATE.processConfiguration.database

			if (!baseDataFile) throw new Error()
			const rawVerbData: RawVerb[] = JSON.parse(await baseDataFile?.text())
			dispatchGlobalAction({
				type: 'SETUP_PROCESS',
				payload: {
					database: {
						...(outputMethod.persistData ? values : initialDBConfigValues),
					},
					dataSource: {
						rawVerbData,
						fileName: baseDataFile.name,
						fileSize: baseDataFile.size,
					},
					...outputMethod,
				},
			})

			dispatchGlobalAction({
				type: 'CHANGE_STATUS',
				payload: {
					status: ProcessStatus.FETCHING,
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
	}

	const typedRef = ref as RefObject<ModalInterface>
	const hasServerResponded = !!dbConnection.responseData
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
					dbRequestError={dbConnection.responseData?.error}
					handleConfirmErrorMessage={handleConfirmErrorMessage}
					handleConfirmSuccessMessage={handleConfirmSuccessMessage}
				/>
			)}
		</Modal>
	)
})
