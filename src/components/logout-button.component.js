import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {Button} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/buttons.css'

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button variant="outline-dark" className="navigationButton" onClick={() => logout({ returnTo: window.location.origin })}>
      log out
    </Button>
  );
};

export default LogoutButton; 