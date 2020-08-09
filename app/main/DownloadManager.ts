import { ipcMain, IpcMainEvent, app } from "electron";
import { Renderer_Events, Main_Events } from "../constants/constants";
import path from "path";
import ytdl, {videoInfo} from "ytdl-core";
import fs from "fs";
import { mainWindow } from "../main.dev";
import { ISingleVideo, IProgress } from "../common";
import { FileManager } from "./FileManager";

export class DownloadManager{
  readonly workspacePath = path.join(app.getPath('videos'),"kr_youtube_downloader");
  formate = 18;
  readonly charactersToAvoidInFileName = /[#%&{}\\<>*?\/\s$!'":@+`|=]/g
  constructor(){
    this.init()
  }

  init(){
    this.handleRendererEvents();
    new FileManager();
  }

  handleRendererEvents(){
    this.handleDownloadStart();
  }

  handleDownloadStart(){
    ipcMain.on(Renderer_Events.START_DOWNLOAD, (event: IpcMainEvent,url:string) => {
      this.downloadVideo(url);
    })
  }

  downloadVideo(url:string){
    ytdl.getInfo(url).then(info=>{
      this.downloadVideoFromInfo(info);
    });
    // let stream = video.pipe(fs.createWriteStream(this.downloadPath+'/video.flv'));
    // video.addListener('')
  }


  downloadVideoFromInfo(info:videoInfo,playlistId?:string){
    const formate = info.formats.find(x=>x.itag === this.formate);
    const video = ytdl.downloadFromInfo(info,{quality:this.formate});
    let fileName = info.videoDetails.title.toString()?.replace(this.charactersToAvoidInFileName,"_");
    fileName += `.${formate?.container || "mp4"}`
    const download_path  = path.join(this.workspacePath,fileName);// `${this.downloadPath}/${fileName}.${formate?.container || "mp4"}`;
    const singleVideo:ISingleVideo = {
      info:info,
      format:formate!,
      downloadPath:download_path
    }
    if(!playlistId) mainWindow?.webContents.send(Main_Events.ADD_SINGLE_DOWNLOAD_ITEM,singleVideo);
    video.pipe(fs.createWriteStream(download_path));
    video.on('data',(chunk)=>{
    })
    video.on('progress',(chunkSize:number)=>{
      let progress:IProgress={
        chunkSize:chunkSize,
        playlistId:playlistId,
        singleVideoId:info.videoDetails.videoId
      }
      mainWindow?.webContents.send(Main_Events.HANDLE_PROGRESS,progress);
    })

    video.on('end',()=>{
      let progress:IProgress={
        chunkSize:0,
        playlistId:playlistId,
        singleVideoId:info.videoDetails.videoId
      }
      mainWindow?.webContents.send(Main_Events.HANDLE_COMPLETE,progress);
    })

  }
}
