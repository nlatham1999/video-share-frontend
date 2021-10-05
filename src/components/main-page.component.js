import React, {useEffect, useState} from 'react';
import { Container, Button, Nav, Navbar, Card } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import UserCell from './user-cell.component';
import AddUser from './add-user.component';

const MainPage = ({setUser}) => {

    const [url, setUrl] = useState("http://localhost:5000/") 
    // const [url, setUrl] = useState("https://video-share-nlatham.herokuapp.com/") 

    const [refreshData, setRefreshData] = useState(true);
    const [users, setUsers] = useState([])
    const [addNewUserFlag, setAddNewUserFlag] = useState(false);
    const [newUser, setNewUser] = useState({"email" : "", "media":[]})

    if(refreshData){
        setRefreshData(false)
        getAllUsers()
    }

    return ( 
        <div >
            <Container>
                <Navbar>
                    <Navbar.Brand>
                        Video Share - Admin View
                    </Navbar.Brand>
                    <Button onClick={() => setAddNewUserFlag(true)}>Add New User</Button>
                    <Button variant="danger" onClick={() => deleteAllUsers()}>Nuke Database</Button>
                </Navbar>
            </Container>
            <Container>
                <Card>
                    <Card.Header>
                        Users
                    </Card.Header>
                    <Card.Body>
                        {users &&
                        users.map((user, i) => (
                                <UserCell user={user} deleteUser={deleteUser} setUser={setUser}/>
                            ))
                        }
                    </Card.Body>
                </Card>
            </Container>
            <AddUser addNewUser={addNewUser} addNewUserFlag={addNewUserFlag} setAddNewUserFlag={setAddNewUserFlag} newUser={newUser}/>

        </div>
    );

    function addNewUser(){
        console.log("adding new user")
        setAddNewUserFlag(false)
        axios.post(process.env.REACT_APP_URL + "user/add", {
                "email": newUser.email,
                "media": [],
                "shared": []
        },
        {
            'headers': {
                'X-Auth-Token': process.env.REACT_APP_API_KEY
            },
            responseType: 'json',
        }).then(response => {
            console.log(response.status)
            if(response.status == 200){
                setRefreshData(true)
            }
        })
    }

    function deleteAllUsers(){
        console.log("deleting all the users")
        axios.delete(process.env.REACT_APP_URL + "users/delete", {
            'headers': {
                'X-Auth-Token': process.env.REACT_APP_API_KEY
            },
            responseType: 'json',
        }).then(response => {
            console.log(response.status)
            if(response.status == 200){
                setRefreshData(true)
            }
        })
        deleteAllMediaFromS3()
    }

    function deleteAllMediaFromS3(){
        console.log("deleting all media from s3")
        axios.get(process.env.REACT_APP_URL+"media/empty-bucket",{
            'headers': {
                'X-Auth-Token': process.env.REACT_APP_API_KEY
            },
            responseType: 'json',
        }).then(response => {
            console.log(response.status)
        })
    }

    function getAllUsers() {
        console.log("getting all the users")
        axios.get(process.env.REACT_APP_URL + "users", {
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

    function deleteUser(id){
        console.log("deleting user")
        axios.delete(process.env.REACT_APP_URL + "user/delete/" + id, {
            'headers': {
                'X-Auth-Token': process.env.REACT_APP_API_KEY
            },
            responseType: 'json',
        }).then(response => {
            console.log(response.status)
            if(response.status == 200){
                setRefreshData(true)
            }
        })
    }
}

export default MainPage;