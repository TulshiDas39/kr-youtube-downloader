import { IPlaylistFetchResult } from "./IPlaylistFetchResult";

export interface IPlaylistFetchComplete{
    result: IPlaylistFetchResult;
    downloadPath:string;
}
