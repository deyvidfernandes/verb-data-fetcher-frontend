import { ProcessError } from "@/util/globalState/types"

export interface Meaning {
	definition: string
	synonyms?: string[]
	example?: string
	id: string
}
;[]

export interface EnrichedVerb {
	isEnriching: boolean
	infinitive: EnrichedVerbForm
	simplePast: EnrichedVerbForm
	pastParticiple: EnrichedVerbForm
	meanings?: Meaning[][]
	usageIndex?: number
	phonetic?: string
	errors: ProcessError[]
	id: string
	index: number
}
export interface EnrichedVerbForm {
	wordUS: string
	audioUS?: string
	wordUK?: string
	audioUK?: string
}
