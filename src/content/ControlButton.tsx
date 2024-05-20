import Button from '@/components/basic/Button'
import { ModalInterface } from '@/components/basic/modal/Modal'
import { useGlobalStateContext } from '@/util/globalState/GlobalStateContext'
import { ProcessStatus } from '@/util/globalState/types'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { useRerenderingOnceRef } from '@/util/hooks/useRenderingOnceRef'
import { SetupModal } from './modals/config/SetupModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SaveConfirmationModal } from './modals/SaveConfirmationModal'

export const ControlButton = () => {
	const status = useGlobalStateContext((v) => v.appGlobalState.processState.status)
	const setupModalRef = useRerenderingOnceRef<ModalInterface>()
	const saveConfirmationModalRef = useRerenderingOnceRef<ModalInterface>()

	const handleSetup = () => {
		setupModalRef.current?.open()
	}

	const handleStop = () => {}

	const handleResume = () => {}

	const handleSave = () => {
		saveConfirmationModalRef.current?.open()
	}

	let controlButton

	switch (status) {
		case ProcessStatus.WAITING_SETUP:
			controlButton = (
				<Button variant='orange' onClick={handleSetup}>
					SETUP
				</Button>
			)
			break
		case ProcessStatus.FETCHING:
			controlButton = (
				<Button variant='red' onClick={handleStop}>
					STOP
				</Button>
			)
			break
		case ProcessStatus.PAUSED:
			controlButton = (
				<Button variant='green' onClick={handleResume}>
					Resume
				</Button>
			)
			break
		case ProcessStatus.WAITING_CONFIRMATION_TO_SAVE:
			controlButton = (
				<Button variant='green' onClick={handleSave}>
					Save
				</Button>
			)
			break
		case ProcessStatus.IN_COOLDOWN:
			controlButton = (
				<Button variant='blocked'>
					<div className='flex flex-row px-6 items-center'>
						<p className='font-medium text-base text-left leading-5'>
							Excessive API requests, cooldown needed
						</p>
						<FontAwesomeIcon icon={faLock} className='h-8' />
					</div>
				</Button>
			)
			break
		default:
			throw new Error('Invalid process state')
	}

	return (
		<>
			<SetupModal ref={setupModalRef} />
			<SaveConfirmationModal ref={saveConfirmationModalRef} />
			{controlButton}
		</>
	)
}
