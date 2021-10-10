import React, {useEffect, useState} from 'react';
import { Container, Button, Nav, Navbar, Card } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import UserCell from './user-cell.component';
import AddUser from './add-user.component';
import LoginButton from './login-button.component';
import LogoutButton from './logout-button.component';

const LoginView = () => {
    return ( 
        <div >
            <Container>
                <Navbar>
                    <Navbar.Brand>
                        Video Share - Admin View
                    </Navbar.Brand>
                    <LoginButton />
                    <LogoutButton />
                </Navbar>
            </Container>
        </div>
    );
}

export default LoginView;