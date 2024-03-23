import Button from '@/components/basic/Button'
import { Table } from '@/components/basic/Table'
import { Tab } from '@/components/panel/Tab'
import { capitalize } from '@/util/fns'
import { useGlobalStateContext } from '@/util/globalState/GlobalStateContext'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { v4 as uuid } from 'uuid'
import { ListComponentArray } from '@/util/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const errorStatusIconMapper = {
	error: (
		<FontAwesomeIcon icon={faExclamationCircle} className='text-brandRed text-5xl' />
	),
	warning: (
		<FontAwesomeIcon icon={faExclamationCircle} className='text-brandRed text-5xl' />
	),
	corrected: (
		<FontAwesomeIcon icon={faCheckCircle} className='text-brandGreen text-5xl' />
	),
} as const

const headerNodes = ['Status', 'Verb', 'Error info', 'Go to'].map((header) => ({
	component: <p className='font-medium text-base'>{header}</p>,
	key: uuid(),
}))

export const ErrorsTab = () => {
	const dispatchGlobalAction = useGlobalStateContext((v) => v.dispatchGlobalAction)
	const processErrors = useGlobalStateContext((v) => v.appGlobalState.processState.errors)

	const errorRowNodesList = processErrors.map((error): ListComponentArray => {
		const nodeArray = [
			errorStatusIconMapper[error.status],

			`(Index: ${error.verbIndex}) ${capitalize(error.verbName)}`,

			error.info,

			<Button
				variant='orange'
				onClick={() => {
					dispatchGlobalAction({
						type: 'FOCUS_ON_VERB',
						payload: { verbID: error.verbId },
					})
				}}
			>
				<p className='text-base font-medium'>Go to the problem</p>
			</Button>,
		]

		const nodeArrayWithKeys = nodeArray.map((node, idx) => ({
			component: node,
			key: error.id + idx,
		}))

		return {
			key: error.id,
			components: nodeArrayWithKeys,
		}
	})

	return (
		<>
			<Tab>
				<div className='w-full flex flex-col gap-4'>
					<Table headers={headerNodes} data={errorRowNodesList} />
				</div>
			</Tab>
		</>
	)
}
