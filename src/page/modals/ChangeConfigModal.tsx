import { RefObject, forwardRef, useCallback, useState } from 'react'
import { Modal, ModalInterface } from '../../components/basic/Modal'
import { useGlobalStateContext } from '@/util/globalState/GlobalStateContext'
import { SelectOption } from '../../components/basic/form/SelectField'
import { useFetchAvailableDBTypes } from '@/util/hooks/useFetchAvailableDBTypes'
import { ConfigForm } from '../forms/ConfigForm'
import { FormikHelpers } from 'formik'
import { ConfigValues } from '../forms/ConfigValues'

export const ChangeConfigModal = forwardRef(function SetupModal(_, ref) {
	const dispatchGlobalAction = useGlobalStateContext((v) => v.dispatchGlobalAction)
	const processConfigState = useGlobalStateContext((v) => ({
		...v.appGlobalState.processConfiguration,
	}))

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [availableDBTypes, setAvailableDBTypes] = useState<SelectOption[]>()

	const fetchAvailableDBTypesCallback = useCallback((types: string[]) => {
		setAvailableDBTypes(types.map((type) => ({ value: type, label: type })))
	}, [])

	useFetchAvailableDBTypes(fetchAvailableDBTypesCallback)

	const handleSetup = (values: ConfigValues, formikBag: FormikHelpers<ConfigValues>) => {
		dispatchGlobalAction({
			type: 'CHANGE_DATABASE_CONFIGURATION',
			payload: {
				database: {
					...values,
				},
				...values.outputMethod,
			},
		})
	}

	const typedRef = ref as RefObject<ModalInterface>
	return (
		<Modal
			ref={ref}
			onOpen={() => setIsModalOpen(true)}
			onClose={() => setIsModalOpen(false)}
		>
			{isModalOpen && <ConfigForm
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
			/>}
		</Modal>
	)
})
