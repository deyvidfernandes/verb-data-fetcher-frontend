import { PanelWithTabs } from '@/components/panel/PanelWithTabs'
import { tabs } from './content/controlPanelTabs/tabs'
import { GlobalStateProvider } from './util/globalState/GlobalStateContext'
import { ControlButton } from './content/ControlButton'
import { Section } from './components/basic/Section'
import { VerbFetcher } from './content/verbFetcher/VerbFetcher'
import { ControlledSessionStorage } from './util/sessionStorage/ControlledSessionStorage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

function App() {
	ControlledSessionStorage.init()

	return (
		<GlobalStateProvider>
			<div className="mx-auto max-w-6xl flex flex-col items-center gap-12 mb-12">

			<h1 className='mt-4 font-semibold text-5xl'>Verb Data Fetcher</h1>

			<Section title='Control Panel'>
				<PanelWithTabs tabs={tabs} />
				<ControlButton />
			</Section>

			<VerbFetcher />

			<Section title='About'>
				<p className='leading-7'>
					The Verb Data Fetcher is a tool designed to enrich data about irregular verbs in
					English. Users input a JSON file containing verbs in infinitive, simple past,
					and present perfect formats. The application utilizes the Free Dictionary API to
					obtain detailed definitions and the Google NGram API to determine the usage
					frequency of verbs.
				</p>
				<p className='leading-7'>
					After processing, the tool generates a new enriched JSON file, including
					dictionary definitions, English pronunciations for all forms, and usage
					frequencies. This enhanced file is then sent to the backend, where it undergoes
					analysis and is stored persistently as records in the database.
				</p>
				<p className='leading-7'>
					This tool was developed on a non-profit basis and is open under the MIT license.
					The generated data will be used to feed the Master of Tenses application, a
					final project for the Technical Systems Development course at ETEC.
				</p>
			</Section>
			</div>

			<footer className='flex flex-col justify-center items-center w-full gap-1 py-2 text-white text-lg bg-brandOrange border-orange-800 border-t'>
				<p>Deyvid Fernandes - 2023</p>
				<a href="https://github.com/deyvidfernandes/MasterOfTenses" target="_blank" rel='noreferrer' id="github-link"><FontAwesomeIcon icon={faGithub} size='2x' /></a>
			</footer>
		</GlobalStateProvider>
	)
}

export default App
