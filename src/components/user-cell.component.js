import React from 'react';
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link} from 'react-router-dom';


const UserCell = ({user, deleteUser, setUser}) => {
    return(
        <Card>
            <Row>
                <Col>{user.email}</Col>
                <Link to={"/user"} style={{textDecoration: "none"}}>
                    <Col><Button onClick={() => setUser(user)} >View</Button></Col>
                </Link>
                <Col><Button onClick={() => deleteUser(user._id)}>Delete</Button></Col>
            </Row>
        </Card>
    );
}

export default UserCell;