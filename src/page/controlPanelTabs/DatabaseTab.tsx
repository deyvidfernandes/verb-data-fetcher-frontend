import { Tab } from '@/components/panel/Tab'
import { TextDisplay } from '@/components/basic/TextDisplay'
import { useGlobalStateContext } from '@/util/globalState/GlobalStateContext'

export const DatabaseTab = () => {

	const config = useGlobalStateContext((v) => ({
		database: v.appGlobalState.processConfiguration.database,
		persistData: v.appGlobalState.processConfiguration.persistData,
	}))

	const databaseConfig = config.database

	if (databaseConfig.type) {
		return (
			<Tab>
				<div className='flex flex-col content-start gap-x-8 flex-wrap h-16'>
					<TextDisplay label='Type' value={databaseConfig.type} />
					<TextDisplay label='URL' value={databaseConfig.url} />
					<TextDisplay label='Table' value={databaseConfig.table} />
					<TextDisplay label='User' value={databaseConfig.user} />
					<TextDisplay label='Password' value={databaseConfig.password} />
				</div>
			</Tab>
		)
	}
	return (
		<div className='flex items-center justify-center p-8'>
			<p className='font-medium text-gray-300 text-xl'>
				{config.persistData
					? 'Waiting for setup...'
					: 'Only "Output JSON" output method was selected'}
			</p>
		</div>
	)
}
