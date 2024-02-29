
export const fetchWord = async (word: string) => {
   try {		
		const res = await fetch(
			`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
		)
		if (res.ok) {
			return (await res.json()) as DictionaryAPIData[]
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
