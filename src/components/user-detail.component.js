import React from 'react';
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const UserDetail = ({user}) => {

    if(!user || user == {}){
        return (
            <div>no user selected</div>
        )
    }
    return (
        <div>
            {user.email}
        </div>
    )

}

export default UserDetail;