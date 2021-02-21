import React from "react";
import { Modals } from "../components/common/Modals";

export class Layout extends React.PureComponent{
  render(){
    return (
      <div style={{height:'100vh',overflow:'overlay'}}>
        <Modals/>
        {this.props.children}
      </div>
    )
  }
}
