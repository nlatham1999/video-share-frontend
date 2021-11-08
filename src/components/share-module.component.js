import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Card, Button, Row, Col, Modal, Form, Alert} from "react-bootstrap";

const ShareModal = ({manageAccessFlag, closeAccessManagerPopup, modalAlertFlag, modalAlertMessage, setModalAlertFlag, setNewAccessor, addAccessor, selectedVideo, removeAccessor}) => {

    return (
        <Modal className="modalOverall" show={manageAccessFlag} onHide={() => closeAccessManagerPopup()} centered>
            <Modal.Header className="modalHeader" closeButton>
                <Modal.Title>manage access</Modal.Title>
                {modalAlertFlag && 
                    <Alert variant="danger" onClose={() => setModalAlertFlag(false)} dismissible>
                        {modalAlertMessage}
                    </Alert>
                }
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label >new accessor</Form.Label>
                        <Form.Control className="textBox" onChange={(event) => {setNewAccessor(event.target.value)}}/>
                    </Form.Group>
                    <Button className="modalButton" variant="outline-dark" onClick={() => addAccessor()}>Add</Button>
                </Form>
            </Modal.Body>
            <Modal.Body className="modalBody">
                {selectedVideo && selectedVideo.viewers && selectedVideo.viewers.map((viewer, i) => (
                        <Card className="modalList">
                            <Row>
                                <Col>
                                    {viewer}
                                </Col>
                                <Col >
                                    <Button className="modalButton" variant="outline-dark" variant="outline-dark" onClick={() => removeAccessor(viewer, i)}>remove</Button>
                                </Col>
                            </Row>
                        </Card>
                    ))
                }
            </Modal.Body>
            <Modal.Footer className="modalFooter">
                <Button className="modalButton" variant="outline-dark" onClick={() => closeAccessManagerPopup()}>Close</Button>
            </Modal.Footer>
        </Modal>
            
    )

}

export default ShareModal;