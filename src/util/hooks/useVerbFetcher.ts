import { useEffect, useState } from 'react'
import { useGlobalStateContext } from '../globalState/GlobalStateContext'
import { RawVerb } from '../globalState/types'
import {
	EnrichedVerb,
	EnrichedVerbForm,
	Meaning,
} from '@/components/VerbCard/VerbDataTypes'
import { DictionaryAPIData, fetchWord } from '@/api/dictionary/fetchVerb'
import { Timer, arithmeticAverage, findPropInObjectArray } from '../fns'
import { fetchNgram } from '@/api/ngram/fetchNgram'
import { v4 as UUID4 } from 'uuid'
import { ControlledSessionStorage } from '../globalState/ControlledSessionStorage'

class VerbData implements EnrichedVerb {
	isEnriching: boolean
	infinitive: EnrichedVerbForm
	simplePast: EnrichedVerbForm
	pastParticiple: EnrichedVerbForm
	meanings?: Meaning[][] | undefined
	usageIndex?: number | undefined
	phonetic?: string | undefined
	index: number
	id: string

	constructor(init: {
		isEnriching: boolean
		simplePast: EnrichedVerbForm
		pastParticiple: EnrichedVerbForm
		infinitive: EnrichedVerbForm
		index: number
	}) {
		const { isEnriching, index, infinitive, pastParticiple, simplePast } = init
		this.isEnriching = isEnriching
		this.simplePast = simplePast
		this.pastParticiple = pastParticiple
		this.infinitive = infinitive
		this.id = UUID4()
		this.index = index
	}

	addUsageIndex(usageIndex: number) {
		this.usageIndex = usageIndex
	}

	async enrichWithDictionaryData(data: DictionaryAPIData[]) {
		const verifyAudio = async (word: string, uk?: boolean) => {
			try {
				const url = `https://api.dictionaryapi.dev/media/pronunciations/en/${word}-${
					uk ? 'uk' : 'us'
				}.mp3`
				if ((await fetch(url)).ok) {
					return url
				}
			} catch (error) {
				return
			}
		}

		const getAllVerbMeanings = (verbData: DictionaryAPIData[]): Meaning[][] => {
			const meaningAcc = []
			for (const def of verbData) {
				const meaningData = def.meanings?.filter(
					(meaning) => meaning.partOfSpeech === 'verb',
				)
				meaningData
				if (meaningData && meaningData?.length > 0)
					for (const meaning of meaningData) {
						const definitions = meaning.definitions?.map((def) => {
							const synonyms = (def.synonyms?.[0] ? def.synonyms : undefined) as
								| string[]
								| undefined
							const cleanedDef: Meaning = {
								definition: def.definition,
								example: def.example,
								synonyms,
							}
							return cleanedDef
						})
						if (definitions) meaningAcc.push(definitions)
					}
			}
			return meaningAcc
		}

		const { simplePast, pastParticiple, infinitive: _infinitive } = this
		const { wordUS: infinitive } = _infinitive
		const { wordUS: pastParticipleUS, wordUK: pastParticipleUK } = pastParticiple
		const { wordUS: simplePastUS, wordUK: simplePastUK } = simplePast
		const phoneticIndex = findPropInObjectArray(data, 'phonetic')
		const phonetic = data[phoneticIndex]?.phonetic

		const meanings = getAllVerbMeanings(data)

		const infinitiveAudioURL = await verifyAudio(infinitive)
		const simplePastAudioURL = await verifyAudio(simplePastUS)
		const pastParticipleAudioURL = await verifyAudio(pastParticipleUS)
		let simplePastUKAudioURL
		if (simplePastUK) simplePastUKAudioURL = await verifyAudio(simplePastUK, true)
		let pastParticipleUKAudioURL
		if (pastParticipleUK)
			pastParticipleUKAudioURL = await verifyAudio(pastParticipleUK, true)

		this.infinitive.audioUS = infinitiveAudioURL
		this.simplePast = {
			wordUS: simplePastUS,
			audioUS: simplePastAudioURL,
			wordUK: simplePastUK,
			audioUK: simplePastUKAudioURL,
		}
		this.pastParticiple = {
			wordUS: pastParticipleUS,
			audioUS: pastParticipleAudioURL,
			wordUK: pastParticipleUK,
			audioUK: pastParticipleUKAudioURL,
		}
		this.meanings = meanings
		this.phonetic = phonetic
	}

	async getPayloadLength() {
		const verbData: EnrichedVerb = {
			isEnriching: this.isEnriching,
			id: this.id,
			infinitive: this.infinitive,
			index: this.index,
			pastParticiple: this.pastParticiple,
			simplePast: this.simplePast,
			meanings: this.meanings,
			phonetic: this.phonetic,
			usageIndex: this.usageIndex,
		}
		return JSON.stringify(verbData).length
	}

	endEnrichment() {
		this.isEnriching = false
	}
}

