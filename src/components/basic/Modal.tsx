import { ReactNode, forwardRef, useImperativeHandle, useRef } from 'react'
import { createPortal } from 'react-dom'

interface Props {
	children: ReactNode
	onOpen?: () => void
	onClose?: () => void
}

export interface ModalInterface {
	open: () => void
	close: () => void
}

export const Modal = forwardRef(function SetupModal(props: Props, ref) {
	const { children, onOpen, onClose } = props
	const dialogRef = useRef<HTMLDialogElement>(null)

	useImperativeHandle(ref, () => {
		return {
			open() {
				if (dialogRef.current) dialogRef.current.showModal()
				onOpen?.()
			},
			close() {
				if (dialogRef.current) dialogRef.current.close()
				onClose?.()
			},
		}
	})

	const modalElement = document.getElementById('modal')
	if (modalElement) {
		return createPortal(
			<dialog
				className='mt-5 w-96 overflow-y-scroll
            border-brandOrange border-2 rounded-lg p-4
            backdrop:bg-black backdrop:opacity-20 '
				ref={dialogRef}
			>
				<div className='flex flex-col gap-2 items-center'>{children}</div>
			</dialog>,
			modalElement,
		)
	}
})
