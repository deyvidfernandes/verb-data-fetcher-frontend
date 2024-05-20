import { PanelWithTabs } from '@/components/panel/PanelWithTabs'
import { tabs } from './content/controlPanelTabs/tabs'
import { GlobalStateProvider } from './util/globalState/GlobalStateContext'
import { ControlButton } from './content/ControlButton'
import { Section } from './components/basic/Section'
import { VerbFetcher } from './content/verbFetcher/VerbFetcher'
import { ControlledSessionStorage } from './util/sessionStorage/ControlledSessionStorage'

function App() {
	ControlledSessionStorage.init()

	return (
		<GlobalStateProvider>
			<h1 className='mt-4 font-semibold text-5xl'>Verb Data Fetcher</h1>

			<Section title='Control Panel'>
				<PanelWithTabs tabs={tabs} />
				<ControlButton />
			</Section>

			<VerbFetcher />

			<Section title='About'>
				<p>
					The Verb Data Fetcher is a tool designed to enrich data about irregular verbs in
					English. Users input a JSON file containing verbs in infinitive, simple past,
					and present perfect formats. The application utilizes the Free Dictionary API to
					obtain detailed definitions and the Google NGram API to determine the usage
					frequency of verbs.
				</p>
				<p>
					After processing, the tool generates a new enriched JSON file, including
					dictionary definitions, English pronunciations for all forms, and usage
					frequencies. This enhanced file is then sent to the backend, where it undergoes
					analysis and is stored persistently as records in the database.
				</p>
				<p>
					This tool was developed on a non-profit basis and is open under the MIT license.
					The generated data will be used to feed the Master of Tenses application, a
					final project for the Technical Systems Development course at ETEC.
				</p>
			</Section>

			<footer>
				<p>Deyvid Fernandes - 2022</p>
			</footer>
		</GlobalStateProvider>
	)
}

export default App
