"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ModalType = "confirmSecretPhrase" | "username" | "newModalHere";

interface ModalContextProps {
  activeModal: ModalType | null;
  openModal: (modal: ModalType, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  modalData: Record<string, unknown> | null;
}

const ModalContext = createContext<ModalContextProps | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [modalData, setModalData] = useState<Record<string, unknown> | null>(null);

  const openModal = (modal: ModalType, data: Record<string, unknown> = {}) => {
    setActiveModal(modal);
    setModalData(data);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  return (
    <ModalContext.Provider value={{ activeModal, openModal, closeModal, modalData }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
