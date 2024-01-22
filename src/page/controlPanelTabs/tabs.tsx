import { DatabaseTab } from './DatabaseTab'
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
		content: <DatabaseTab/>,
	},
	{
		id: 2,
		name: 'Data sources',
		content: <p>ola3</p>,
	},
	{
		id: 3,
		name: 'Configuration',
		content: <p>ola4</p>,
	},
	{
		id: 4,
		name: 'Errors',
		content: <p>ola5</p>,
	},
]
