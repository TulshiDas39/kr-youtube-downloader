import React from "react";

export class Layout extends React.PureComponent{
  render(){
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
