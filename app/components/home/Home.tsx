import React from "react";
import { FaBeer } from 'react-icons/fa';
import { Button } from 'react-bootstrap';


export class Home extends React.PureComponent{
  render(){
    return (
      <div>
        <h1 className="test">home component</h1>
        <h3> Lets go for a <FaBeer />? </h3>
        <Button variant="primary">Primary</Button>
      </div>
    )
  }
}
