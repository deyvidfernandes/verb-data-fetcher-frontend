import { Timer } from '@/util/fns'
import { FetchInfo } from '../fetchInfo'

export const fetchWord = async ({
	word,
}: { word: string }): Promise<FetchInfo<DictionaryAPIData[]> | false> => {
	const fetchTimer = new Timer()
	try {
		const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
		const responseTime = fetchTimer.getElapsedTime()
		if (res.ok) {
			const data = (await res.json()) as DictionaryAPIData[]
			return { data, responseTime, dataSize: JSON.stringify(data).length }
		}
	} catch (error) {
		return false
	}
	return false
}

export interface DictionaryAPIData {
	word: string
	phonetic: string
	phonetics: PhoneticData[]
	origin: string
	meanings?: Meanings[] | null
}

interface PhoneticData {
	text: string
	audio?: string | null
}

interface Meanings {
	partOfSpeech: string
	definitions?: Definitions[] | null
	synonyms?: string[] | [null]
	antonyms?: string[] | [null]
}

interface Definitions {
	definition: string
	example: string
	synonyms?: string[] | [null]
	antonyms?: string[] | [null]
}
