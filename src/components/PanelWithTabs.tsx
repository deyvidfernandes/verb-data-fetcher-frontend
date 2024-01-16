import { useState } from 'react'
import Panel from './Panel'
import PanelTab from '@/util/PanelTab'

type Props = {
	tabs: PanelTab[]
}

export const PanelWithTabs = (props: Props) => {
	const [currentTab, setCurrentTab] = useState(0)
	const { tabs } = props

	const handleChangeTab = (newTabID: number) => {
		setCurrentTab(newTabID)
	}

	const tabButtons = tabs.map((tab, index) => {
		const isSelected = currentTab === tab.id
		const isTheLastTab = index === tabs.length - 1

		return (
			<button
				key={tab.id}
				type='button'
				onClick={() => handleChangeTab(tab.id)}
				className={`
               h-full grid flex-1 items-center capitalize text-xl font-medium 
               ${isSelected ? 'bg-orange text-white' : 'text-[#FFB257]'} 
               border-orange ${isTheLastTab ? null : 'border-r-2'}
            `}
			>
				{tab.name}
			</button>
		)
	})

	return (
		<Panel header={<div className='h-full flex'>{tabButtons}</div>}>
			{tabs[currentTab].content}
		</Panel>
	)
}
