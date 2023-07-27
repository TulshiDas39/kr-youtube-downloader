import { RendererEvents } from "common_library";
import { dialog, ipcMain, shell } from "electron";
import * as fs from 'fs';
import * as path from 'path';
import { ConstantMain } from "../dataClasses";

export class FileManager{    
      start(){
        this.setIpcEvents();
      }
      
      setIpcEvents(){
        this.handleFolderOpen();
      }

    handleFolderOpen(){
        ipcMain.on(RendererEvents.openFolder().channel,(e,path:string)=>{
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
        const playlistPath = path.join(ConstantMain.worksPaceDir,foldername);
        this.createDirIfNotExistSync(playlistPath);
      }
}