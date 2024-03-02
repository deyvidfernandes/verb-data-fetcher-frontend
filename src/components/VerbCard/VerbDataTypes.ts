export interface Meaning {
	definition: string
	synonyms?: string[]
	example: string
}
;[]

export interface EnrichedVerb {
	infinitive: EnrichedVerbForm
	simplePast: EnrichedVerbForm
	pastParticiple: EnrichedVerbForm
	meanings?: Meaning[][]
	usageIndex?: number
	phonetic?: string
	id: string
	index: number
}
export interface EnrichedVerbForm {
	wordUS: string
	audioUS?: string
	wordUK?: string
	audioUK?: string
}
