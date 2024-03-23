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

// const dummyData = dummy as EnrichedVerb[]

export const VerbFetcher = () => {
	const { enrichedVerbData, changeVerbData } = useVerbFetcher()
	const verbsPerPage = 5
	const { page, handlePageClick } = useVerbPaginationWithFocus(
		enrichedVerbData,
		verbsPerPage,
	)

	const [editingVerb, setEditingVerb] = useState<EnrichedVerb>()
	const ref = useRerenderingOnceRef<ModalInterface>()

	const handleEditVerb = (verbData: EnrichedVerb) => {
		setEditingVerb(verbData)
		ref.current?.open()
	}

	const handleSaveEditedVerbData = (data: EnrichedVerb) => {
		changeVerbData(data.metadata.id, data)
	}

	return (
		<>
			<Section title='Preview' id='preview'>
				<Panel header='Search'>
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
				</Panel>
			</Section>
			<VerbDataEditorModal
				ref={ref}
				editingVerbData={editingVerb}
				onSuccessfulSave={(editedData) => {
					handleSaveEditedVerbData(editedData)
				}}
			/>
		</>
	)
}
