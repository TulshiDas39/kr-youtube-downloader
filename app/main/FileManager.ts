import fs from "fs"
import { ipcMain, shell } from "electron";
import { Renderer_Events } from "../constants/constants";
import { ConstantMain } from "../constants/constantMain";
import { join } from "path";
export class FileManager{

  constructor(){
    this.init();
  }
  init(){
    this.setIpcEvents();
  }
  setIpcEvents(){
    this.handleFolderOpen();
  }
  handleFolderOpen(){
    ipcMain.on(Renderer_Events.OPEN_FOLDER,(e,path:string)=>{
      shell.showItemInFolder(path);
    })
  }
  createFileIfNotExist(path:string){
    if(!fs.existsSync(path)) fs.writeFileSync(path,"");
  }

  static checkForWorksPace(){
    if(!fs.existsSync(ConstantMain.worksPaceDir)) fs.mkdirSync(ConstantMain.worksPaceDir);
  }
  static createDirIfNotExist(path:string){
    if(!fs.existsSync(path)) fs.mkdir(path,(err=>{
      console.error(err);
    }));
  }

  static createDirIfNotExistSync(path:string){
    if(!fs.existsSync(path)) fs.mkdirSync(path);
  }

  static createPlaylistFolderIfDoesnotExist(foldername:string){
    this.checkForWorksPace();
    const playlistPath = join(ConstantMain.worksPaceDir,foldername);
    this.createDirIfNotExistSync(playlistPath);
  }

}
