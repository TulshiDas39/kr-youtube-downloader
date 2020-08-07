import { ipcMain } from "electron";
import { Renderer_Events } from "../constants/constants";

export class DownloadManager{
  constructor(){
    this.init()
  }

  init(){
    this.handleRendererEvents();
  }

  handleRendererEvents(){
    this.handleDownloadStart();
  }

  handleDownloadStart(){
    ipcMain.on(Renderer_Events.START_DOWNLOAD, (event: any) => {
      console.log('event come');
    })
  }
}
