import { BACKEND_API_ADDRESS } from '../backend/metadata'
import { fetchBackend } from '../backend/fetchBackend'
import { Timer } from '@/util/fns'
import { FetchInfo } from '../fetchInfo'

export const fetchNgram = async ({
	ngram,
}: { ngram: string }): Promise<FetchInfo<NgramAPIData>> => {
	const fetchTimer = new Timer()
	const res = await fetchBackend<NgramAPIData[]>(
		`${BACKEND_API_ADDRESS}ngram?ngram=${ngram}`,
		{
			attempts: 4,
			interval: 3000,
		},
	)
	const responseTime = fetchTimer.getElapsedTime()
	if (res.ok) {
		const data = res.data[0] as NgramAPIData
		return { data, responseTime, dataSize: JSON.stringify(data).length }
	}
	throw new Error(JSON.stringify(res.data))
}

interface NgramAPIData {
	timeseries: number[]
}
