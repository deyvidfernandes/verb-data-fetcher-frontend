import { InputField } from '../../components/basic/form/InputField'
import { Field, FormikProps } from 'formik'
import { SelectField, SelectOption } from '../../components/basic/form/SelectField'
import { ErrorDisplay } from '../../components/basic/form/ErrorDisplay'
import { isRequired } from '@/util/validationsFns'
import { DBConfigValues } from './DBConfigValues'

interface Props {
	form: FormikProps<DBConfigValues>
	availableDBTypes?: SelectOption[]
	selectedDBType?: string
}

export const DatabaseConfigFields = (props: Props) => {
	const { availableDBTypes, selectedDBType, form } = props
	return (
		<>
			<Field
				name='type'
				component={SelectField}
				options={availableDBTypes}
				placeholder='Select a database type'
				defaultValue={selectedDBType && { value: selectedDBType, label: selectedDBType }}
				validate={isRequired}
			/>
			{form.errors.type && form.touched.type && (
				<ErrorDisplay errorMessage={form.errors.type as string} />
			)}
			<Field
				name='url'
				component={InputField}
				type='text'
				label='Database URL'
				placeholder='ex: localhost:3306'
				validate={isRequired}
			/>
			{form.errors.url && form.touched.url && (
				<ErrorDisplay errorMessage={form.errors.url as string} />
			)}
			<Field
				name='name'
				component={InputField}
				type='text'
				label='Database name'
				placeholder='ex: test'
				validate={isRequired}
			/>
			{form.errors.name && form.touched.name && (
				<ErrorDisplay errorMessage={form.errors.name as string} />
			)}
			<Field
				name='table'
				component={InputField}
				type='text'
				label='Table to save the data'
				placeholder='ex: testTable'
				validate={isRequired}
			/>
			{form.errors.table && form.touched.table && (
				<ErrorDisplay errorMessage={form.errors.table as string} />
			)}
			<Field
				name='user'
				component={InputField}
				type='text'
				label='Database User'
				placeholder='ex: root'
				validate={isRequired}
			/>
			{form.errors.user && form.touched.user && (
				<ErrorDisplay errorMessage={form.errors.user as string} />
			)}
			<Field
				name='password'
				component={InputField}
				type='password'
				label='User password'
				placeholder='ex: 1234'
				validate={isRequired}
			/>
			{form.errors.password && form.touched.password && (
				<ErrorDisplay errorMessage={form.errors.password as string} />
			)}
		</>
	)
}
