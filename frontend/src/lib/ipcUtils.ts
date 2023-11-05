import { IPlaylistFetchComplete, IProgress, ISingleVideoDownloadFromInfo, ISingleVideoDownloadStarted, IVideoInfo, RendererEvents } from "common_library";

export class IpcUtils{
    static isValidVideoUrl(url:string){
        return window.ipcRenderer.sendSync(RendererEvents.isValidVedioUrl().channel,url) as boolean;
    }

    static isValidVideoId(videoId:string){
        return window.ipcRenderer.sendSync(RendererEvents.isValidVedioId().channel,videoId) as boolean;
    }

    static isValidPlaylistUrl(url:string){
        return window.ipcRenderer.sendSync(RendererEvents.isValidPlaylistUrl().channel,url) as boolean;
    }

    static getVideoId(url:string){
        return window.ipcRenderer.sendSync(RendererEvents.getVideoID().channel,url) as string;
    }

    static getPlaylistId(url:string){
        return window.ipcRenderer.sendSync(RendererEvents.getPlaylistID().channel,url) as string;
    }

    static fetchPlaylistInfo(playlistId:string){
        return new Promise<IPlaylistFetchComplete>((res)=>{
            const info:IPlaylistFetchComplete = window.ipcRenderer.sendSync(RendererEvents.fetchPlaylistInfo().channel ,playlistId);
            res(info);
        });
    }

    static openFolder(path:string){
        window.ipcRenderer.send(RendererEvents.openFolder().channel,path);
    }

    static handleDownloadProgress(channelId:string, callback:(progress:IProgress)=>void){
        const channel = RendererEvents.handleDownloadProgress().channel + channelId;
        window.ipcRenderer.on(channel,(_,progress:IProgress)=>{
            callback(progress);
        })
    }

    
    static handleDownloadComplete(id:string, callback:(progress:IProgress)=>void){
        const channel = RendererEvents.handleDownloadComplete().channel + id;
        window.ipcRenderer.on(channel,(_,info:IProgress)=>{
            window.ipcRenderer.removeAllListeners(RendererEvents.handleDownloadProgress().channel+id);
            window.ipcRenderer.removeAllListeners(channel);
            callback(info);   
        })
    }

    static fetchVideoInfo(videoId:string){
        const channel = RendererEvents.fetchVideoInfo().channel;
        return new Promise<IVideoInfo>((res)=>{
            window.ipcRenderer.invoke(channel,videoId).then((info:IVideoInfo )=>{
                res(info);
            });
        });
    }

    static startVideoDownload(data:ISingleVideoDownloadFromInfo,progressHanlder:(progress:IProgress) => void,
        completeHandler:(data:IProgress)=>void){

        let channelId = data.info?.videoDetails?.videoId;
        if(data.playlistId) channelId += data.playlistId;
        this.handleDownloadProgress(channelId,progressHanlder);  
        this.handleDownloadComplete(channelId,completeHandler);

        const channel = RendererEvents.startVideoDownload().channel;
        return new Promise<ISingleVideoDownloadStarted>((res)=>{
            const info:ISingleVideoDownloadStarted = window.ipcRenderer.sendSync(channel,data);
            res(info);
        });
    }
}