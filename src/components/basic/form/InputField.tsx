import { FieldProps } from 'formik'

interface Props extends FieldProps {
	id: string
	label: string
	placeholder?: string
}

export const InputField = (props: Props) => {
	const { id, label, placeholder, field } = props
	return (
		<div className='flex flex-col gap-[2px]'>
			<label htmlFor={id} className='font-medium'>
				{label}
			</label>
			<div className='flex flex-col gap-[1px]'>
				<input
					id={id}
					placeholder={placeholder}
					className=' font-md h-9 p-2 border-gray-300 border rounded-md 
					hover:border-gray-400 focus:border-brandBlue focus:border-2 
					outline-none transition-all placeholder:text-gray-400'
					{...field}
				/>
			</div>
		</div>
	)
}
