import { ReactNode, forwardRef } from 'react'
import { Modal, ModalInterface, ModalProps } from './Modal'
import { useModalInterfaceRef } from './useModalInterfaceRef'

type Props = {
	content: ReactNode
	messageContent: ReactNode
	isInMessage: boolean
} & Omit<ModalProps, 'children'>

export const ModalWithMessage = forwardRef<ModalInterface, Props>(
	function ModalWithMessage(props: Props, fwdRef) {
		const { content, messageContent, isInMessage } = props
		const ref = useModalInterfaceRef(fwdRef)

		return (
			<Modal {...props} ref={ref} unstyledContent>
				<div className={isInMessage ? 'hidden' : 'py-4 px-6 w-full h-full'}>{content}</div>
				{isInMessage && <div className={'py-4 px-6 w-full h-full'}>{messageContent}</div>}
			</Modal>
		)
	},
)
