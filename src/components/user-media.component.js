import React from 'react';
import { Container, Card, Button, Row, Col, Navbar, Nav, Modal, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/buttons.css'
import '../css/user-detail.css'
import '../css/card.css'

const UserMedia = ({myVideos, onViewButtonClicked, setSelectedVideo, setManageAccessFlag, deleteSingleMedia}) => {
    return (
        <div>
            {/* displays the media */}
            <Container id="myvideos">
                <Card className="cardOverall">
                    <Card.Header className="cardHeader">
                        my media
                    </Card.Header>
                    <Card.Body className="cardBody">
                        {myVideos && myVideos[0] &&
                        myVideos.map((video, i) => (
                            <div style={{"paddingBottom": "1%"}}>
                                <Row>
                                    <Col>
                                        {video.name}<br/>
                                        shared with: {video.viewers && video.viewers.length}
                                    </Col>
                                    <Col xs={6} style={{textAlign: "right", padding: 0}}>
                                        <Button className="mediaCellButtonVariant2" variant="outline-dark" onClick={()=> onViewButtonClicked(video.location)}>view</Button> {' '}
                                        <Button className="mediaCellButton" variant="outline-dark" onClick={() => {setSelectedVideo(video); setManageAccessFlag(true)}}>share</Button>{' '}
                                        <Button className="mediaCellButtonDanger" variant="outline-dark" onClick={() => deleteSingleMedia(video._id, i)}>delete</Button>
                                    </Col>
                                </Row>   
                            
                            </div>
                            ))
                        }
                    </Card.Body>
                </Card>
            </Container>
        </div>
    )
}

export default UserMedia;