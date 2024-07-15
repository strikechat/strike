import { Dialog, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import { useModal } from '../lib/context/ModalContext';

export const Modal: React.FC = () => {
    const { modalContent, hideModal, onConfirm, onCancel } = useModal();

    return (
        <Transition appear show={!!modalContent} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50" onClose={hideModal}>
                <div className="min-h-screen px-4 text-center">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black opacity-30" onClick={hideModal}></div>
                    </TransitionChild>

                    <span className="inline-block h-screen align-middle" aria-hidden="true">
                        &#8203;
                    </span>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 text-white shadow-xl rounded-2xl">
                            {modalContent}
                            <div className="mt-4 flex justify-end">
                                {onCancel && (
                                    <button
                                        type="button"
                                        className="mr-2 inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                                        onClick={onCancel}
                                    >
                                        Cancel
                                    </button>
                                )}
                                {onConfirm && (
                                    <button
                                        type="button"
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                        onClick={onConfirm}
                                    >
                                        Confirm
                                    </button>
                                )}
                            </div>
                        </div>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};