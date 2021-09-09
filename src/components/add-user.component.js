import React, {useEffect, useState} from 'react';
import { Container, Button, Modal, Form} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const AddUser = ({addNewUserFlag, setAddNewUserFlag, addNewUser, newUser}) => {
    return (
        <Modal show={addNewUserFlag} onHide={() => setAddNewUserFlag(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add User</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form.Group>
                    <Form.Label >email</Form.Label>
                    <Form.Control onChange={(event) => {newUser.email = event.target.value}}/>
                </Form.Group>
                <Button onClick={() => addNewUser()}>Add</Button>
                <Button onClick={() => setAddNewUserFlag(false)}>Cancel</Button>
            </Modal.Body>
        </Modal>
    );
}

export default AddUser;