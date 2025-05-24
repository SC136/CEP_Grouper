"use client";

import { ReactNode } from "react";
import ReactModal from "react-modal";
import Button from "./button";

// Make sure to bind modal to app element in your client component
if (typeof window !== "undefined") {
  ReactModal.setAppElement("body");
}

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Modal({
  isOpen,
  title,
  onClose,
  children,
  footer,
}: ModalProps) {  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={title}
      className="relative mx-auto mt-20 max-w-lg bg-white p-6 rounded-lg shadow-xl outline-none"
      overlayClassName="fixed inset-0 bg-black/50 z-50"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <Button
          variant="secondary"
          className="p-1 h-8 w-8 flex items-center justify-center rounded-full"
          onClick={onClose}
        >
          ✕
        </Button>
      </div>
      <div className="mb-6 text-gray-800">{children}</div>
      {footer && <div className="flex justify-end gap-2">{footer}</div>}
    </ReactModal>
  );
}
