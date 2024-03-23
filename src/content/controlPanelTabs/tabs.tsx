import { ConfigurationTab } from './ConfigurationTab'
import { DataSourcesTab } from './DataSourcesTab'
import { DatabaseTab } from './DatabaseTab'
import { ErrorsTab } from './ErrorsTab'
import { ProgressTab } from './ProgressTab'

export const tabs = [
	{
		id: 0,
		name: 'progress',
		content: <ProgressTab />,
	},
	{
		id: 1,
		name: 'Database',
		content: <DatabaseTab />,
	},
	{
		id: 2,
		name: 'Data sources',
		content: <DataSourcesTab />,
	},
	{
		id: 3,
		name: 'Configuration',
		content: <ConfigurationTab />,
	},
	{
		id: 4,
		name: 'Errors',
		content: <ErrorsTab />,
	},
]
