import { MainEvents } from "common_library";
import { app, BrowserWindow, Menu } from "electron";
import { autoUpdater } from "electron-updater";
import express = require("express");
import getPort = require("get-port");
import * as path from "path";
import { DataManager } from "./businessClasses";
import { FileManager } from "./businessClasses/FileManager";
import { GitManager } from "./businessClasses/GitManager";
import { Updater } from "./businessClasses/Updater";
import { ConfigInfo } from "./dataClasses";
import { AppData } from "./dataClasses/AppData";
import { SavedData } from "./dataClasses/SavedData";
import { DB } from "./db_service/db_service";
import { Settings } from "./settings";

export class Startup{
    private uiPort = 54523;

    async initilise(){
      //this.initAppData();
      this.checkForUpdate();
      await this.loadSavedData();      
      await this.hostFrontend();
      this.startIpcManagers();
    }

    checkForUpdate(){
      if(Settings.ENV === 'DEVELOPMENT')
        return;
        new Updater().checkForUpdate();


    }

    start(){
        
        // this.createWindow();          
          // This method will be called when Electron has finished
          // initialization and is ready to create browser windows.
          // Some APIs can only be used after this event occurs.
        this.handleReadyState();
        this.handleAppFocus();
          
          // Quit when all windows are closed, except on macOS. There, it's common
          // for applications and their menu bar to stay active until the user quits
          // explicitly with Cmd + Q.
        this.handleWindowClosed();
          
          // In this file you can include the rest of your app"s specific main process
          // code. You can also put them in separate files and require them here.
          
    }


    private async loadSavedData(){
        SavedData.recentRepositories = DB.repository.getAll();        
        SavedData.configInfo = DB.config.getAll()[0];
        if(!SavedData.configInfo){
          const record={
            portNumber:54523
          } as ConfigInfo;
          await DB.config.insertOneAsync(record);
          SavedData.configInfo = DB.config.getAll()[0];;
        }
    }

    private async setAvailablePort(){        
        
        let portNumber = SavedData.configInfo.portNumber || 54523;
        try{          
          let availablePort = await getPort({port:portNumber});

          if(SavedData.configInfo.portNumber !== availablePort){
            SavedData.configInfo.portNumber = availablePort;
            DB.config.updateOne(SavedData.configInfo);
          }
          this.uiPort = availablePort;
          return availablePort;
        }catch(e){
          console.error(e);
          this.uiPort = 54522;
        }
    }

    private async hostFrontend(){
      if(Settings.ENV === 'DEVELOPMENT'){
        this.uiPort = Settings.FRONTEND_PORT;
        return;
      }
      await this.setAvailablePort();
      
      const app = express();

      // serve static assets normally
      app.use(express.static(__dirname + '/frontend'));

      // handle every other route with index.html, which will contain
      // a script tag to your application's JavaScript file(s).
      app.get('*', function (request, response) {
        response.sendFile(path.resolve(__dirname,"frontend", 'index.html'));
      });

      app.listen(this.uiPort);
      console.log("server started on port " + this.uiPort);
       
    }

    private async  createWindow() {
        if(Settings.ENV !== 'DEVELOPMENT')
          Menu.setApplicationMenu(null);
        const mainWindow = new BrowserWindow({
          height: 600,
          webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation:false,
          },
          width: 800,
        });
        mainWindow.maximize();
        AppData.mainWindow = mainWindow;
        console.log("Loading ui app in port:"+this.uiPort);
        mainWindow.loadURL(`http://localhost:${this.uiPort}`);
        
        if(Settings.ENV === 'DEVELOPMENT')
          mainWindow.webContents.openDevTools();
    }

    private handleReadyState(){
        app.on("ready", async () => {
            await this.initilise();
            await this.createWindow();
          
            app.on("activate", function () {
              // On macOS it's common to re-create a window in the app when the
              // dock icon is clicked and there are no other windows open.
              if (BrowserWindow.getAllWindows().length === 0) this.createWindow();
            });
        });
    }

    private handleAppFocus(){
      app.on("browser-window-focus", () => {          
          if(AppData.mainWindow?.webContents){            
            AppData.mainWindow.webContents.send(MainEvents.AppFocused);
          }
      });
  }

    private handleWindowClosed(){
        app.on("window-all-closed", () => {
            if (process.platform !== "darwin") {
              app.quit();
            }
        });
    }

    private startIpcManagers(){
      new DataManager().start();
      new GitManager().start();
      new FileManager().start();
    }

}