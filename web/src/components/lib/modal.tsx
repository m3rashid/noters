import { Fragment, PropsWithChildren, useRef, useState } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'

import Button, { ButtonProps } from './button'

export type ModalProps = PropsWithChildren & {
	title?: string
	okButton?: ButtonProps
	closeButton?: ButtonProps
}

function Modal(props: ModalProps) {
	const [open, setOpen] = useState(true)

	const cancelButtonRef = useRef(null)

	return (
		<Transition show={open} as={Fragment}>
			<Dialog className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
				<TransitionChild
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</TransitionChild>

				<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<TransitionChild
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
								<div className="mt-3 text-center sm:mt-5">
									{props.title ? (
										<DialogTitle
											as="h3"
											className="text-base font-semibold leading-6 text-gray-900"
										>
											{props.title}
										</DialogTitle>
									) : null}
									<div className="mt-2">{props.children}</div>
								</div>

								{props.okButton || props.closeButton ? (
									<div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
										{props.okButton ? (
											<Button
												{...props.okButton}
												onClick={(e) => {
													if (props.okButton?.onClick) props.okButton.onClick(e)
													setOpen(false)
												}}
											/>
										) : null}

										{props.closeButton ? (
											<Button
												ref={cancelButtonRef}
												{...props.closeButton}
												onClick={(e) => {
													if (props.closeButton?.onClick) props.closeButton.onClick(e)
													setOpen(false)
												}}
											/>
										) : null}
									</div>
								) : null}
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}

export default Modal
