import { RefObject, forwardRef, useCallback, useState } from 'react'
import { Modal, ModalInterface } from '../../components/basic/Modal'
import { useGlobalStateContext } from '@/util/globalState/GlobalStateContext'
import { SelectOption } from '../../components/basic/form/SelectField'
import { useFetchAvailableDBTypes } from '@/util/hooks/useFetchAvailableDBTypes'
import { ConfigForm } from '../forms/ConfigForm'
import { FormikHelpers } from 'formik'
import { ProcessStatus, RawVerb } from '@/util/globalState/types'
import { ConfigValues } from '../forms/ConfigValues'
import { INITIAL_GLOBAL_STATE } from '@/util/globalState/INITIAL_GLOBAL_STATE'

export const SetupModal = forwardRef(function SetupModal(_, ref) {
	const dispatchGlobalAction = useGlobalStateContext((v) => v.dispatchGlobalAction)

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [availableDBTypes, setAvailableDBTypes] = useState<SelectOption[]>()

	const fetchAvailableDBTypesCallback = useCallback((types: string[]) => {
		setAvailableDBTypes(types.map((type) => ({ value: type, label: type })))
	}, [])

	useFetchAvailableDBTypes(fetchAvailableDBTypesCallback)

	const typedRef = ref as RefObject<ModalInterface>

	const handleSetup = (values: ConfigValues, formikBag: FormikHelpers<ConfigValues>) => {
		const setup = async () => {
			if (!values.baseDataFile) throw new Error()
			const rawVerbData: RawVerb[] = JSON.parse(await values.baseDataFile?.text())
			if (values.outputMethod.persistData) {
				dispatchGlobalAction({
					type: 'SETUP_PROCESS',
					payload: {
						database: {
							...values,
						},
						rawVerbData: rawVerbData,
						...values.outputMethod,
					},
				})
			} else {
				dispatchGlobalAction({
					type: 'SETUP_PROCESS',
					payload: {
						database: {
							...INITIAL_GLOBAL_STATE.processConfiguration.database,
						},
						rawVerbData: rawVerbData,
						...values.outputMethod,
					},
				})
			}
			dispatchGlobalAction({
				type: 'CHANGE_STATUS',
				payload: {
					status: ProcessStatus.FETCHING
				}
			})
		}

		setup()
	}
	return (
		<Modal
			onOpen={() => setIsModalOpen(true)}
			onClose={() => setIsModalOpen(false)}
			ref={ref}
		>
			{isModalOpen && (
				<ConfigForm
					variant='setup'
					availableDBTypes={availableDBTypes}
					handleClose={() => typedRef.current?.close()}
					onSubmit={handleSetup}
				/>
			)}
		</Modal>
	)
})
