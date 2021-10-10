import React, {useEffect, useState} from 'react';
import { Container, Button, Nav, Navbar, Card } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import UserCell from './user-cell.component';
import AddUser from './add-user.component';
import LoginButton from './login-button.component';
import LogoutButton from './logout-button.component';
import '../css/login-view.css'

const LoginView = () => {
    return ( 
        <div >
            <Container class="container">
                Video Share
            </Container>
            <LoginButton />
        </div>
    );
}

export default LoginView;