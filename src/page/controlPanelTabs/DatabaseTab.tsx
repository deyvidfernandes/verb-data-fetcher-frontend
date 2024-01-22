import Button from '@/components/Button'
import { Tab } from '@/components/Tab'
import { TextDisplay } from '@/components/textDisplay'
import { useGlobalStateContext } from '@/util/process/GlobalStateContext'
import { AvailableDatabaseTypes } from '@/util/process/types'

interface notNullDatabaseConfig {
	type: AvailableDatabaseTypes
	url: string
	table: string
	user: string
	password: string
}

export const DatabaseTab = () => {
	const databaseConfig = useGlobalStateContext(
		(v) => v.appGlobalState.processConfiguration.database,
	)
	if (databaseConfig.type) {
		const typedDatabaseConfig = databaseConfig as notNullDatabaseConfig
		return (
			<Tab>
				<div className='flex flex-col content-start gap-x-8 flex-wrap h-16'>
					<TextDisplay label='Type' value={typedDatabaseConfig.type} />
					<TextDisplay label='URL' value={typedDatabaseConfig.url} />
					<TextDisplay label='Table' value={typedDatabaseConfig.table} />
					<TextDisplay label='User' value={typedDatabaseConfig.user} />
					<TextDisplay label='Password' value={typedDatabaseConfig.password} />
				</div>
				<Button variant='orange'>
					<p className='font-medium text-base capitalize'>Change configuration</p>
				</Button>
			</Tab>
		)
	}
	return (
		<div className='flex items-center justify-center p-8'>
			<p className='font-medium text-gray text-xl'>Waiting for setup...</p>
		</div>
	)
}
