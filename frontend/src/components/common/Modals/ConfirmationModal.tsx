import React from "react";
import { Modal, Button } from "react-bootstrap";
import { shallowEqual, useDispatch } from "react-redux";
import { ModalData } from "./ModalData";
import { useSelectorTyped } from "../../../store/rootReducer";
import { ModalName } from "../../../lib/constants";
import { ActionModal } from "../../../store/slices/modalSlice";

function ConfirmationModalComponent(){
  const {show} = useSelectorTyped(state=>({
    show: state.modals.openModals.includes(ModalName.CONFIRMATION_MODAL)
  }),shallowEqual);
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