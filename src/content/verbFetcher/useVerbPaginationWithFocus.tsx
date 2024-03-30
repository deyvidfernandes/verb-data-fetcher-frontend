import { EnrichedVerb } from '@/components/VerbCard/VerbDataTypes'
import { useEffect, useState } from 'react'
import { useGlobalStateContext } from '@/util/globalState/GlobalStateContext'
import { scrollToElement } from '@/util/fns'

export const useVerbPaginationWithFocus = (
	enrichedVerbData: EnrichedVerb[],
	verbsPerPage: number,
) => {
	const [verbOnFocus, dispatchGlobalAction] = useGlobalStateContext((state) => [
		state.appGlobalState.UIState.verbOnFocus,
		state.dispatchGlobalAction,
	])
	const [page, setPage] = useState<number>(0)

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const verb = enrichedVerbData.find((verb) => verb.metadata.id === verbOnFocus)
		if (!verb) return console.error('Verb to focus not found')
		setPage(Math.ceil((verb.metadata.index + 1) / verbsPerPage) - 1)
		setTimeout(() => scrollToElement(verb.metadata.id), 20)
		dispatchGlobalAction({ type: 'FOCUS_ON_VERB', payload: { verbID: '' } })
	}, [verbOnFocus])

	const handlePageClick = ({ selected }: { selected: number }) => {
		scrollToElement('preview')
		setPage(selected)
	}

	return { page, handlePageClick }
}
