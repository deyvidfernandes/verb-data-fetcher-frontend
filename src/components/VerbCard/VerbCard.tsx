import { SectionRowList } from './SectionRowList'
import Button from '../basic/Button'
import editIcon from '@/assets/pen-to-square-solid.svg'
import linkIcon from '@/assets/arrow-up-right-from-square-solid.svg'
import { TextDisplay } from '../basic/TextDisplay'
import { EnrichedVerb, EnrichedVerbForm, Meaning } from './VerbDataTypes'
import Loading from 'react-loading'
import { tailwindTheme } from '@/tailwindTheme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { ProcessError } from '@/util/globalState/types'

export const VerbCard = (props: { verbData: EnrichedVerb; onEdit?: () => void }) => {
	const { meanings, infinitive, pastParticiple, phonetic, simplePast, usageIndex } =
		props.verbData.payload

	const { isEnriching, index, id, errors } = props.verbData.metadata

	const { onEdit } = props

	const hasError = !!errors.length
	const borderColorClassName = hasError ? 'border-brandRed' : 'border-brandOrange'
	const textColorClassName = hasError ? 'text-brandRed' : 'text-brandOrange'

	return (
		<div id={id}>
			<div
				className={`w-fit pr-2 flex gap-2 items-center rounded-t-lg 
				overflow-clip ${borderColorClassName} border-2 
				border-b-0`}
			>
				<Button square variant={hasError ? 'red' : 'orange'} onClick={onEdit}>
					<img src={editIcon} className='w-5' alt='edit icon' />
				</Button>
				<p className={`m-l-8 text-2xl ${textColorClassName} font-bold capitalize`}>
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
							content: (
								<DefinitionContainer isEnriching={isEnriching} meanings={meanings} />
							),
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
					variant={hasError ? 'red' : 'orange'}
				/>
			</div>
			{hasError && <ErrorWarning errors={errors} onEdit={onEdit} />}
		</div>
	)
}

const DefinitionContainer = (props: { meanings?: Meaning[][]; isEnriching: boolean }) => {
	return props.meanings ? (
		<DictionaryViewer meanings={props.meanings} />
	) : (
		props.isEnriching && (
			<div className=' h-full flex items-center justify-center'>
				<Loading color={tailwindTheme.colors.brandOrange} type='spin' />
			</div>
		)
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
			className='audio-anchor flex text-sm gap-1 items-center'
			aria-disabled={!url}
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
						<div key={meaning.id} className='text-sm list-decimal'>
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

interface ErrorWarningProps {
	errors: ProcessError[]
	onEdit?: () => void
}

const ErrorWarning = ({ errors, onEdit }: ErrorWarningProps) => {
	return (
		<div className=' bg-brandRed py-2 px-4 rounded-b-lg'>
			<div className='flex justify-between'>
				<div className='flex gap-4 items-center'>
					<FontAwesomeIcon icon={faExclamationCircle} color='white' size={'2xl'} />
					<p className='text-white text-lg'>Error - Missing data</p>
				</div>
				<div className='w-52'>
					<Button variant='orange' onClick={onEdit}>
						<p className='text-base font-medium'>Edit verb data</p>
					</Button>
				</div>
			</div>
			<div>
				{errors.map((error) => (
					<ul key={error.id} className='pl-12'>
						<li className='text-white list-disc text-base'>{error.info}</li>
					</ul>
				))}
			</div>
		</div>
	)
}
