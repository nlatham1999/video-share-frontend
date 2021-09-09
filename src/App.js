import logo from './logo.svg';
// import './App.css';
import { NavLink, Switch, Route, BrowserRouter } from 'react-router-dom';
import MainPage from './components/main-page.component';
import UserDetail from './components/user-detail.component';
import { useState } from 'react';

function App() {

  const [user, setUser] = useState({})

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={props => <MainPage setUser={setUser}/>}></Route>
        <Route exact path='/user' component={props => <UserDetail user={user}/>}></Route>
      </Switch>
    </BrowserRouter>
  );
}


export default App;
