import React, { ChangeEvent, FormEvent } from "react";
import { Button, Form } from 'react-bootstrap';
import {IoMdDownload} from 'react-icons/io'
import { IHomeState } from "./states";
import { ipcRenderer } from "electron";
import { Renderer_Events } from "../../constants/constants";
import { DownloadList } from "./subComponents/DownloadList";
import { Helper } from "../../lib/helpers";
import { getVideoID, validateID, validateURL } from "ytdl-core";
import { connect, ConnectedProps } from "react-redux";
import { ActionModal } from "../common/Modals";
import { ActionHome } from "./slice";
import { GiEuropeanFlag } from "react-icons/gi";
import { IReduxState } from "../../lib";

export class HomeComponent extends React.PureComponent<IHomeProps,IHomeState>{
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
              {/* <Button className="ml-1" type="submit"><IoMdDownload /></Button> */}
              {
                this.props.inFetch.length ? <GiEuropeanFlag className="icon-spin h1"/>:
                <Button className="ml-1" type="submit"><IoMdDownload /></Button>
              }
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
    if(!validateURL(this.state.url)) {
      this.props.dispatch(ActionModal.showAlertModal({
        msg:'Invalid URL'
      }));
      return;
    }
    const id = getVideoID(this.state.url);
    if(this.props.inFetch.includes(id)) return;
    if(!Helper.removeItemIfExist(id) )return;
    this.props.dispatch(ActionHome.addInFetch(id));
    ipcRenderer.send(Renderer_Events.START_DOWNLOAD, this.state.url);
  }
}

interface IHomeProps extends ConnectedProps<typeof connector>{

}

const mapStateToProps = (state:IReduxState)=>state.home;
const connector = connect(mapStateToProps);
export const Home = connector(HomeComponent);
