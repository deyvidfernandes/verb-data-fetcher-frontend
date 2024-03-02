import { forwardRef } from 'react'
import { ModalInterface } from '../../components/basic/modal/Modal'
import { useGlobalStateContext } from '@/util/globalState/GlobalStateContext'
import { ConfigForm } from '../forms/ConfigForm'
import { DBConfigValues } from '../forms/DBConfigValues'
import { useGetAvailableDBTypes } from '@/api/backend/useGetAvailableDBTypes'
import { useSetDatabaseConnection } from '@/api/backend/useSetDatabaseConnection'
import { ConfigResponseModalMessage } from './ConfigResponseModalMessage'
import { INITIAL_GLOBAL_STATE } from '@/util/globalState/INITIAL_GLOBAL_STATE'
import { ModalWithMessage } from '@/components/basic/modal/ModalWithMessage'
import { useModalInterfaceRef } from '@/components/basic/modal/useModalInterfaceRef'

export const ChangeConfigModal = forwardRef<ModalInterface, unknown>(function SetupModal(
	_,
	forwardedRef,
) {
	const processConfigState = useGlobalStateContext(
		(v) => v.appGlobalState.processConfiguration,
	)
	const dispatchGlobalAction = useGlobalStateContext((v) => v.dispatchGlobalAction)

	const dbConnection = useSetDatabaseConnection()
	const ref = useModalInterfaceRef(forwardedRef)
	const availableDBTypes = useGetAvailableDBTypes()?.map((type) => ({
		label: type,
		value: type,
	}))

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
		} else {
			updateAppGlobalState(values)
			ref.current?.close()
		}
	}

	const handleConfirmErrorMessage = () => {
		dbConnection.cleanAttempt()
	}

	const handleConfirmSuccessMessage = () => {
		ref.current?.close()
		dbConnection.cleanAttempt()
	}

	const hasServerResponded = !!dbConnection.responseData
	return (
		<ModalWithMessage
			ref={ref}
			isInMessage={hasServerResponded}
			content={
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
