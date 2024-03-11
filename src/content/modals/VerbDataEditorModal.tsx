import CodeEditor from '@uiw/react-textarea-code-editor'
import { EnrichedVerb } from '@/components/VerbCard/VerbDataTypes'
import { ModalInterface } from '@/components/basic/modal/Modal'
import { ModalWithMessage } from '@/components/basic/modal/ModalWithMessage'
import { useModalInterfaceRef } from '@/components/basic/modal/useModalInterfaceRef'
import { forwardRef, useState } from 'react'
import Button from '@/components/basic/Button'
import { EnrichedVerb as EnrichedVerbTI } from '@/components/VerbCard/VerbDataTypes-ti'
import { createCheckers } from 'ts-interface-checker'
import { ModalMessage } from '@/components/basic/modal/ModalMessage'

interface VerbDataEditorModalProps {
	editingVerbData?: EnrichedVerb
	onSuccessfulSave?: (editedVerbData: EnrichedVerb) => void
}

export const VerbDataEditorModal = forwardRef<ModalInterface, VerbDataEditorModalProps>(
	function VerbDataEditorModal(props: VerbDataEditorModalProps, fwdRef) {
		const ref = useModalInterfaceRef(fwdRef)

		const [isInSaveConfirmation, setIsInSaveConfirmation] = useState(false)
		const [saveError, setSaveError] = useState<string>()

		return (
			<ModalWithMessage
				wide
				ref={ref}
				onClose={() => {
					setIsInSaveConfirmation(false)
				}}
				content={
					<VerbDataEditor
						{...props}
						onClose={ref.current?.close}
						onSaveError={(e) => setSaveError(e)}
						onSaveTry={() => setIsInSaveConfirmation(true)}
					/>
				}
				isInMessage={isInSaveConfirmation}
				messageContent={
					<EditConfirmationMessage
						onErrorConfirmation={() => {
							setIsInSaveConfirmation(false)
							setSaveError(undefined)
						}}
						onSuccessConfirmation={() => ref.current?.close()}
						saveError={saveError}
					/>
				}
			/>
		)
	},
)

interface EditConfirmationMessageProps {
	saveError?: string
	onErrorConfirmation: () => void
	onSuccessConfirmation: () => void
}

const EditConfirmationMessage = (props: EditConfirmationMessageProps) => {
	const { saveError, onSuccessConfirmation, onErrorConfirmation } = props
	return saveError ? (
		<ModalMessage
			variant='error'
			title='There is an error in the provided code'
			content={saveError}
			onConfirmation={onErrorConfirmation}
		/>
	) : (
		<ModalMessage
			variant='success'
			title='Verb successful saved'
			onConfirmation={onSuccessConfirmation}
		/>
	)
}

interface VerbDataEditorProps extends VerbDataEditorModalProps {
	onClose?: () => void
	onSaveError: (error: string) => void
	onSaveTry: () => void
}

const VerbDataEditor = (props: VerbDataEditorProps) => {
	const { editingVerbData, onSuccessfulSave, onClose, onSaveTry, onSaveError } = props

	const initialCode = JSON.stringify(editingVerbData, null, '\t')
	const [code, setCode] = useState(initialCode)

	const handleSave = () => {
		try {
			const data = JSON.parse(code)
			const { EnrichedVerbTI: EnrichedVerbChecker } = createCheckers({ EnrichedVerbTI })
			EnrichedVerbChecker.strictCheck(data)

			onSuccessfulSave?.(data)
		} catch (error) {
			onSaveError((error as Error).message)
		}
		onSaveTry()
	}

	return (
		<div className='w-full flex flex-col gap-4'>
			<h1 className='w-full text-center font-semibold text-2xl'>
				Edit {editingVerbData?.infinitive.wordUS}
			</h1>
			<CodeEditor
				language='json'
				value={code}
				onChange={(e) => setCode(e.target.value)}
				data-color-mode='light'
				className='size-full overflow-scroll rounded-lg border-gray-200 border-2 code-editor'
				style={{ fontSize: '14px', whiteSpace: 'nowrap' }}
			/>
			<div className='flex gap-4 w-full justify-center'>
				<Button variant='orange' onClick={onClose}>
					Cancel
				</Button>
				<Button
					variant='green'
					onClick={() => {
						handleSave?.()
					}}
				>
					Save
				</Button>
			</div>
		</div>
	)
}
