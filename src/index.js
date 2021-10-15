import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from "@auth0/auth0-react";

const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN || "any-default-local-build_env"
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID || "any-default-local-build_env"

ReactDOM.render(
  // <React.StrictMode>
  
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={CLIENT_ID}
      redirectUri={window.location.origin}
      audience="https://videoshare/api"
      scope="update:user"
      
    >
      {console.log(window.location.origin)}
    <App />
    </Auth0Provider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
