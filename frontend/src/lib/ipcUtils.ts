import { IVideoInfo, RendererEvents } from "common_library";
import { ipcRenderer } from "electron";
import { IPlaylistFetchComplete, IProgress } from "./interfaces";

export class IpcUtils{
    static isValidVideoUrl(url:string){
        return ipcRenderer.sendSync(RendererEvents.isValidVedioUrl().channel,url) as boolean;
    }

    static isValidVideoId(videoId:string){
        return ipcRenderer.sendSync(RendererEvents.isValidVedioId().channel,videoId) as boolean;
    }

    static isValidPlaylistUrl(url:string){
        return ipcRenderer.sendSync(RendererEvents.isValidPlaylistUrl().channel,url) as boolean;
    }

    static getVideoId(url:string){
        return ipcRenderer.sendSync(RendererEvents.getVideoID().channel,url) as string;
    }

    static getPlaylistId(url:string){
        return ipcRenderer.sendSync(RendererEvents.getPlaylistID().channel,url) as string;
    }

    static fetchPlaylistInfo(playlistId:string){
        return new Promise<IPlaylistFetchComplete>((res)=>{
            ipcRenderer.on(RendererEvents.handlePlaylistFetchComplete().channel+playlistId,(_e, data: IPlaylistFetchComplete)=>{
                ipcRenderer.removeAllListeners(RendererEvents.handlePlaylistFetchComplete().channel+playlistId);
                res(data);
            })
            ipcRenderer.send(RendererEvents.fetchPlaylistInfo().channel ,playlistId);
        });
    }

    static openFolder(path:string){
        ipcRenderer.send(RendererEvents.openFolder().channel,path);
    }

    static handleDownloadProgress(id:string, callback:(progress:IProgress)=>void){
        const channel = RendererEvents.handleDownloadProgress().channel + id;
        ipcRenderer.on(channel,(_,progress:IProgress)=>{
            callback(progress);
        })
    }

    
    static handleDownloadComplete(id:string, callback:()=>void){
        const channel = RendererEvents.handleDownloadProgress().channel + id;
        ipcRenderer.on(channel,()=>{
            ipcRenderer.removeAllListeners(RendererEvents.handleDownloadProgress().channel+id);
            ipcRenderer.removeAllListeners(channel);
            callback();            
        })
    }

    static fetchVideoInfo(videoId:string){
        const channel = RendererEvents.fetchVideoInfo().channel;
        return new Promise<IVideoInfo>((res)=>{
            const info:IVideoInfo = ipcRenderer.sendSync(channel,videoId);
            res(info);
        });
    }

    static startVideoDownload(videoId:string,progressHanlder:(progress:IProgress) => void){
        const channel = RendererEvents.startVideoDownload().channel;
        return new Promise<IVideoInfo>((res)=>{
            const info:IVideoInfo = ipcRenderer.sendSync(channel,videoId);
            res(info);
        });
    }
}