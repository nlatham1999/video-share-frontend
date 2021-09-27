import React from 'react';
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link} from 'react-router-dom';


const UserCell = ({user, deleteUser, setUser}) => {
    return(
        <div style={{"paddingBottom": "1%"}}>
            <Row>
                <Col>
                    {user.email}
                </Col>
                <Col>
                </Col>
                <Col>
                    <Link to={"/user"} style={{textDecoration: "none"}}>
                        <Button onClick={() => setUser(user)} >View</Button>{' '}
                    </Link>
                    <Button variant="danger" onClick={() => deleteUser(user._id)}>Delete</Button>
                </Col>
            </Row>
        </div>
    );
}

export default UserCell;