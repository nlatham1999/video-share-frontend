import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {Button} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/buttons.css'

const LoginButton = ({text}) => {
  const { loginWithRedirect } = useAuth0();

  return <Button variant="outline-dark" className="button1" onClick={() => loginWithRedirect()}>{text}</Button>;
};

export default LoginButton;