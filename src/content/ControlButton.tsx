import Button from '@/components/basic/Button'
import { ModalInterface } from '@/components/basic/modal/Modal'
import { useGlobalStateContext } from '@/util/globalState/GlobalStateContext'
import { ProcessStatus } from '@/util/globalState/types'
import { RefObject } from 'react'
import lockIcon from '@/assets/lock-solid.svg'

interface Props {
	setupModalRef: RefObject<ModalInterface>
}

export const ControlButton = ({ setupModalRef }: Props) => {
	const status = useGlobalStateContext((v) => v.appGlobalState.processState.status)

	const handleSetup = () => {
		setupModalRef.current?.open()
	}

	const handleStop = () => {}

	const handleResume = () => {}

	const handleSave = () => {}

	switch (status) {
		case ProcessStatus.WAITING_SETUP:
			return (
				<Button variant='orange' onClick={handleSetup}>
					SETUP
				</Button>
			)
		case ProcessStatus.FETCHING:
			return (
				<Button variant='red' onClick={handleStop}>
					STOP
				</Button>
			)
		case ProcessStatus.PAUSED:
			return (
				<Button variant='green' onClick={handleResume}>
					Resume
				</Button>
			)
		case ProcessStatus.WAITING_CONFIRMATION_TO_SAVE:
			return (
				<Button variant='green' onClick={handleSave}>
					Save
				</Button>
			)
		case ProcessStatus.IN_COOLDOWN:
			return (
				<Button variant='blocked'>
					<div className='flex flex-row px-6 items-center'>
						<p className='font-medium text-base text-left leading-5'>
							Excessive API requests, cooldown needed
						</p>
						<img src={lockIcon} className='h-8' alt='Blocked icon' />
					</div>
				</Button>
			)
		default:
			throw new Error('Invalid process state')
	}
}
