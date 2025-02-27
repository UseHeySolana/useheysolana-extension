"use client";

import { useModal } from "@/app/context/ModalContext";
import ConfirmSecretPhraseModal from "@/app/modals/ConfirmSeed";
import UsernameModal from "@/app/modals/UserNameModal";
import CreatePinModal from "@/app/modals/CreatePin";
import ConfirmPinModal from "@/app/modals/ConfirmPin";

type ModalType = "confirmSecretPhrase" | "username" | "createPin" | "confirmPin";

export default function GlobalModals() {
  const { activeModal, closeModal, modalData, openModal } = useModal() as {
    activeModal: ModalType | null;
    closeModal: () => void;
    modalData?: { secretPhrase?: string[] };
    openModal: (modal: ModalType) => void;
  };

  if (!activeModal) return null;

  return (
    <>
      {activeModal === "confirmSecretPhrase" && (
        <ConfirmSecretPhraseModal
          isOpen={true}
          onClose={closeModal}
          onNext={() => openModal("username")}
          secretPhrase={modalData?.secretPhrase ?? []}
        />
      )}

      {activeModal === "username" && (
        <UsernameModal isOpen={true} onClose={closeModal} onNext={() => openModal("createPin")} />
      )}

      {activeModal === "createPin" && (
        <CreatePinModal isOpen={true} onClose={closeModal} onNext={() => openModal("confirmPin")} />
      )}

      {activeModal === "confirmPin" && <ConfirmPinModal isOpen={true} onClose={closeModal} />}
    </>
  );
}
