import { Tab } from '@/components/panel/Tab'
import { useGlobalStateContext } from '@/util/globalState/GlobalStateContext'
import Button from '@/components/basic/Button'
import { ChangeConfigModal } from '../modals/ChangeConfigModal'
import { useRerenderingOnceRef } from '@/util/hooks/useRenderingOnceRef'
import { ModalInterface } from '@/components/basic/modal/Modal'
import { RangeInput } from '@/components/basic/RangeInput/RangeInput'
import { ChangeEventHandler } from 'react'
import { ProcessStatus } from '@/util/globalState/types'

export const ConfigurationTab = () => {
	const requisitionDelay = useGlobalStateContext(
		(v) => v.appGlobalState.processConfiguration.delay,
	)
	const processState = useGlobalStateContext((v) => v.appGlobalState.processState.status)
	const dispatchGlobalAction = useGlobalStateContext((v) => v.dispatchGlobalAction)
	const setupModalRef = useRerenderingOnceRef<ModalInterface>()

	const handleDelayChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		dispatchGlobalAction({
			type: 'CHANGE_REQUISITION_DELAY',
			payload: {
				delay: Number(e.target.value),
			},
		})
	}
	return (
		<>
			<ChangeConfigModal ref={setupModalRef} />
			<Tab>
				<div className='flex flex-col gap-4 w-80'>
					<RangeInput
						id='delay'
						label='Requisition delay:'
						min={3}
						max={10}
						step={0.5}
						value={requisitionDelay}
						onChange={handleDelayChange}
					/>
					{processState !== ProcessStatus.WAITING_SETUP && (
						<Button onClick={setupModalRef.current?.open} variant='orange'>
							<p className='font-medium text-base capitalize'>
								Change output configuration
							</p>
						</Button>
					)}
				</div>
			</Tab>
		</>
	)
}
