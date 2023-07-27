interface IChannelModel{
    channel:string;
    replyChannel:string;
}

export class RendererEvents{
    private static replyChanelPrefix = "reply_";
    static getRecentRepositoires= "getRecentRepositoires";
    static updateRepositories="updateRepositories";
    static isValidRepoPath="isValidRepoPath";
    static openFileExplorer="openFileExplorer";
    static logger="logger";
    
    static getDirectoryPath(){
        const channel = "getDirectoryPath";
        const result:IChannelModel={
            channel,
            replyChannel: RendererEvents.replyChanelPrefix+channel
        }
        return result;
    }

    static getFileContent(){
        const channel = "getFileContent";
        const result:IChannelModel={
            channel,
            replyChannel: RendererEvents.replyChanelPrefix+channel
        }
        return result;
    }

    static isValidVedioUrl(){
        const channel = "isValidVedioUrl";
        const result:IChannelModel={
            channel,
            replyChannel: RendererEvents.replyChanelPrefix+channel
        }
        return result;
    }

    static isValidVedioId(){
        const channel = "isValidVedioId";
        const result:IChannelModel={
            channel,
            replyChannel: RendererEvents.replyChanelPrefix+channel
        }
        return result;
    }

    static isValidPlaylistUrl(){
        const channel = "isValidPlaylistUrl";
        const result:IChannelModel={
            channel,
            replyChannel: RendererEvents.replyChanelPrefix+channel
        }
        return result;
    }

    static getVideoID(){
        const channel = "getVideoID";
        const result:IChannelModel={
            channel,
            replyChannel: RendererEvents.replyChanelPrefix+channel
        }
        return result;
    }

    static getPlaylistID(){
        const channel = "getPlaylistID";
        const result:IChannelModel={
            channel,
            replyChannel: RendererEvents.replyChanelPrefix+channel
        }
        return result;
    }    

    static fetchPlaylistInfo(){
        const channel = "fetchPlaylistInfo";
        const result:IChannelModel={
            channel,
            replyChannel: RendererEvents.replyChanelPrefix+channel
        }
        return result;
    }

    static handlePlaylistFetchComplete(){
        const channel = "handlePlaylistFetchComplete";
        const result:IChannelModel={
            channel,
            replyChannel: RendererEvents.replyChanelPrefix+channel
        }
        return result;
    }

    static openFolder(){
        const channel = "openFolder";
        const result:IChannelModel={
            channel,
            replyChannel: RendererEvents.replyChanelPrefix+channel
        }
        return result;
    }

    static handleDownloadProgress(){
        const channel = "handleDownloadProgress";
        const result:IChannelModel={
            channel,
            replyChannel: RendererEvents.replyChanelPrefix+channel
        }
        return result;
    }


    static handleDownloadComplete(){
        const channel = "handleDownloadComplete";
        const result:IChannelModel={
            channel,
            replyChannel: RendererEvents.replyChanelPrefix+channel
        }
        return result;
    }

    static fetchVideoInfo(){
        const channel = "fetchVideoInfo";
        const result:IChannelModel={
            channel,
            replyChannel: RendererEvents.replyChanelPrefix+channel
        }
        return result;
    }

    static videoFetchComplete(){
        const channel = "videoFetchComplete";
        const result:IChannelModel={
            channel,
            replyChannel: RendererEvents.replyChanelPrefix+channel
        }
        return result;
    }

    static startVideoDownload(){
        const channel = "startVideoDownload";
        const result:IChannelModel={
            channel,
            replyChannel: RendererEvents.replyChanelPrefix+channel
        }
        return result;
    }
    
}

