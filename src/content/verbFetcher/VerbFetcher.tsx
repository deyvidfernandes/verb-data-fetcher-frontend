import { Section } from '@/components/basic/Section'
import Panel from '@/components/panel/Panel'
import { VerbCard } from '@/components/VerbCard/VerbCard'
import { useVerbFetcher } from '@/content/verbFetcher/useVerbFetcher'
import { VerbDataEditorModal } from '../modals/VerbDataEditorModal'
import { useRerenderingOnceRef } from '@/util/hooks/useRenderingOnceRef'
import { ModalInterface } from '@/components/basic/modal/Modal'
import { EnrichedVerb } from '@/components/VerbCard/VerbDataTypes'
import { useState } from 'react'
import { PaginatedItems } from './PaginatedItems'
// import dummy from './dummy.json'
import { useVerbPaginationWithFocus } from './useVerbPaginationWithFocus'
import { useGlobalStateContext } from '@/util/globalState/GlobalStateContext'

// const dummyData = dummy as EnrichedVerb[]

const useErrorCorrector = () => {
	const [processErrors, dispatchGlobalAction] = useGlobalStateContext((v) => [
		v.appGlobalState.processState.errors,
		v.dispatchGlobalAction,
	])

	const correctErrors = (verbId: string) => {
		const errorsRelated = processErrors.filter((error) => error.verbId === verbId)
		if (errorsRelated) {
			for (const error of errorsRelated) {
				dispatchGlobalAction({
					type: 'CORRECT_PROCESS_ERROR',
					payload: {
						id: error.id,
					},
				})
			}
		}
	}

	return { correctErrors }
}

export const VerbFetcher = () => {
	const { enrichedVerbData, changeVerbData } = useVerbFetcher()
	const verbsPerPage = 5
	const { page, handlePageClick } = useVerbPaginationWithFocus(
		enrichedVerbData,
		verbsPerPage,
	)
	const { correctErrors } = useErrorCorrector()

	const [editingVerb, setEditingVerb] = useState<EnrichedVerb>()
	const ref = useRerenderingOnceRef<ModalInterface>()

	const handleEditVerb = (verbData: EnrichedVerb) => {
		setEditingVerb(verbData)
		ref.current?.open()
	}

	const handleSaveEditedVerbData = (data: EnrichedVerb) => {
		if (data.metadata.errors.length) {
			data.metadata.errors = []
			correctErrors(data.metadata.id)
		}
		changeVerbData(data.metadata.id, data)
	}

	return (
		<>
			<Section title='Preview' id='preview'>
				<Panel header=''>
					{enrichedVerbData[0] ? (
						<PaginatedItems<EnrichedVerb>
							itemsPerPage={verbsPerPage}
							page={page}
							items={enrichedVerbData}
							component={(verbData: EnrichedVerb) => {
								return (
									<VerbCard
										onEdit={() => handleEditVerb(verbData)}
										key={verbData.metadata.id}
										verbData={verbData}
									/>
								)
							}}
							onPageChange={handlePageClick}
						/>
					) : (
						<p className='flex items-center justify-center h-20 w-full font-medium text-orange-300 text-xl'>
							No data fetched yet
						</p>
					)}
				</Panel>
			</Section>
			<VerbDataEditorModal
				ref={ref}
				editingVerb={editingVerb}
				onSuccessfulSave={(editedData) => {
					handleSaveEditedVerbData(editedData)
				}}
			/>
		</>
	)
}
