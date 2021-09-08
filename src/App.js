import logo from './logo.svg';
// import './App.css';
import { NavLink, Switch, Route, BrowserRouter } from 'react-router-dom';
import MainPage from './main-page.component';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={props => <MainPage/>}></Route>
      </Switch>
    </BrowserRouter>
  );
}


export default App;
