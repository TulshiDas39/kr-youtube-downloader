import React, { ChangeEvent, FormEvent } from "react";
import { Button, Form } from 'react-bootstrap';
import {IoMdDownload} from 'react-icons/io'
import { IHomeState } from "./states";
import { ipcRenderer } from "electron";
import { Renderer_Events } from "../../constants/constants";
import { DownloadList } from "./subComponents/DownloadList";
import { Helper } from "../../common/helpers";
import { getVideoID, validateID } from "ytdl-core";

export class Home extends React.PureComponent<void,IHomeState>{
  state:IHomeState = {
    url:""
  }

  render(){
    return (
      <div className="container text-center">
        <h1 className="test">kr-youtube-downloader</h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="exampleForm.ControlInput1">
            {/* <Form.Label>URL</Form.Label> */}
            <div className="d-flex">
              <Form.Control type="text" placeholder="URL" value={this.state.url} onChange={this.handleChange} />
              <Button className="ml-1" type="submit"><IoMdDownload /></Button>
            </div>
          </Form.Group>
        </Form>
        <div>
          <DownloadList />
        </div>
      </div>
    )
  }

  handleChange=(e:ChangeEvent<HTMLInputElement>)=>{
    this.setState({url:e.target.value});
  }

  handleSubmit=(e:FormEvent<HTMLElement>)=>{
    e.preventDefault();
    const id = getVideoID(this.state.url);
    if(!Helper.downloadExist(id) && validateID(id)) ipcRenderer.send(Renderer_Events.START_DOWNLOAD, this.state.url);
  }
}
