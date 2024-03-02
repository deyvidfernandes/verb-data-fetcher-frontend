import { SectionRowList } from './SectionRowList'
import Button from '../basic/Button'
import editIcon from '@/assets/pen-to-square-solid.svg'
import linkIcon from '@/assets/arrow-up-right-from-square-solid.svg'
import { TextDisplay } from '../basic/TextDisplay'
import { v4 as UUIDv4 } from 'uuid'
import { EnrichedVerb, EnrichedVerbForm, Meaning } from './VerbDataTypes'

export const VerbCard = (props: { verbData: EnrichedVerb }) => {
	const {
		meanings,
		id,
		index,
		infinitive,
		pastParticiple,
		phonetic,
		simplePast,
		usageIndex,
	} = props.verbData
	return (
		<div>
			<div
				className='w-fit pr-2 flex gap-2 items-center rounded-t-lg 
				overflow-clip border-brandOrange border-2 
				border-b-0'
			>
				<Button square variant='orange'>
					<img src={editIcon} className='w-5' alt='edit icon' />
				</Button>
				<p className='m-l-8 text-2xl text-brandOrange font-bold capitalize'>
					{index + 1}. {infinitive.wordUS}
				</p>
			</div>
			<div>
				<SectionRowList
					sections={[
						{
							id: 1,
							title: 'Tenses',
							content: (
								<div className='max-h-full flex flex-col gap-1'>
									<VerbFormDisplay label='infinitive' verb={infinitive} />
									<VerbFormDisplay label='Simple Past' verb={simplePast} />
									<VerbFormDisplay label='Past participle' verb={pastParticiple} />
								</div>
							),
						},
						{
							id: 2,
							title: 'Definition',
							flex: 2,
							content: meanings && <DictionaryViewer meanings={meanings} />,
						},
						{
							id: 3,
							title: 'Misc',
							content: (
								<div className='h-full'>
									<TextDisplay label='Phonetics' value={phonetic} />
									<TextDisplay label='Usage Index' value={usageIndex} />
								</div>
							),
						},
					]}
				/>
			</div>
		</div>
	)
}

const VerbFormDisplay = ({ label, verb }: { label: string; verb: EnrichedVerbForm }) => {
	return (
		<div className='flex flex-col'>
			<TextDisplay label={label} value={verb.wordUS} />
			<AudioAnchor url={verb.audioUS} />
		</div>
	)
}

const AudioAnchor = ({ url }: { url?: string }) => {
	return (
		<a
			href={url}
			target='_blank'
			rel='noreferrer'
			className='flex text-sm gap-1 items-center'
			aria-disabled={!!url}
		>
			<p>Audio</p>
			<img src={linkIcon} alt='link icon' className='h-3' />
		</a>
	)
}

const DictionaryViewer = (props: { meanings: Meaning[][] }) => {
	const { meanings } = props
	return (
		<ol className='flex flex-col gap-2 pl-2'>
			{meanings.map((meaningGroup) =>
				meaningGroup.map((meaning) => {
					const { definition, example } = meaning
					let synonyms
					if (meaning.synonyms) {
						synonyms = meaning.synonyms.join(', ')
					}

					return (
						<div key={UUIDv4()} className='text-sm list-decimal'>
							<li className='ml-4'>
								<p className='font-medium'>{definition}</p>
								{example && (
									<p className='text-gray-700'>
										<span className='font-semibold'>Example:</span> "{example}"
									</p>
								)}
								{synonyms && (
									<p>
										<span className='font-semibold'>Synonyms: </span>
										{synonyms}.
									</p>
								)}
							</li>
						</div>
					)
				}),
			)}
		</ol>
	)
}
