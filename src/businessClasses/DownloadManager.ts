import { RendererEvents } from "common_library";
import { ipcMain } from "electron";
import * as ytdl from "ytdl-core";
import * as ytpl from "ytpl";

export class DownloadManager{
    start(){
        this.addIpcHandlers();
    }

    private addIpcHandlers(){
        this.addSingleVideoUrlValidator();
        this.addPlaylistUrlValidator();
        this.addVideoIdExtractor();
        this.addPlaylistIdExtractor();
        this.addVideoIdValidator();
    }

    private addSingleVideoUrlValidator(){
        ipcMain.on(RendererEvents.isValidVedioUrl().channel,(e,url:string)=>{
            e.returnValue = ytdl.validateURL(url);
        })
    }

    private addPlaylistUrlValidator(){
        ipcMain.on(RendererEvents.isValidVedioUrl().channel,(e,url:string)=>{
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
}