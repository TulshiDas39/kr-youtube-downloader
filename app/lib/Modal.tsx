import React from "react";
import { Modal, Button } from "react-bootstrap";

export class MyModal extends React.PureComponent<IMyModalProps>{
    render(){
      return (
       <Modal show={this.props.show} onHide={this.props.onClose}>
        {this.props.title &&
          <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>}

        {this.props.bodyText &&
          <Modal.Body className="text-dark">
          <p>{this.props.bodyText}.</p>
        </Modal.Body>}

        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.onClose}>Close</Button>
          {this.props.showSaveBtn && <Button variant="primary">Save changes</Button>}
        </Modal.Footer>
      </Modal>
      )
    }
}

export interface IMyModalProps{
  showSaveBtn?:boolean;
  title?:string;
  bodyText?:string;
  onClose?:()=>void;
  show:boolean;
}
