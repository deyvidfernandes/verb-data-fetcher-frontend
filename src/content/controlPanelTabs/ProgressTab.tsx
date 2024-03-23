import { ProgressBar } from '@/components/basic/ProgressBar'
import { Tab } from '@/components/panel/Tab'
import { TextDisplay } from '@/components/basic/TextDisplay'
import { useGlobalStateContext } from '@/util/globalState/GlobalStateContext'
import { ProcessStatus } from '@/util/globalState/types'
import { arithmeticAverage, formatBytes } from '@/util/fns'
import { useEffect, useState } from 'react'
import { ControlledSessionStorage } from '@/util/sessionStorage/ControlledSessionStorage'

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
	const {
		enrichedVerbsCount,
		status,
		totalFetchedData,
		verbsQueued,
		lastEnrichmentDuration,
	} = useGlobalStateContext((v) => v.appGlobalState.processState)
	const [lastRemainingTime, setLastRemainingTime] = useState(0)
	const statusDisplayText = getStatusDisplayText(status)

	let processProgress
	if (enrichedVerbsCount && verbsQueued)
		processProgress = enrichedVerbsCount / verbsQueued
	else processProgress = 0
	const requisitionDelay = ControlledSessionStorage.getRequisitionDelayMill()
	let remainingTimeMillisec =
		(arithmeticAverage(...lastEnrichmentDuration) + requisitionDelay) *
		(verbsQueued - enrichedVerbsCount)
	if (lastRemainingTime)
		remainingTimeMillisec = (lastRemainingTime + remainingTimeMillisec) / 2

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setLastRemainingTime(remainingTimeMillisec)
	}, [lastEnrichmentDuration])

	console.log(lastEnrichmentDuration)

	const estimatedRemainingTime = new Date(remainingTimeMillisec)
		.toISOString()
		.substring(11, 19)

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
					value={enrichedVerbsCount}
				/>
				<TextDisplay
					id='verbsInQueueDisplay'
					label='Verbs in queue'
					value={verbsQueued - enrichedVerbsCount}
				/>
				<TextDisplay
					id='estimatedProcessRemainingTimeDisplay'
					label='Estimated remaining time'
					value={estimatedRemainingTime}
				/>
				<TextDisplay
					id='totalFetchedDataDisplay'
					label='Total fetched data'
					value={formatBytes(totalFetchedData)}
				/>
			</div>
		</Tab>
	)
}
