import { ErrorResponse } from './metadata'
import { BACKEND_API_ADDRESS } from './metadata'
import { useGlobalStateContext } from '@/util/globalState/GlobalStateContext'
import { INITIAL_GLOBAL_STATE } from '@/util/globalState/INITIAL_GLOBAL_STATE'
import { ProcessStatus, RawVerb } from '@/util/globalState/types'
import { useState } from 'react'
import { DBConfigValues } from '../../content/forms/DBConfigValues'

export const useSetDatabaseConnection = () => {
	const dispatchGlobalAction = useGlobalStateContext((v) => v.dispatchGlobalAction)

	const [dbRequestError, setDBRequestError] = useState<DBConfigRequestError>()
	const [hasServerResponded, setHasServerResponded] = useState(false)

	const tryDatabaseConnection = async (
		values: DBConfigValues,
		changingConfig?: boolean,
	) => {
		const postDBConfig = async () => {
			const { url, type, name } = values
			const body = {
				table: values.table,
				password: values.password,
				username: values.user,
				url: `${url}/${name}`,
				type: type.toUpperCase(),
			}

			return await fetch(`${BACKEND_API_ADDRESS}database/setup`, {
				method: 'POST',
				headers: new Headers({ 'content-type': 'application/json' }),
				body: JSON.stringify(body),
			})
		}

		const handleResponse = async (res: Response) => {
			const { baseDataFile, outputMethod } = values

			const updateAppGlobalState = async () => {
				if (changingConfig) {
					dispatchGlobalAction({
						type: 'CHANGE_DATABASE_CONFIGURATION',
						payload: {
							database: {
								...values,
							},
							...outputMethod,
						},
					})
					return
				}

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
							fileSize: baseDataFile.size
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

			const handleErrorResponse = async (res: Response) => {
				const errorData: ErrorResponse = await res.json()
				setDBRequestError({
					message: errorData.message,
					exceptionMessage: errorData.exceptionMessage,
				})
			}

			setHasServerResponded(true)
			if (!res.ok) {
				handleErrorResponse(res)
				return
			}
			updateAppGlobalState()
		}

		const configRequestResponse = await postDBConfig()
		handleResponse(configRequestResponse)
	}

	const cleanConnectionAttempt = () => {
		setDBRequestError(undefined)
		setHasServerResponded(false)
	}

	const initialDBConfigValues = INITIAL_GLOBAL_STATE.processConfiguration.database

	return {
		tryDatabaseConnection,
		cleanConnectionAttempt,
		hasServerResponded,
		dbRequestError,
	}
}

export interface DBConfigRequestError {
	message: string
	exceptionMessage: string
}
