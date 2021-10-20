import React from 'react';
import { Container, Button, Modal, Form, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/buttons.css'
import '../css/user-detail.css'
import '../css/card.css'
import '../css/modal.css'

const API_URL = process.env.REACT_APP_URL || "any-default-local-build_env";

const AddMedia = ({addVideoFlag, setAddVideoFlag, modalAlertFlag, setModalAlertFlag, modalAlertMessage, addMedia, newVideo, onFileChange}) => {
    return (
        <Modal className="modalOverall" show={addVideoFlag} onHide={() => setAddVideoFlag(false)} centered>
                <Modal.Header className="modalHeader" closeButton>
                    <Modal.Title>add media</Modal.Title>
                    {modalAlertFlag && 
                        <Alert variant="danger" onClose={() => setModalAlertFlag(false)} dismissible>
                            {modalAlertMessage}
                        </Alert>
                    }
                </Modal.Header>

                <Modal.Body>
                    <Form.Group>
                        <Form.Label >name</Form.Label>
                        <Form.Control className="textBox" onChange={(event) => {newVideo.name = event.target.value}}/>
                    </Form.Group>
                    <input type="file" onChange={onFileChange}/>
                </Modal.Body>
                <Modal.Footer className="modalFooter">
                    <Button className="modalButton" variant="outline-dark" onClick={() => addMedia()}>add</Button>
                    <Button className="modalButton" variant="outline-dark" onClick={() => setAddVideoFlag(false)}>cancel</Button>
                </Modal.Footer>
            </Modal>
    )
}

export default AddMedia;