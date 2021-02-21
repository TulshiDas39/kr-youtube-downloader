import { ModalName } from "../../../constants/constUi";

export interface IModalReducerState{
   alertModal?:IAlertModalOptions;
   openModals:ModalName[];
}

export interface IAlertModalOptions{
  msg:string;
  title?:string;
  showSaveBtn?:boolean;
}
