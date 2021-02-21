import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { ActionModal } from ".";
import { ModalName } from "../../../constants/constUi";
import { useSelectorTyped } from "../../../store";
import { ModalData } from "./ModalData";

function ConfirmationModalComponent(){
  const {show} = useSelectorTyped(state=>({
    show: state.modals.openModals.includes(ModalName.CONFIRMATION_MODAL)
  }))
  const dispatch = useDispatch();
  const handleConfirmation=()=>{
    dispatch(ActionModal.hideModal(ModalName.CONFIRMATION_MODAL));
    ModalData.ConfirmationModal.onConfirm();
  }
    return (
      <Modal show={show}>
        {!!ModalData.ConfirmationModal.title &&
          <Modal.Header closeButton>
          <Modal.Title>{ModalData.ConfirmationModal.title}</Modal.Title>
        </Modal.Header>}

        {!!ModalData.ConfirmationModal.description &&
          <Modal.Body className="text-dark">
          <p>{ModalData.ConfirmationModal.description}.</p>
        </Modal.Body>}

        <Modal.Footer>
          <Button variant="primary" onClick={handleConfirmation}>Yes</Button>
          <Button variant="secondary" onClick={()=> dispatch(ActionModal.hideModal(ModalName.CONFIRMATION_MODAL))}>No</Button>
        </Modal.Footer>
      </Modal>

    )
}

export const ConfirmationModal = React.memo(ConfirmationModalComponent);