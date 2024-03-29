import Button from '../../components/basic/Button'

import { SelectOption } from '../../components/basic/form/SelectField'
import { FileInputField } from '../../components/basic/form/FileInputField'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { Field, FieldProps, Form, Formik, FormikHelpers, FormikProps } from 'formik'
import { DatabaseConfigFields } from './DatabaseConfigFields'
import { CheckboxFieldset } from '../../components/basic/form/CheckboxFieldset'
import { ErrorDisplay } from '../../components/basic/form/ErrorDisplay'
import { isRequired, validateOutputMethods } from '@/util/validationsFns'
import { DBConfigValues } from './DBConfigValues'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Props {
	variant: 'setup' | 'change'
	initialValues?: DBConfigValues
	onSubmit: (
		ConfigValues: DBConfigValues,
		formikBag: FormikHelpers<DBConfigValues>,
	) => void
	handleClose: () => void
	availableDBTypes?: SelectOption[]
	setup?: boolean
	hidden?: boolean
}

const DEFAULT_INITIAL_VALUES: DBConfigValues = {
	outputMethod: { persistData: true, outputJson: false },
	type: '',
	url: '',
	name: '',
	table: '',
	user: '',
	password: '',
	baseDataFile: null,
}

export const ConfigForm = (props: Props) => {
	const {
		variant,
		initialValues,
		availableDBTypes,
		handleClose: handleCloseModal,
		onSubmit,
	} = props

	return (
		<Formik
			enableReinitialize
			initialValues={initialValues || DEFAULT_INITIAL_VALUES}
			onSubmit={(ConfigValues, formikBag) => {
				onSubmit(ConfigValues, formikBag)
			}}
		>
			{(form: FormikProps<DBConfigValues>) => (
				<Form autoComplete='off' className={'flex flex-col gap-2 w-full h-full'}>
					<h1 className='w-full text-center font-semibold text-2xl'>
						{variant === 'setup' ? 'Setup process' : 'Update config'}
					</h1>
					<div id='inputs' className='flex flex-col gap-1'>
						<div className='flex flex-col gap-[2px]'>
							<Field
								component={CheckboxFieldset}
								name='outputMethod'
								legend='Output options:'
								validate={validateOutputMethods}
								options={[
									{
										id: 'persistData',
										name: 'outputMethod',
										value: 'persistData',
										label: 'Persist on database',
									},
									{
										id: 'outputJson',
										name: 'outputMethod',
										value: 'outputJson',
										label: 'Output JSON file',
									},
								]}
							/>
							{form.errors.outputMethod && (
								<ErrorDisplay errorMessage={form.errors.outputMethod as string} />
							)}
						</div>

						{form.values.outputMethod.persistData && (
							<DatabaseConfigFields
								form={form}
								availableDBTypes={availableDBTypes}
								selectedDBType={initialValues?.type}
							/>
						)}

						{variant === 'setup' && (
							<>
								<Field
									name='baseDataFile'
									component={JsonFileInputField}
									validate={isRequired}
								/>
								{form.errors.baseDataFile && form.touched.baseDataFile && (
									<ErrorDisplay
										center
										errorMessage={form.errors.baseDataFile as string}
									/>
								)}
							</>
						)}
					</div>

					<div className='flex gap-2 mt-auto'>
						<Button variant='orange' type='button' onClick={handleCloseModal}>
							<p className='capitalize font-medium'>Cancel</p>
						</Button>
						<Button variant='green' type='submit'>
							<p
								className={`${
									variant === 'setup' ? 'uppercase' : 'capitalize'
								} font-medium`}
							>
								{variant === 'setup' ? 'SETUP' : 'Save'}
							</p>
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	)
}

const JsonFileInputField = (props: FieldProps) => {
	return (
		<div className='flex justify-center'>
			<FileInputField
				{...props}
				label='Upload base data file'
				buttonContent={
					<div className='flex items-center gap-2'>
						<p className='text-sm font-light text-dark-gray'>Select JSON file </p>
						<FontAwesomeIcon icon={faFileUpload} className='h-6 text-gray-700' />
					</div>
				}
				selectedContent={(name) => (
					<div className='flex items-center gap-2'>
						<p className='text-sm font-light text-dark-gray'>
							<span className='font-medium'>Selected file: </span>
							{name}
						</p>
					</div>
				)}
			/>
		</div>
	)
}
