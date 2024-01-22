import { ProgressBar } from '@/components/ProgressBar'
import { Tab } from '@/components/Tab'
import { TextDisplay } from '@/components/textDisplay'
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
		<Tab>
			<p id='statusDisplay' className='font-semibold'>
				Status: {statusDisplayText}
			</p>

			<ProgressBar progress={processProgress} />

			<div id='displays' className='flex flex-col content-start gap-x-8 flex-wrap h-12'>
				<TextDisplay
					id='verbsEnrichedDisplay'
					label='Verbs enriched'
					value={processState.enrichedVerbsCount}
				/>
				<TextDisplay
					id='verbsInQueueDisplay'
					label='Verbs in queue'
					value={processState.verbsQueued - processState.enrichedVerbsCount}
				/>
				<TextDisplay
					id='estimatedProcessRemainingTimeDisplay'
					label='Estimated remaining time'
					value={processState.estimatedProcessRemainingTime}
				/>
				<TextDisplay
					id='totalFetchedDataDisplay'
					label='Total fetched data'
					value={processState.totalFetchedData}
				/>
			</div>
		</Tab>
	)
}
