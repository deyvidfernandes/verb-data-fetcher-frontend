import Button from '@/components/basic/Button'
import { ModalInterface } from '@/components/basic/Modal'
import { Tab } from '@/components/panel/Tab'
import { TextDisplay } from '@/components/basic/TextDisplay'
import { useRerenderingOnceRef } from '@/util/hooks/useRenderingOnceRef'
import { useGlobalStateContext } from '@/util/globalState/GlobalStateContext'
import { ChangeConfigModal } from '@/page/modals/ChangeConfigModal'

export const DatabaseTab = () => {
	const setupModalRef = useRerenderingOnceRef<ModalInterface>()

	const config = useGlobalStateContext((v) => ({
		database: v.appGlobalState.processConfiguration.database,
		persistData: v.appGlobalState.processConfiguration.persistData,
	}))

	const databaseConfig = config.database

	if (databaseConfig.type) {
		return (
			<>
				<ChangeConfigModal ref={setupModalRef} />
				<Tab>
					<div className='flex flex-col content-start gap-x-8 flex-wrap h-16'>
						<TextDisplay label='Type' value={databaseConfig.type} />
						<TextDisplay label='URL' value={databaseConfig.url} />
						<TextDisplay label='Table' value={databaseConfig.table} />
						<TextDisplay label='User' value={databaseConfig.user} />
						<TextDisplay label='Password' value={databaseConfig.password} />
					</div>
					<Button onClick={setupModalRef.current?.open} variant='orange'>
						<p className='font-medium text-base capitalize'>Change configuration</p>
					</Button>
				</Tab>
			</>
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
