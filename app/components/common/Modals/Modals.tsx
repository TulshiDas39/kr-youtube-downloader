import React, { Fragment } from "react";
import { AlertModal } from "./AlertModal";
import { ConfirmationModal } from "./ConfirmationModal";

export class Modals extends React.PureComponent{
  render(){
    return (
      <Fragment>
        <AlertModal />
        <ConfirmationModal/>
      </Fragment>
    )
  }
}
