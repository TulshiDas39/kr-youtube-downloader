import * as path from "path";
import { app } from "electron";

export class ConstantMain{
  static worksPaceFolderName = "kr_youtube_downloader";
  static worksPaceDir = path.join(app.getPath('videos'),ConstantMain.worksPaceFolderName);

}
