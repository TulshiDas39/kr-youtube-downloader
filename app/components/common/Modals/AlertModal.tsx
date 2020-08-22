import React from "react";
import { Modal, Button } from "react-bootstrap";
import { IReduxState } from "../../../lib";
import { connect, ConnectedProps } from "react-redux";
import { ActionModal } from ".";

export class AlertModalComponent extends React.PureComponent<AlertModalProps>{
  render(){
    return (
      <Modal show={!!this.props.alertModal}>
        {this.props.alertModal?.title &&
          <Modal.Header closeButton>
          <Modal.Title>{this.props.alertModal?.title}</Modal.Title>
        </Modal.Header>}

        {this.props.alertModal?.msg &&
          <Modal.Body className="text-dark">
          <p>{this.props.alertModal?.msg}.</p>
        </Modal.Body>}

        <Modal.Footer>
          <Button variant="secondary" onClick={()=>this.props.dispatch(ActionModal.hideAlertModal())}>Close</Button>
          {this.props.alertModal?.showSaveBtn && <Button variant="primary">Save changes</Button>}
        </Modal.Footer>
      </Modal>

    )
  }
}

export interface AlertModalProps extends ConnectedProps<typeof connector>{}

const mapStateToProps = (state:IReduxState)=> ({alertModal:state.modals.alertModal})

const connector = connect(mapStateToProps);

export const AlertModal = connector(AlertModalComponent);
