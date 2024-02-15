import { FieldProps } from 'formik'

interface Props extends FieldProps {
	legend: string
	options: {
		id: string
		name: string
		value: string
		label: string
		defaultChecked?: boolean
	}[]
}

export const CheckboxFieldset = (props: Props) => {
	const { legend, options, form, field } = props
	return (
		<fieldset className='flex flex-col'>
			<legend className='font-medium'>{legend}</legend>
			<div className='flex flex-col justify-between'>
				{options.map((opt) => (
					<div key={opt.id} className='flex gap-1'>
						<input
							type='checkbox'
							{...opt}
							onChange={(e) => {
								const checkedArray = { ...field.value }
								if (e.target.checked) checkedArray[opt.id] = true
								else checkedArray[opt.id] = false
								form.setFieldValue(field.name, checkedArray)
							}}
							defaultChecked={field.value[opt.id]}
						/>
						<label htmlFor={opt.id}>{opt.label}</label>
					</div>
				))}
			</div>
		</fieldset>
	)
}
