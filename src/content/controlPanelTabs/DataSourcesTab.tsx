import { TextDisplay } from '@/components/basic/TextDisplay'
import { Tab } from '@/components/panel/Tab'
import { arithmeticAverage, formatBytes } from '@/util/fns'
import { useGlobalStateContext } from '@/util/globalState/GlobalStateContext'
import { ReactNode } from 'react'

export const DataSourcesTab = () => {
	const baseDataSource = useGlobalStateContext(
		(v) => v.appGlobalState.processConfiguration.dataSource,
	)
	const dataProductionMetrics = useGlobalStateContext(
		(v) => v.appGlobalState.processState.dataProductionMetrics,
	)

	const ngramAPIAnchorElement = (
		<a
			href='https://books.google.com/ngrams/graph?content=verb'
			target='_blank'
			rel='noreferrer'
		>
			https://books.google.com/ngrams/
		</a>
	)

	const dictionaryAPIAnchorElement = (
		<a href='https://dictionaryapi.dev' target='_blank' rel='noreferrer'>
			https://api.dictionaryapi.dev/api/
		</a>
	)

	const baseDataSourceSubInfo = baseDataSource && [
		{
			id: '1',
			label: 'File size',
			value: formatBytes(baseDataSource.fileSize),
		},
	]

	console.log(dataProductionMetrics)
	const dictionaryAPIMetrics = dataProductionMetrics.get('dictionary')
	const dictionaryProdAvgDuration = dictionaryAPIMetrics
		? `${(arithmeticAverage(...dictionaryAPIMetrics.prodDuration) / 1000).toFixed(3)}s`
		: 'N/A'
	const ngramAPIMetrics = dataProductionMetrics.get('ngram')
	const ngramProdAvgDuration = ngramAPIMetrics
		? `${(arithmeticAverage(...ngramAPIMetrics.prodDuration) / 1000).toFixed(3)}s`
		: 'N/A'

	return (
		<Tab>
			<div className='flex flex-col content-start'>
				{baseDataSource && (
					<>
						<DataSourceDisplay
							label='Base data source'
							value={baseDataSource.fileName}
							// biome-ignore lint/style/noNonNullAssertion: <the info null case follows the same rule as this element render>
							subInfo={baseDataSourceSubInfo!}
						/>
					</>
				)}
				<DataSourceDisplay
					label='Enrichment data source 1 (dictionary API)'
					value={dictionaryAPIAnchorElement}
					subInfo={[
						{ id: '1', label: 'Average response time', value: dictionaryProdAvgDuration },
						{
							id: '2',
							label: 'Total data fetched',
							value: formatBytes(dictionaryAPIMetrics?.dataSize || 0),
						},
					]}
				/>
				<DataSourceDisplay
					label='Enrichment data source 2 (Ngram API)'
					value={ngramAPIAnchorElement}
					subInfo={[
						{ id: '1', label: 'Average response time', value: ngramProdAvgDuration },
						{
							id: '2',
							label: 'Total data fetched',
							value: formatBytes(ngramAPIMetrics?.dataSize || 0),
						},
					]}
				/>
			</div>
		</Tab>
	)
}

interface Props {
	label: string
	value: string | ReactNode
	subInfo: {
		id: string
		label: string
		value: string | number
	}[]
}

const DataSourceDisplay = ({ label: name, value, subInfo }: Props) => {
	return (
		<div>
			<TextDisplay label={name} value={value} bigger />
			<div className='pl-4'>
				{subInfo.map((info) => (
					<TextDisplay key={info.id} {...info} variant='gray' />
				))}
			</div>
		</div>
	)
}
