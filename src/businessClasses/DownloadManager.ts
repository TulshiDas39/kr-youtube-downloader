import { Constants, IPlaylistFetchComplete, IProgress, ISingleVideoDownloadFromInfo, ISingleVideoDownloadStarted, IVideoFormat, IVideoInfo, RendererEvents } from "common_library";
import { ipcMain } from "electron";
import * as ytdl from "ytdl-core";
import * as ytpl from "ytpl";
import { FileManager } from "./FileManager";
import * as path from "path";
import { AppData, ConstantMain } from "../dataClasses";
import * as fs from 'fs';

export class DownloadManager{

    readonly charactersToAvoidInFileName = /[#%&{}\\<>*?\/\s$!'":@+`|=]/g
    readonly workspacePath = ConstantMain.worksPaceDir;
    
    start(){
        this.addIpcHandlers();
    }

    private addIpcHandlers(){
        this.addSingleVideoUrlValidator();
        this.addPlaylistUrlValidator();
        this.addVideoIdExtractor();
        this.addPlaylistIdExtractor();
        this.addVideoIdValidator();
        this.handleSingleVideoInfoFetch();
        this.handlePlaylistVideoInfoFetch();
        this.handleSingleVideoDownloadFromInfo();
    }

    private addSingleVideoUrlValidator(){
        ipcMain.on(RendererEvents.isValidVedioUrl().channel,(e,url:string)=>{
            e.returnValue = ytdl.validateURL(url);
        })
    }

    private addPlaylistUrlValidator(){
        ipcMain.on(RendererEvents.isValidPlaylistUrl().channel,(e,url:string)=>{
            e.returnValue = ytpl.validateID(url);
        })
    }
    private addVideoIdExtractor(){
        ipcMain.on(RendererEvents.getVideoID().channel,(e,url:string)=>{
            e.returnValue = ytdl.getVideoID(url);
        })
    }

    private addPlaylistIdExtractor(){
        ipcMain.on(RendererEvents.getPlaylistID().channel, async (e,url:string)=>{
            e.returnValue = await ytpl.getPlaylistID(url);
        })
    }

    private addVideoIdValidator(){
        ipcMain.on(RendererEvents.isValidVedioId().channel, (e,videoId:string)=>{
            e.returnValue = ytdl.validateID(videoId);
        })
    }

    handleSingleVideoInfoFetch=()=>{
        ipcMain.on(RendererEvents.fetchVideoInfo().channel, (_event,id:string) => {
    
          ytdl.getInfo(Constants.URL_PREFIX+id).then(data=>{            
            _event.returnValue = data;
          });
        })
    }

    handlePlaylistVideoInfoFetch=()=>{
      ipcMain.on(RendererEvents.fetchPlaylistInfo().channel, async(e,playlistId:string)=>{
        const info = await this.fetchPlaylistInfo(playlistId);
        e.returnValue = info;
      });
    }

    async fetchPlaylistInfo(id:string){
      // const id = await ytpl.getPlaylistID(url);
      return ytpl(id).then(result=>{
        const folderName = result.title.replace(this.charactersToAvoidInFileName,"_");
        const downloadPath = path.join(ConstantMain.worksPaceDir,folderName);
        let data:IPlaylistFetchComplete={
          result: result,
          downloadPath:downloadPath,
        }
        return data;
      });
    }

    handleSingleVideoDownloadFromInfo(){
        ipcMain.on(RendererEvents.startVideoDownload().channel, (e,data:ISingleVideoDownloadFromInfo) => {
          let fileName = data.info.videoDetails.title.toString()?.replace(this.charactersToAvoidInFileName,"_");
          fileName += `.${data.selectedVideoFormat.container}`
          const download_path  = path.join((data.downloadPath || this.workspacePath),fileName);
          const downloadStartedData:ISingleVideoDownloadStarted={
            downloadPath: download_path,
          }
          
        //   let downloadStartedChannel = Main_Events.HANDLE_SINGLE_VIDEO_DOWNLOAD_STARTED_+data.info.videoDetails.videoId;
          if(data.playlistId){
            // downloadStartedChannel+=data.playlistId;        
            const playlistFolder = path.basename(data.downloadPath!);
            FileManager.createPlaylistFolderIfDoesnotExist(playlistFolder);
          }
          else
            FileManager.checkForWorksPace();
          e.returnValue = downloadStartedData;
        //   mainWindow?.webContents.send(downloadStartedChannel,downloadStartedData);
          this.downloadVideoFromInfo(data.info,data.selectedVideoFormat,download_path,data.playlistId);
        })
    }

    downloadVideoFromInfo(info:IVideoInfo ,formate:IVideoFormat,downloadPath:string,playlistId?:string){
        // const formate = info.formats.find(x=>x.itag === this.formate);
        const video = ytdl.downloadFromInfo(info as ytdl.videoInfo,{quality:formate.itag});
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
        let progressChannel = RendererEvents.handleDownloadProgress().channel+info.videoDetails.videoId;
        if(playlistId) progressChannel+=playlistId;
        video.on('progress',(chunkSize:number)=>{
          let progress:IProgress={
            chunkSize:chunkSize,
            singleVideoId:info.videoDetails.videoId
          }
          console.log("progress",progress);
          AppData.mainWindow?.webContents.send(progressChannel,progress);
        })
        let completeChannel = RendererEvents.handleDownloadComplete().channel + info.videoDetails.videoId;
        if(playlistId) completeChannel += playlistId;
        video.on('end',()=>{
          let progress:IProgress={
            chunkSize:0,
            singleVideoId:info.videoDetails.videoId
          }
          AppData.mainWindow?.webContents.send(completeChannel,progress);
        })
    
      }
}