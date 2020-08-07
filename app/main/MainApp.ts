import { DownloadManager } from "./DownloadManager";

export class MainApp {
  constructor() {
    this.init();
  }

  init() {
    console.log('ok working');
    new DownloadManager();
  }
}
