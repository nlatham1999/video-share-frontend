import React, {useEffect, useState} from 'react';
import { Container, Button, Col, Navbar, Nav} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import LogoutButton from './logout-button.component';
import '../css/buttons.css'
import '../css/user-detail.css'
import '../css/card.css'
import '../css/modal.css'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const API_URL = process.env.REACT_APP_URL || "any-default-local-build_env";

const NavigationBar = ({userObject, setUserMediaShown, setAddVideoFlag}) => {
    return (
        <Container style={{marginTop: "2vh"}}>
                <LogoutButton />{' '}
                {userObject.email}
                <Navbar className="navigationBar">
                        <Col xs="auto">
                            <Nav>
                                <Nav.Link className="navigationText" style={{paddingLeft: 0}} href="#myvideos" onClick={() => setUserMediaShown(true)}>my media</Nav.Link>
                                <Nav.Link className="navigationText" href="#shared" onClick={() => setUserMediaShown(false)}>shared with me</Nav.Link>
                            </Nav>
                        </Col>
                        <Col className="buttonGroup">
                            <Button variant="outline-dark" className="navigationButton" onClick={() => setAddVideoFlag(true)}>add media</Button>
                        </Col>
                </Navbar>
            </Container>
    );
}

export default NavigationBar;