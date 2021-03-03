import React, {  } from "react";
import './home.css';

interface IState{
  
}


 function HomeComponent(){
   
    return (
      <div className="container text-center homeComponent">
        hello
      </div>
    )
}


// const mapStateToProps = (state:IReduxState)=>state.home;
// const connector = connect(mapStateToProps);
export const Home = React.memo(HomeComponent);