export const useVerbFetcher = () => {
	const rawVerbData = useGlobalStateContext(
		(v) => v.appGlobalState.processConfiguration.dataSource?.rawVerbData,
	)
	const dispatchGlobalAction = useGlobalStateContext((v) => v.dispatchGlobalAction)
	const [enrichedVerbData, setEnrichedVerbData] = useState<EnrichedVerb[]>([])

	const addNewVerb = (verbData: EnrichedVerb) => {
		setEnrichedVerbData((prevVerbData) => [...prevVerbData, verbData])
	}

	const updateLastVerb = (verbData: EnrichedVerb) => {
		setEnrichedVerbData((prevVerbData) => [
			...prevVerbData.slice(0, prevVerbData.length - 1),
			structuredClone(verbData),
		])
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const fetchVerbData = async (rawVerbData: RawVerb[]) => {
			// const enrichWithDictionaryData = async (
			// 	verbData: EnrichedVerb,
			// 	data: DictionaryAPIData[],
			// ) => {
			// 	const { simplePast, pastParticiple, infinitive: _infinitive } = verbData
			// 	const { wordUS: infinitive } = _infinitive
			// 	const { wordUS: pastParticipleUS, wordUK: pastParticipleUK } = pastParticiple
			// 	const { wordUS: simplePastUS, wordUK: simplePastUK } = simplePast
			// 	const phoneticIndex = findPropInObjectArray(data, 'phonetic')
			// 	const phonetic = data[phoneticIndex]?.phonetic

			// 	const meanings = getAllVerbMeanings(data)

			// 	const infinitiveAudioURL = await verifyAudio(infinitive)
			// 	const simplePastAudioURL = await verifyAudio(simplePastUS)
			// 	const pastParticipleAudioURL = await verifyAudio(pastParticipleUS)
			// 	let simplePastUKAudioURL
			// 	if (simplePastUK) simplePastUKAudioURL = await verifyAudio(simplePastUK, true)
			// 	let pastParticipleUKAudioURL
			// 	if (pastParticipleUK)
			// 		pastParticipleUKAudioURL = await verifyAudio(pastParticipleUK, true)

			// 	verbData.infinitive.audioUS = infinitiveAudioURL
			// 	verbData.simplePast = {
			// 		wordUS: simplePastUS,
			// 		audioUS: simplePastAudioURL,
			// 		wordUK: simplePastUK,
			// 		audioUK: simplePastUKAudioURL,
			// 	}
			// 	verbData.pastParticiple = {
			// 		wordUS: pastParticipleUS,
			// 		audioUS: pastParticipleAudioURL,
			// 		wordUK: pastParticipleUK,
			// 		audioUK: pastParticipleUKAudioURL,
			// 	}
			// 	verbData.meanings = meanings
			// 	verbData.phonetic = phonetic
			// 	return verbData
			// }

			let index = 0
			for await (const verb of rawVerbData.slice(0, 30)) {
				const {
					infinitive,
					pastParticipleUK,
					pastParticipleUS,
					simplePastUK,
					simplePastUS,
				} = verb

				const verbDataInitializer: EnrichedVerb = {
					isEnriching: true,
					simplePast: {
						wordUS: simplePastUS,
						wordUK: simplePastUK,
					},
					pastParticiple: {
						wordUS: pastParticipleUS,
						wordUK: pastParticipleUK,
					},
					infinitive: {
						wordUS: infinitive,
					},
					id: UUID4(),
					index: index++,
				}
				const verbInEnrichment = new VerbData(verbDataInitializer)
				addNewVerb(verbInEnrichment)

				const enrichmentTimer = new Timer()

				const { timeseries: nGramDataParticiple } = await fetchNgram(pastParticipleUS)

				const { timeseries: nGramDataSimplePast } = await fetchNgram(simplePastUS)

				const averageUsageIndex = arithmeticAverage(
					arithmeticAverage(...nGramDataParticiple),
					arithmeticAverage(...nGramDataSimplePast),
				)
				verbInEnrichment.addUsageIndex(averageUsageIndex)
				updateLastVerb(verbInEnrichment)

				const dictionaryData = await fetchWord(infinitive)

				if (dictionaryData) {
					await verbInEnrichment.enrichWithDictionaryData(dictionaryData)
				}
				verbInEnrichment.endEnrichment()

				updateLastVerb(verbInEnrichment)
				const totalProcessingTime = enrichmentTimer.getElapsedTime()

				const delay = ControlledSessionStorage.getRequisitionDelay()
				await new Promise((resolve) => {
					setTimeout(resolve, delay)
				})


				dispatchGlobalAction({
					type: 'ADD_FETCHED_VERB',
					payload: {
						enrichmentDuration: totalProcessingTime,
						verbDataSize: await verbInEnrichment.getPayloadLength(),
					},
				})
			}
		}

		if (rawVerbData) fetchVerbData(rawVerbData)
	}, [rawVerbData, dispatchGlobalAction])

	return [enrichedVerbData]
}
