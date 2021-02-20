import { ipcMain, IpcMainEvent } from "electron";
import { Renderer_Events, Main_Events, Constants } from "../constants/constants";
import path from "path";
import ytdl, {videoFormat, videoInfo} from "ytdl-core";
import fs from "fs";
import { mainWindow } from "../main.dev";
import { ISingleVideo, IProgress, IDownload, IFetch, IPlaylistVideo, ISingleVideoDownloadFromInfo } from "../lib";
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
    this.handleSingleVideoInfoFetch();
    this.hanldePlaylstVideoDownload();
    this.handleFetchPlaylist();
    this.handleSingleVideoDownloadFromInfo();
  }

  handleDownloadStart(){
    // ipcMain.on(Renderer_Events.START_DOWNLOAD, (_event: IpcMainEvent,url:string) => {
    //   this.downloadSingleVideo(url);
    // })
  }

  handleSingleVideoDownloadFromInfo(){
    ipcMain.on(Renderer_Events.DOWNLOAD_SINGLE_VIDEO_FROM_INFO, (_,data:ISingleVideoDownloadFromInfo) => {
      let fileName = data.info.videoDetails.title.toString()?.replace(this.charactersToAvoidInFileName,"_");
      fileName += `.${data.selectedVideoFormat.container}`
      const download_path  = path.join(this.workspacePath,fileName);
      this.downloadVideoFromInfo(data.info,data.selectedVideoFormat,download_path);
    })
  }

  handlePlaylistDownloadStart(){
    ipcMain.on(Renderer_Events.START_PLAYLIST_DOWNLOAD, (_event,url:string) => {
      this.downloadPlaylist(url);
    })
  }

  handleSingleVideoInfoFetch=()=>{
    ipcMain.on(Renderer_Events.FETCH_SINGLE_VIDEO_INFO, (_event,id:string) => {

      ytdl.getInfo(Constants.URL_PREFIX+id).then(data=>{
        // let filename = data.videoDetails.title?.replace(this.charactersToAvoidInFileName,"_");
        // const formate = data.formats.find(x=>x.itag === this.formate);
        // filename += `.${formate?.container || "mp4"}`
        // const videoInfo:ISingleVideo={
        //   downloadPath:path.join(info.playlistPath!,filename),
        //   info:data,
        //   format:formate!
        // }
        mainWindow?.webContents.send(Main_Events.HANDLE_SINGLE_VIDEO_FETCH_COMPLETE_+id,data);
      });
    })
  }

  handleFetchPlaylist=()=>{
    ipcMain.on(Renderer_Events.FETCH_PLAYLIST_INFO,(_e,id:string)=>{
      this.fetchPlaylistInfo(id);
    })
  }

  hanldePlaylstVideoDownload=()=>{
    ipcMain.on(Renderer_Events.DOWNLOAD_PLALIST_VIDEO,(_e,info:IPlaylistVideo)=>{
      this.downloadVideoFromInfo(info.video.info,info.video.format,info.video.downloadPath,info.playlistId);
    })
  }

  downloadSingleVideo(data:ISingleVideoDownloadFromInfo){
    // FileManager.checkForWorksPace();
    // ytdl.getInfo(url).then(info=>{
    //   let fileName = info.videoDetails.title.toString()?.replace(this.charactersToAvoidInFileName,"_");
    //   const formate = info.formats.find(x=>x.itag === this.formate);
    //   fileName += `.${formate?.container || "mp4"}`
    //   const download_path  = path.join(this.workspacePath,fileName);
    //   this.downloadVideoFromInfo(info,download_path);
    // });
  }

  async fetchPlaylistInfo(id:string){
    console.log('Fetching playlist info');
    // const id = await ytpl.getPlaylistID(url);
    ytpl(id).then(result=>{
      // const folderName = result.title.replace(this.charactersToAvoidInFileName,"_");
      // const downloadPath = path.join(ConstantMain.worksPaceDir,folderName);
      // FileManager.createDirIfNotExist(downloadPath);
      mainWindow?.webContents.send(Main_Events.HANDLE_PLAYLIST_FETCH_COMPLETE_+id,result);
    }).catch(err=>{
        console.error('error happend in playlist fetch');
        console.error(err);
    })
  }

  async downloadPlaylist(url:string){
    console.log('starting playlist download');
    FileManager.checkForWorksPace();
    const id = await ytpl.getPlaylistID(url);
    ytpl(id).then(result=>{
      const folderName = result.title.replace(this.charactersToAvoidInFileName,"_");
      const downloadPath = path.join(ConstantMain.worksPaceDir,folderName);
      FileManager.createDirIfNotExist(downloadPath);
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
    }).catch(err=>{
        console.error('error happend in playlist');
        console.error(err);
    })
  }


  downloadVideoFromInfo(info:videoInfo,formate:videoFormat,downloadPath:string,playlistId?:string){
    console.log('downloading video from info');
    // const formate = info.formats.find(x=>x.itag === this.formate);
    const video = ytdl.downloadFromInfo(info,{quality:formate.itag});
    // let fileName = info.videoDetails.title.toString()?.replace(this.charactersToAvoidInFileName,"_");
    // fileName += `.${formate?.container || "mp4"}`
    // const download_path  = path.join(this.workspacePath,fileName);
    // const singleVideo:ISingleVideo = {
    //   info:info,
    //   format:formate!,
    //   downloadPath:downloadPath
    // }
    //if(!playlistId) mainWindow?.webContents.send(Main_Events.ADD_SINGLE_DOWNLOAD_ITEM,singleVideo);
    video.pipe(fs.createWriteStream(downloadPath));
    video.on('data',(chunk)=>{
    })
    let progressChannel = Main_Events.HANDLE_PROGRESS_+info.videoDetails.videoId;
    if(playlistId) progressChannel+=playlistId;
    video.on('progress',(chunkSize:number)=>{
      let progress:IProgress={
        chunkSize:chunkSize,
        singleVideoId:info.videoDetails.videoId
      }
      console.log('progress');
      mainWindow?.webContents.send(progressChannel,progress);
    })
    let completeChannel = Main_Events.HANDLE_COMPLETE_+info.videoDetails.videoId;
    if(playlistId)completeChannel+=playlistId;
    video.on('end',()=>{
      console.log('download completed');
      let progress:IProgress={
        chunkSize:0,
        singleVideoId:info.videoDetails.videoId
      }
      mainWindow?.webContents.send(completeChannel,progress);
    })

  }
}
