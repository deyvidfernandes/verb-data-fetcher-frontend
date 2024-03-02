import { Section } from '@/components/basic/Section'
import Panel from '@/components/panel/Panel'
import { VerbCard } from '@/components/VerbCard/VerbCard'
import { useVerbFetcher } from '@/util/hooks/useVerbFetcher'

// const testData = [
// 	{
// 		infinitive: 'arise',
// 		simplePastUS: 'arose',
// 		pastParticipleUS: 'arisen',
// 	},
// 	{
// 		infinitive: 'awake',
// 		simplePastUS: 'awakened',
// 		pastParticipleUS: 'awakened',
// 		simplePastUK: 'awoke',
// 		pastParticipleUK: 'awoken',
// 	},
// 	{
// 		infinitive: 'backslide',
// 		simplePastUS: 'backslid',
// 		pastParticipleUS: 'backslidden',
// 		simplePastUK: 'backslid',
// 		pastParticipleUK: 'backslid',
// 	},
// 	{
// 		infinitive: 'be',
// 		simplePastUS: 'was',
// 		pastParticipleUS: 'been',
// 		simplePastUK: 'were',
// 		pastParticipleUK: 'been',
// 	},
// 	{
// 		infinitive: 'bear',
// 		simplePastUS: 'bore',
// 		pastParticipleUS: 'born',
// 		simplePastUK: 'bore',
// 		pastParticipleUK: 'borne',
// 	},
// 	{
// 		infinitive: 'beat',
// 		simplePastUS: 'beat',
// 		pastParticipleUS: 'beaten',
// 		simplePastUK: 'beat',
// 		pastParticipleUK: 'beat',
// 	},
// 	{
// 		infinitive: 'begin',
// 		simplePastUS: 'began',
// 		pastParticipleUS: 'begun',
// 	},
// 	{ infinitive: 'bend', simplePastUS: 'bent', pastParticipleUS: 'bent' },
// 	{
// 		infinitive: 'bet',
// 		simplePastUS: 'bet',
// 		pastParticipleUS: 'bet',
// 		simplePastUK: 'betted',
// 		pastParticipleUK: 'betted',
// 	},
// 	{
// 		infinitive: 'bind',
// 		simplePastUS: 'bound',
// 		pastParticipleUS: 'bound',
// 	},
// ]

export const VerbFetcher = () => {
	const [enrichedVerbData] = useVerbFetcher()

	return (
		<Section title='Preview'>
			<Panel header='Search'>
				<div className='flex flex-col gap-8 px-6 py-8'>
					{enrichedVerbData.map((verbData) => {
						return <VerbCard key={verbData.id} verbData={verbData} />
					})}
				</div>
			</Panel>
		</Section>
	)
}

/* https://books.google.com/ngrams/json?content=have&year_start=2005&year_end=2019&case_insensitive=on&corpus=en-2019&smoothing=0*/
