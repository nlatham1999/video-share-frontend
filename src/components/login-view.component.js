import React, {useEffect, useState} from 'react';
import { Container, Button, Nav, Navbar, Card, Modal } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import UserCell from './user-cell.component';
import AddUser from './add-user.component';
import LoginButton from './login-button.component';
import LogoutButton from './logout-button.component';
import '../css/login-view.css'
import '../css/buttons.css'
import '../css/modal.css'

const LoginView = () => {

    const [showAboutFlag, setShowAboutFlag] = useState(false)

    return ( 
        <div >
            <Container className="container3">
                <LoginButton text={"login"}/>
                <LoginButton text={"sign up"}/>
            </Container>
            <Container className="container1">
                video share
            </Container>
            <Container className="container2">
                upload, share, and view media with ease
            </Container>
            <Container className="container4">
                <Button variant="outline-dark" className="button1" onClick={() => setShowAboutFlag(true)}>about</Button>
            </Container>

            <Modal className="modalOverall" show={showAboutFlag} onHide={() => setShowAboutFlag(false)} centered >
                <Modal.Header className="modalHeader2" closeButton>
                    Created by me (<a href="https://nicholaslatham.com">Nick Latham</a>)
                </Modal.Header>
                <Modal.Body >
                    Privacy Policy: <br/>
                    emails are stored but nothing is shared <br />
                    this is still in beta so don't share anything sensitive
                    <br /><br />
                    for media inquiries contact me at: nicholaslatham1999@gmail.com


    
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default LoginView;