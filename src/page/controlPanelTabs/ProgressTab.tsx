import { ProgressBar } from '@/components/ProgressBar'
import { useGlobalStateContext } from '@/util/process/GlobalStateContext'
import { ProcessStatus } from '@/util/process/types'

const getStatusDisplayText = (processStatus: ProcessStatus) => {
	switch (processStatus) {
		case ProcessStatus.WAITING_SETUP:
			return 'Waiting for setup and start'
		case ProcessStatus.FETCHING:
			return 'Fetching and enriching verb data'
		case ProcessStatus.PAUSED:
			return 'Process paused by user, waiting authorization to resume'
		case ProcessStatus.IN_ERROR:
			return 'Error detected! Waiting authorization to resume'
		case ProcessStatus.WAITING_CONFIRMATION_TO_SAVE:
			return 'Waiting confirmation to save the data'
		case ProcessStatus.IN_COOLDOWN:
			return 'Excessive API requests, in cooldown'
		default:
			throw new Error()
	}
}

export const ProgressTab = () => {
	const processState = useGlobalStateContext((v) => v.appGlobalState.processState)

	const statusDisplayText = getStatusDisplayText(processState.status)
	const processProgress = processState.enrichedVerbsCount / processState.verbsQueued

	return (
		<div className='flex flex-col gap-2 px-4 py-2 '>
			<p id='statusDisplay' className='font-semibold'>
				Status: {statusDisplayText}
			</p>

			<ProgressBar progress={processProgress} />

			<div id='displays' className='flex flex-col content-start gap-x-8 flex-wrap h-12'>
				<p id='verbsEnrichedDisplay' className='text-sm'>
					<span className='font-medium'>Verbs enriched:</span>{' '}
					{processState.enrichedVerbsCount}
				</p>
				<p id='verbsInQueueDisplay' className='text-sm'>
					<span className='font-medium'>Verbs in queue:</span>{' '}
					{processState.verbsQueued - processState.enrichedVerbsCount}
				</p>
				<p id='estimatedTimeDisplay' className='text-sm'>
					<span className='font-medium'>Estimated time:</span>{' '}
					{processState.estimatedProcessRemainingTime}
				</p>
				<p id='totalFetchedDataDisplay' className='text-sm'>
					<span className='font-medium'>Total fetched data:</span>{' '}
					{processState.totalFetchedData}
				</p>
			</div>
		</div>
	)
}
