import React, {useEffect, useState} from 'react';
import { Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import UserCell from './user-cell.component';

const MainPage = () => {

    const [refreshData, setRefreshData] = useState(true);
    const [users, setUsers] = useState([])

    if(refreshData){
        setRefreshData(false)
        getAllUsers()
    }

    return ( 
        <div >
            Main Page 
            <Container>
                {
                users.map((user, i) => (
                        <UserCell user={user}/>
                    ))
                }
            </Container>
        </div>
    );

    function getAllUsers() {
        console.log("getting all the users")
        axios.get("https://video-share-nlatham.herokuapp.com/users", {
            'headers': {
                'X-Auth-Token': process.env.REACT_APP_API_KEY
            },
            responseType: 'json',
        }).then(response => {
            console.log(response.status)
            if(response.status == 200){
                setUsers(response.data)
            }
        })
    }
}

export default MainPage;