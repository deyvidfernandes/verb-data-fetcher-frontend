interface Props {
	legend: string
	options: {
		id: string
		name: string
		value: string
		label: string
	}[]
}

export const RadioFieldset = (props: Props) => {
	const { legend, options } = props
	return (
		<fieldset className='flex flex-col'>
			<legend className='font-medium'>{legend}</legend>
			<div className='flex justify-between'>
				{options.map((opt) => (
					<div key={opt.id} className='flex gap-1'>
						<input type='radio' {...opt} />
						<label htmlFor={opt.id}>{opt.label}</label>
					</div>
				))}
			</div>
		</fieldset>
	)
}
