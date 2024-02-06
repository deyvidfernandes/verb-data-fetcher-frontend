import { ChangeEventHandler } from 'react'
import './style.css'

interface Props {
	id: string
	min: number
	max: number
	value: number
	step: number
	label: string
	onChange?: ChangeEventHandler<HTMLInputElement>
}

export const RangeInput = (props: Props) => {
	const { id, label, value, onChange } = props

	const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		onChange?.(e)
	}

	return (
		<div className='flex flex-col gap-2'>
			<label htmlFor={id} className='font-medium'>
				{label}
			</label>
			<div className='flex gap-1'>
				<p className='min-w-8'>{value.toFixed(1)}s</p>
				<input {...props} name={id} type='range' onChange={handleChange} value={value} />
			</div>
		</div>
	)
}
