import React from "react";
import { Modals } from "../components/common/Modals";

export class Layout extends React.PureComponent{
  render(){
    return (
      <div>
        <Modals/>
        {this.props.children}
      </div>
    )
  }
}
