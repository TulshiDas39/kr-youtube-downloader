export interface IModalReducerState{
   alertModal?:IAlertModalOptions;
}

export interface IAlertModalOptions{
  msg:string;
  title?:string;
  showSaveBtn?:boolean;
}
