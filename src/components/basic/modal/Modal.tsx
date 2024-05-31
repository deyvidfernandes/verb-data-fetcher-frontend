import { useGlobalStateContext } from '@/util/globalState/GlobalStateContext'
import { ReactNode, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export interface ModalProps {
	children: ReactNode
	unstyledContent?: boolean
	wide?: boolean
	onOpen?: () => void
	onClose?: () => void
}

export interface ModalInterface {
	open: () => void
	close: () => void
}

export const Modal = forwardRef<ModalInterface, ModalProps>(function SetupModal(
	props: ModalProps,
	ref,
) {
	const { children, unstyledContent, wide, onOpen, onClose } = props
	const dialogRef = useRef<HTMLDialogElement>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const localOnClose = () => {
		onClose?.()
		setIsModalOpen(false)
	}
	const localOnOpen = () => {
		onOpen?.()
		setIsModalOpen(true)
	}

	useImperativeHandle(ref, () => {
		return {
			open() {
				localOnOpen()
				if (dialogRef.current) dialogRef.current.showModal()
				document.body.classList.add("overflow-y-hidden")
			},
			close() {
				if (dialogRef.current) dialogRef.current.close()
				document.body.classList.remove("overflow-y-hidden")
				localOnClose()
			},
		}
	})

	const modalElement = document.getElementById('modal')
	if (modalElement) {
		return createPortal(
			<dialog
				onClose={localOnClose}
				className={`${unstyledContent ? '' : 'py-4 px-6'}
				${wide ? 'max-w-5xl w-full' : 'max-w-md w-full h-full max-h-[35rem]'}
				overflow-y-scroll
            border-brandOrange border-2 rounded-lg 
            backdrop:bg-black backdrop:opacity-25 `}
				ref={dialogRef}
			>
				{isModalOpen && children}
			</dialog>,
			modalElement,
		)
	}
})
