import React from 'react';
import { Container, Card } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';


const UserCell = ({user}) => {
    return(
        <Card>
            {user.email}
        </Card>
    );
}

export default UserCell;