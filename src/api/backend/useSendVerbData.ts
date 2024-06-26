import { useState } from 'react'
import { BACKEND_API_ADDRESS, ErrorResponse } from './metadata'
import { EnrichedVerb } from '@/components/VerbCard/VerbDataTypes'
import { fetchBackend } from './fetchBackend'
import { RequestResponse } from './useSetDatabaseConnection'

export const usePostVerbData = () => {
	const [responseData, setResponseData] = useState<RequestResponse>()

	const postVerbData = async (verbData: EnrichedVerb[]) => {
		const filtered = verbData.filter((verb) => verb.metadata.errors.length === 0)
		const convertedVerbData = filtered.map(convertEnrichedVerbToAPIFormat)

		console.log(convertedVerbData)
		const res = await fetchBackend<undefined>(`${BACKEND_API_ADDRESS}verb-data`, {
			method: 'POST',
			headers: new Headers({ 'content-type': 'application/json' }),
			body: JSON.stringify(convertedVerbData),
			attempts: 1,
		})
		if (!res.ok) {
			const errorData = res.data as ErrorResponse

			setResponseData({
				error: {
					message: errorData.message,
					exceptionMessage: errorData.exceptionMessage,
				},
			})
			return false
		}
		return true
	}

	return { postVerbData, responseData }
}

const convertEnrichedVerbToAPIFormat = (
	verbData: EnrichedVerb,
): EnrichedVerbAPIFormat => {
	const {
		payload: {
			infinitive: { wordUS, audioUS },
			simplePast: {
				wordUS: simplePastUS,
				audioUS: simplePastAudioUS,
				wordUK: simplePastUK,
				audioUK: simplePastAudioUK,
			},
			pastParticiple: {
				wordUS: participleUS,
				audioUS: participleAudioUS,
				wordUK: participleUK,
				audioUK: participleAudioUK,
			},
			usageIndex,
			meanings,
			phonetic,
		},
	} = verbData

	if (!usageIndex || !phonetic || !meanings) {
		throw new Error('Invalid verb data')
	}

	return {
		infinitive: wordUS,
		infinitiveAudio: audioUS,
		simplePast: simplePastUS,
		simplePastAudio: simplePastAudioUS,
		simplePastUK,
		simplePastUKAudio: simplePastAudioUK,
		participle: participleUS,
		participleAudio: participleAudioUS,
		participleUK,
		participleUKAudio: participleAudioUK,
		usageIndex,
		definitions: btoa(encodeURI(JSON.stringify(meanings))),
		phonetics: phonetic,
	}
}
//encodeURI(JSON.stringify(meanings))
interface EnrichedVerbAPIFormat {
	infinitive: string
	infinitiveAudio?: string
	simplePast: string
	simplePastAudio?: string
	simplePastUK?: string
	simplePastUKAudio?: string
	participle: string
	participleAudio?: string
	participleUK?: string
	participleUKAudio?: string
	usageIndex: number
	definitions: string
	phonetics: string
}
