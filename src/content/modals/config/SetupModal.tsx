import { forwardRef } from 'react'
import { ModalInterface } from '../../../components/basic/modal/Modal'
import { ConfigForm } from '../../forms/ConfigForm'
import { DBConfigValues } from '../../forms/DBConfigValues'
import { useGetAvailableDBTypes } from '@/api/backend/useGetAvailableDBTypes'
import { useSetDatabaseConnection } from '../../../api/backend/useSetDatabaseConnection'
import { ConfigResponseModalMessage } from './ConfigResponseModalMessage'
import { useGlobalStateContext } from '@/util/globalState/GlobalStateContext'
import { INITIAL_GLOBAL_STATE } from '@/util/globalState/INITIAL_GLOBAL_STATE'
import { ProcessStatus, RawVerb } from '@/util/globalState/types'
import { ModalWithMessage } from '@/components/basic/modal/ModalWithMessage'
import { useModalInterfaceRef } from '@/components/basic/modal/useModalInterfaceRef'

export const SetupModal = forwardRef<ModalInterface, unknown>(function SetupModal(
	_,
	forwardedRef,
) {
	const dispatchGlobalAction = useGlobalStateContext((v) => v.dispatchGlobalAction)
	const availableDBTypes = useGetAvailableDBTypes()?.map((type) => ({
		label: type,
		value: type,
	}))

	const dbConnection = useSetDatabaseConnection()
	const ref = useModalInterfaceRef(forwardedRef)
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
		} else {
			updateAppGlobalState(values)
			ref?.current?.close()
		}
	}

	const handleConfirmErrorMessage = () => {
		dbConnection.cleanAttempt()
	}

	const handleConfirmSuccessMessage = () => {
		ref?.current?.close()
	}

	const hasServerResponded = !!dbConnection.responseData
	return (
		<ModalWithMessage
			ref={ref}
			isInMessage={hasServerResponded}
			content={
				<ConfigForm
					variant='setup'
					availableDBTypes={availableDBTypes}
					handleClose={() => ref.current?.close()}
					onSubmit={handleSetup}
				/>
			}
			messageContent={
				<ConfigResponseModalMessage
					dbRequestError={dbConnection.responseData?.error}
					onConfirmErrorMessage={handleConfirmErrorMessage}
					onConfirmSuccessMessage={handleConfirmSuccessMessage}
				/>
			}
		/>
	)
})
