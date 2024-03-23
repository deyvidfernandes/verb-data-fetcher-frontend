import { ProcessError } from '@/util/globalState/types'

export interface Meaning {
	definition: string
	synonyms?: string[]
	example?: string
	id: string
}
;[]

export interface EnrichedVerb {
	metadata: {
		isEnriching: boolean
		errors: ProcessError[]
		id: string
		index: number
	}
	payload: {
		infinitive: EnrichedVerbForm
		simplePast: EnrichedVerbForm
		pastParticiple: EnrichedVerbForm
		meanings?: Meaning[][]
		usageIndex?: number
		phonetic?: string
	}
}
export interface EnrichedVerbForm {
	wordUS: string
	audioUS?: string
	wordUK?: string
	audioUK?: string
}
