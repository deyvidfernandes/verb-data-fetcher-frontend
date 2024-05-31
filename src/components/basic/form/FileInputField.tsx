import { FieldProps } from 'formik'
import {
	FormEventHandler,
	KeyboardEvent,
	MouseEvent,
	ReactNode,
	useRef,
	useState,
} from 'react'

interface Props extends FieldProps {
	label: string
	buttonContent: ReactNode
	selectedContent: (name: string) => ReactNode
}

export const FileInputField = (props: Props) => {
	const { label, buttonContent, selectedContent, field, form } = props
	const inputRef = useRef<HTMLInputElement>(null)
	const [selectedFile, setSelectedFile] = useState<string | undefined>()
	const handleFileUploadStart = (
		e: MouseEvent<HTMLLabelElement> | KeyboardEvent<HTMLLabelElement>,
	) => {
		e.preventDefault()
		inputRef.current?.click()
	}

	const handleFileUpload: FormEventHandler<HTMLInputElement> = (e) => {
		const selectedFiles = e.currentTarget.files
		if (selectedFiles?.[0]) {
			setSelectedFile(selectedFiles[0].name)
			form.setFieldValue(field.name, selectedFiles[0])
		}
	}

	return (
		<div className='flex flex-col items-center gap-1'>
			<p className='font-medium'>{label}</p>
			<label
				onClick={handleFileUploadStart}
				onKeyDown={(e) => {if (e.code === "Enter" || e.code === "Space") handleFileUploadStart(e)}}
				htmlFor={field.name}
				className='w-fit font-medium cursor-pointer
				border-gray-300 border rounded-md p-3'
			>
				{selectedFile ? selectedContent(selectedFile) : buttonContent}
			</label>
			<input
				ref={inputRef}
				className='hidden'
				id={field.name}
				name={field.name}
				accept='.json'
				type='file'
				onInput={handleFileUpload}
			/>
		</div>
	)
}
