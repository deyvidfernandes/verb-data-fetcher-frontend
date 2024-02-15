import { ForwardedRef, useImperativeHandle, useRef } from 'react'
import { ModalInterface } from './Modal'

export const useModalInterfaceRef = (forwardedRef: ForwardedRef<ModalInterface>) => {
	const ref = useRef<ModalInterface>(null)
	useImperativeHandle(forwardedRef, () => {
		return {
			open() {
				if (ref) ref.current?.open()
			},
			close() {
				if (ref) ref.current?.close()
			},
		}
	})
	return ref
}
