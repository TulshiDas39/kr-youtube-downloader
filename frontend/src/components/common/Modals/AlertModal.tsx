import React from "react";
import { Modal, Button } from "react-bootstrap";
import { shallowEqual } from "react-redux";
import { useSelectorTyped } from "../../../store/rootReducer";
import { ActionModal } from "../../../store/slices/modalSlice";
import { useDispatchTyped } from "../../../store";

function AlertModalComponent(){
  const store = useSelectorTyped((state)=>({
    alertModal:state.modals.alertModal
  }),shallowEqual);

  const dispatch = useDispatchTyped();

    return (
      <Modal show={!!store.alertModal}>
        {store.alertModal?.title &&
          <Modal.Header closeButton>
          <Modal.Title>{store.alertModal?.title}</Modal.Title>
        </Modal.Header>}

        {store.alertModal?.msg &&
          <Modal.Body className="text-dark">
          <p>{store.alertModal?.msg}.</p>
        </Modal.Body>}

        <Modal.Footer>
          <Button variant="secondary" onClick={()=> dispatch(ActionModal.hideAlertModal())}>Close</Button>
          {store.alertModal?.showSaveBtn && <Button variant="primary">Save changes</Button>}
        </Modal.Footer>
      </Modal>

    )
}

export const AlertModal = React.memo(AlertModalComponent);