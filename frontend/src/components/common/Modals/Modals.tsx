import { Fragment } from "react";
import { AlertModal } from "./AlertModal";
import { ConfirmationModal } from "./ConfirmationModal";

export function Modals(){
    return (
      <Fragment>
        <AlertModal />
        <ConfirmationModal/>
      </Fragment>
    )
}
