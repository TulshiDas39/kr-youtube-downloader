import { IVideoInfo } from "common_library";

export class Helper{
  static downloadExist:(id:string)=>boolean = ()=>{
    return false;
  }
  static downloadInProgress:(id:string)=>boolean = ()=>{
    return false;
  }
  static removeItemIfExist:(id:string)=>boolean=()=>{
    return false;
  }
  static setContentLengthIfNotExist(info:IVideoInfo){
    const formatsWithNoContentSize = info.formats.filter(x=> !x.contentLength || isNaN(x.contentLength as any));
    for(let format of formatsWithNoContentSize){
      const bitrate = 30000;//format.averageBitrate || format.bitrate!;
      format.contentLength = (bitrate * +info.videoDetails.lengthSeconds)+"";
      format.isContentLengthCalculated = true;
    }
  }

}
