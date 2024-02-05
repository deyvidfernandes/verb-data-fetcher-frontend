import ReactSelect, { SingleValue } from 'react-select'
import { FieldProps } from 'formik'

interface Props extends FieldProps {
	defaultValue?: SelectOption
	options?: SelectOption[]
	placeholder?: string
}

export interface SelectOption {
	value: string
	label: string
}

export const SelectField = ({ defaultValue, options, field, form, ...props }: Props) => (
	<ReactSelect
		{...field}
		{...props}
		options={options}
		unstyled
		classNames={{
			control: (state) =>
				`h-max-9 bg-white transition-all rounded-md 
				${state.isFocused ? 'border-brandBlue border-2' : 'border-gray-300 border'}`,
			valueContainer: () => 'px-2',
			dropdownIndicator: () =>
				'w-9 flex items-center justify-center border-l border-gray-300',
			menuList: () => 'mt-[2px] bg-white border border-gray-300 rounded-md',
			option: (state) =>
				` px-2 h-8 leading-8 ${state.isFocused ? 'bg-brandBlue text-white' : 'bg-none'}`,
			placeholder: () => 'text-gray-400',
		}}
		value={options ? options.find((option) => option?.value === field?.value) : ''}
		onChange={(newValue: SingleValue<string | SelectOption>) => {
			form?.setFieldValue(field.name, (newValue as SelectOption)?.value)
		}}
		onBlur={() => form?.setFieldTouched(field.name, true)}
	/>
)
