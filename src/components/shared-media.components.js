import React from 'react';
import { Container, Card, Button, Row, Col, Navbar, Nav, Modal, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/buttons.css'
import '../css/user-detail.css'
import '../css/card.css'

const SharedMedia = ({sharedWithMe, onViewButtonClicked}) => {
    return (
        <div>
            {/* displays shared media */}
            <Container id="shared">
                <Card className="cardOverall">
                    <Card.Header className="cardHeader">
                        shared with me
                    </Card.Header>
                    <Card.Body className="cardBody">
                        {sharedWithMe &&
                        sharedWithMe.map((video, i) => (
                            <div style={{"paddingBottom": "1%"}}>
                                <Row >
                                    <Col >
                                        {video.name}<br />
                                        {video.owner}
                                    </Col>
                                    <Col style={{textAlign: "right"}}>
                                        <Button className="mediaCellButtonVariant2" variant="outline-dark" onClick={()=> onViewButtonClicked(video.location)}>view</Button>
                                    </Col>
                                </Row>
                            </div>
                        ))
                        }
                    </Card.Body>
                </Card>
            </Container>    
        </div>
    );
}

export default SharedMedia;