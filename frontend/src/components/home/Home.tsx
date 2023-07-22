import React, { ChangeEvent, FormEvent } from "react";
import { IpcUtils, useMultiState } from "../../lib";
import { Button, Form } from "react-bootstrap";
import { useSelectorTyped } from "../../store/rootReducer";
import { ModalData } from "../common/Modals/ModalData";
import { useDispatchTyped } from "../../store";
import { ModalName } from "../../lib/constants";
import { GiEuropeanFlag } from "react-icons/gi";
import { FaAngleDoubleDown } from "react-icons/fa";
import { DownloadList } from "./subComponents/DownloadList";
import { ActionModal } from "../../store/slices/modalSlice";
import { ActionHome } from "../../store/slices";


interface IHomeState {
    url:string
};

function HomeComponent(){
    const [state,setState] = useMultiState<IHomeState>({url:""});
    const store = useSelectorTyped(state=>({
        downloadIds:state.home.downloadIds,
        inFetch:state.home.inFetch,
    }));

    const dispatch = useDispatchTyped();

    const handleSubmit = async(e:FormEvent<HTMLElement>)=>{
        e.preventDefault();
        let id:string;
        let errorMsg = "Do you want to remove existing item?";
        if(IpcUtils.isValidVideoUrl(state.url)){
          id = IpcUtils.getVideoId(state.url);
          if(store.downloadIds.includes(id)){
            ModalData.ConfirmationModal.description=errorMsg;
            ModalData.ConfirmationModal.onConfirm=() => dispatch(ActionHome.removeDownload(id));
            dispatch(ActionModal.openModal(ModalName.CONFIRMATION_MODAL))
          }
          else dispatch(ActionHome.addNewDownload(id));
          // ipcRenderer.send(Renderer_Events.START_DOWNLOAD, this.state.url);
        }
        else if(IpcUtils.isValidPlaylistUrl(state.url)){
          id = IpcUtils.getPlaylistId(state.url);
          if(store.downloadIds.includes(id)){
            ModalData.ConfirmationModal.description = errorMsg;
            ModalData.ConfirmationModal.onConfirm=() => dispatch(ActionHome.removeDownload(id));
            dispatch(ActionModal.openModal(ModalName.CONFIRMATION_MODAL))
          }
          else dispatch(ActionHome.addNewDownload(id));
        }
    }

    const handleChange=(e:ChangeEvent<HTMLInputElement>)=>{
        setState({url:e.target.value});
    }

    return (
      <div className="container text-center homeComponent">
        <h1 className="test">kr-youtube-downloader</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="exampleForm.ControlInput1">
            {/* <Form.Label>URL</Form.Label> */}
            <div className="d-flex">
              <Form.Control type="text" placeholder="URL" value={state.url} onChange={handleChange} />
              {/* <Button className="ml-1" type="submit"><IoMdDownload /></Button> */}
              {
                store.inFetch.length ? <GiEuropeanFlag className="icon-spin h1"/>:
                <Button className="ml-1" title="Fetch" type="submit"><FaAngleDoubleDown /></Button>
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

export const Home = React.memo(HomeComponent);