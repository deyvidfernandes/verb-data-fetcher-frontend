import { BACKEND_API_ADDRESS } from '../backend/metadata'
import { fetchBackend } from '../backend/fetchBackend'

export const fetchNgram = async (ngram: string) => {
	const res = await fetchBackend<NgramAPIData[]>(
		`${BACKEND_API_ADDRESS}ngram?ngram=${ngram}`,
		{
			attempts: 2,
			interval: 2000,
		},
	)
	if (res.ok) {
		return res.data[0] as NgramAPIData
	}
	throw new Error(JSON.stringify(res.data))
}

interface NgramAPIData {
	timeseries: number[]
}
