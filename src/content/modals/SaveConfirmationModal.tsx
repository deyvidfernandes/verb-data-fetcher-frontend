import { usePostVerbData } from '@/api/backend/useSendVerbData'
import Button from '@/components/basic/Button'
import { ModalInterface } from '@/components/basic/modal/Modal'
import { ModalMessage } from '@/components/basic/modal/ModalMessage'
import { ModalWithMessage } from '@/components/basic/modal/ModalWithMessage'
import { useModalInterfaceRef } from '@/components/basic/modal/useModalInterfaceRef'
import { TextDisplay } from '@/components/basic/TextDisplay'
import { useGlobalStateContext } from '@/util/globalState/GlobalStateContext'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { forwardRef } from 'react'

export const SaveConfirmationModal = forwardRef<ModalInterface, unknown>(
	function SaveConfirmationModal(_, forwardedRef) {
		const processConfig = useGlobalStateContext(
			(v) => v.appGlobalState.processConfiguration,
		)
		const enrichedVerbData = useGlobalStateContext(
			(v) => v.appGlobalState.processState.enrichedVerbData,
		)

		const { postVerbData, responseData } = usePostVerbData()

		const handleConfirm = () => {
			if (!enrichedVerbData) throw new Error('No enriched verb data to save')
			postVerbData(enrichedVerbData)
		}
		const hasServerResponded = !!responseData
		const ref = useModalInterfaceRef(forwardedRef)
		return (
			<ModalWithMessage
				ref={ref}
				isInMessage={hasServerResponded}
				content={
					<div className='flex flex-col p-4 items-center gap-2 justify-center h-full'>
						<FontAwesomeIcon
							icon={faCircleQuestion}
							className='text-brandOrange text-8xl'
						/>
						<p className='text-brandOrange text-2xl font-semibold text-center capitalize'>
							Are you sure?
						</p>
						{processConfig.persistData ? (
							<>
								<p className='text-brandOrange text-base font-medium'>
									The generated data will be saved on the following database:
								</p>
								<div className='flex gap-1 flex-col pt-2 w-full'>
									<TextDisplay
										label='URL'
										variant='orange'
										value={processConfig.database.url}
									/>
									<TextDisplay
										label='Database name'
										variant='orange'
										value={processConfig.database.name}
									/>
									<TextDisplay
										label='Table name'
										variant='orange'
										value={processConfig.database.table}
									/>
									<TextDisplay
										label='User'
										variant='orange'
										value={processConfig.database.user}
									/>
									<TextDisplay
										label='Type'
										variant='orange'
										value={processConfig.database.type}
									/>
								</div>
							</>
						) : (
							<p className='text-brandOrange text-base font-medium'>
								The generated data will be saved on a JSON file
							</p>
						)}
						<div className='flex gap-2 mt-auto w-full'>
							<Button variant='orange' type='button' onClick={() => ref.current?.close()}>
								<p className='capitalize font-medium'>Cancel</p>
							</Button>
							<Button variant='green' type='submit' onClick={handleConfirm}>
								Confirm
							</Button>
						</div>
					</div>
				}
				messageContent={
					<>
						<ModalMessage variant='success' title='Sucesso!' />
						<p>{responseData?.error?.message}</p>
						<p>{responseData?.error?.exceptionMessage}</p>
					</>
				}
			/>
		)
	},
)
