import { FetchInfo } from './fetchInfo'
import { GlobalAction } from '@/util/globalState/reducer'

export const useFetchMetrics = <T, P extends {}>(
	fn: (args: P) => Promise<FetchInfo<T> | false>,
	apiName: string,
	dispatchGlobalAction: React.Dispatch<GlobalAction>,
) => {
	const addFetchMetrics = (responseTime: number, dataSize: number) =>
		dispatchGlobalAction({
			type: 'REGISTER_PROD_METRIC',
			payload: { metricName: apiName, prodDuration: responseTime, dataSize },
		})

	const fetchAndLog = async (arg: P) => {
		const fetchInfo = await fn(arg)
		if (fetchInfo) {
			addFetchMetrics(fetchInfo.responseTime, fetchInfo.dataSize)
			return fetchInfo.data
		}
	}

	return fetchAndLog
}
