import { useEffect, useState } from 'react'
import { useGlobalStateContext } from '../../util/globalState/GlobalStateContext'
import { ProcessError, RawVerb } from '../../util/globalState/types'
import {
	EnrichedVerb,
	EnrichedVerbForm,
	Meaning,
} from '@/components/VerbCard/VerbDataTypes'
import { DictionaryAPIData, fetchWord } from '@/api/dictionary/fetchVerb'
import { Timer, arithmeticAverage, findPropInObjectArray } from '../../util/fns'
import { fetchNgram } from '@/api/ngram/fetchNgram'
import { v4 as UUID4 } from 'uuid'
import { ControlledSessionStorage } from '../../util/globalState/ControlledSessionStorage'

class VerbData implements EnrichedVerb {
	payload: {
		infinitive: EnrichedVerbForm
		simplePast: EnrichedVerbForm
		pastParticiple: EnrichedVerbForm
		meanings?: Meaning[][] | undefined
		usageIndex?: number | undefined
		phonetic?: string | undefined
	}
	metadata: { isEnriching: boolean; errors: ProcessError[]; id: string; index: number }

	constructor(init: {
		simplePast: EnrichedVerbForm
		pastParticiple: EnrichedVerbForm
		infinitive: EnrichedVerbForm
		index: number
	}) {
		const { index, infinitive, pastParticiple, simplePast } = init
		this.payload = {
			simplePast: simplePast,
			pastParticiple: pastParticiple,
			infinitive: infinitive,
		}
		this.metadata = {
			isEnriching: true,
			errors: [],
			id: UUID4(),
			index: index,
		}
	}

	addUsageIndex(usageIndex: number) {
		this.payload.usageIndex = usageIndex
	}

	addError(error: ProcessError) {
		this.metadata.errors.push(error)
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
								id: UUID4(),
							}
							return cleanedDef
						})
						if (definitions) meaningAcc.push(definitions)
					}
			}
			return meaningAcc
		}

		const { simplePast, pastParticiple, infinitive: _infinitive } = this.payload
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

		this.payload.infinitive.audioUS = infinitiveAudioURL
		this.payload.simplePast = {
			wordUS: simplePastUS,
			audioUS: simplePastAudioURL,
			wordUK: simplePastUK,
			audioUK: simplePastUKAudioURL,
		}
		this.payload.pastParticiple = {
			wordUS: pastParticipleUS,
			audioUS: pastParticipleAudioURL,
			wordUK: pastParticipleUK,
			audioUK: pastParticipleUKAudioURL,
		}
		this.payload.meanings = meanings
		this.payload.phonetic = phonetic
	}

	async getPayloadLength() {
		const verbData: EnrichedVerb = {
			metadata: this.metadata,
			payload: this.payload,
		}

		return JSON.stringify(verbData).length
	}

	endEnrichment() {
		this.metadata.isEnriching = false
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

	const changeVerbData = (id: string, newVerbData: EnrichedVerb) => {
		setEnrichedVerbData((prevVerbData) => {
			const verbData = [...prevVerbData]
			const editedVerbIndex = verbData.findIndex((vd) => vd.metadata.id === id)

			verbData[editedVerbIndex].payload = newVerbData.payload

			return verbData
		})
	}

	const addProcessError = (
		verbData: VerbData,
		description: string,
		status: 'warning' | 'error',
	) => {
		const error = {
			status,
			verbName: verbData.payload.infinitive.wordUS,
			verbIndex: verbData.metadata.index,
			info: description,
			verbId: verbData.metadata.id,
			id: UUID4(),
		}
		verbData.addError(error)
		dispatchGlobalAction({
			type: 'ADD_PROCESS_ERROR',
			payload: {
				processError: error,
			},
		})
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const fetchVerbData = async (rawVerbData: RawVerb[]) => {
			let index = 0
			for await (const verb of rawVerbData.slice(0, 12)) {
				const {
					infinitive,
					pastParticipleUK,
					pastParticipleUS,
					simplePastUK,
					simplePastUS,
				} = verb

				const verbDataInitializer = {
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
					index: index++,
					errors: [],
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
				} else {
					addProcessError(verbInEnrichment, 'No dictionary data available', 'error')
				}

				if (!verbInEnrichment.payload.phonetic) {
					addProcessError(verbInEnrichment, 'No phonetic data available', 'warning')
				}

				verbInEnrichment.endEnrichment()

				updateLastVerb(verbInEnrichment)
				const totalProcessingTime = enrichmentTimer.getElapsedTime()

				const delay = ControlledSessionStorage.getRequisitionDelayMill()
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

	return { enrichedVerbData, changeVerbData }
}
