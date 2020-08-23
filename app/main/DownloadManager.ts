import { ipcMain, IpcMainEvent } from "electron";
import { Renderer_Events, Main_Events, Constants } from "../constants/constants";
import path from "path";
import ytdl, {videoInfo} from "ytdl-core";
import fs from "fs";
import { mainWindow } from "../main.dev";
import { ISingleVideo, IProgress, IDownload, IFetch } from "../lib";
import { FileManager } from "./FileManager";
import { ConstantMain } from "../constants/constantMain";
import ytpl from "ytpl";

export class DownloadManager{
  readonly workspacePath = ConstantMain.worksPaceDir;
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
    this.handlePlaylistDownloadStart();
    this.handleVideoInfoFetch();
  }

  handleDownloadStart(){
    ipcMain.on(Renderer_Events.START_DOWNLOAD, (_event: IpcMainEvent,url:string) => {
      this.downloadVideo(url);
    })
  }

  handlePlaylistDownloadStart(){
    ipcMain.on(Renderer_Events.START_PLAYLIST_DOWNLOAD, (_event,url:string) => {
      this.downloadPlaylist(url);
    })
  }

  handleVideoInfoFetch=()=>{
    ipcMain.on(Renderer_Events.FETCH_SINGLE_VIDEO_INFO, (_event,info:IFetch) => {

      ytdl.getInfo(Constants.URL_PREFIX+info.videoId).then(data=>{
        const filename = data.videoDetails.title?.replace(this.charactersToAvoidInFileName,"_");
        const formate = data.formats.find(x=>x.itag === this.formate);
        const videoInfo:ISingleVideo={
          downloadPath:path.join(info.playlistPath!,filename),
          info:data,
          format:formate!
        }
        mainWindow?.webContents.send(info.channel,videoInfo);
      });
    })
  }

  downloadVideo(url:string){
    FileManager.checkForWorksPace();
    ytdl.getInfo(url).then(info=>{
      this.downloadVideoFromInfo(info);
    });
  }

  async downloadPlaylist(url:string){
    FileManager.checkForWorksPace();
    const id = await ytpl.getPlaylistID(url);
    ytpl(id,(err,result)=>{
      if(err) console.log(err);
      if(result){
        const folderName = result.title.replace(this.charactersToAvoidInFileName,"_");
        const downloadPath = path.join(ConstantMain.worksPaceDir,folderName);
        const download:IDownload={
          id:id,
          inProgress:true,
          playList:{
            fetched:[],
            info:result,
            downloadPath:downloadPath
          }
        }
        mainWindow?.webContents.send(Main_Events.ADD_PLAYLIST_DOWNLOAD_ITEM,download);
      }
    })
  }


  downloadVideoFromInfo(info:videoInfo,playlistId?:string){
    const formate = info.formats.find(x=>x.itag === this.formate);
    const video = ytdl.downloadFromInfo(info,{quality:this.formate});
    let fileName = info.videoDetails.title.toString()?.replace(this.charactersToAvoidInFileName,"_");
    fileName += `.${formate?.container || "mp4"}`
    const download_path  = path.join(this.workspacePath,fileName);
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
