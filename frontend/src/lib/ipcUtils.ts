import { RendererEvents } from "common_library";
import { ipcRenderer } from "electron";
import { IPlaylistFetchComplete } from "./interfaces";

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
}