import logo from './logo.svg';
// import './App.css';
import { NavLink, Switch, Route, BrowserRouter } from 'react-router-dom';
import LoginView from './components/login-view.component';
import UserDetail from './components/user-detail.component';
import { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

function App() {

  const { isLoading, error, isAuthenticated } = useAuth0();
  
  if (error) {
    return <div>Oops... {error.message}</div>;
  } 

  if (isLoading) {
    return <div>Loading</div>;
  }

  if(isAuthenticated){
    return <UserDetail />
  }else{
    return <LoginView />
  }


  // return (
  //   <BrowserRouter>
  //     <Switch>
  //       <Route exact path='/' component={props => <MainPage setUser={setUser}/>}></Route>
  //       <Route exact path='/user' component={props => <UserDetail user={user}/>}></Route>
  //     </Switch>
  //   </BrowserRouter>
  // );
}


export default App;
