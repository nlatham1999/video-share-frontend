import React, {useEffect, useState} from 'react';
import { Container, Button } from "react-bootstrap";
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
            Main Page 
            <Container>
                {users &&
                users.map((user, i) => (
                        <UserCell user={user} deleteUser={deleteUser} setUser={setUser}/>
                    ))
                }
            </Container>
            <AddUser addNewUser={addNewUser} addNewUserFlag={addNewUserFlag} setAddNewUserFlag={setAddNewUserFlag} newUser={newUser}/>

            <Button onClick={() => deleteAllUsers()}>Delete All Users</Button>
            <Button onClick={() => setAddNewUserFlag(true)}>Add New User</Button>
        </div>
    );

    function addNewUser(){
        console.log("adding new user")
        setAddNewUserFlag(false)
        axios.post(url + "user/add", {
                "email": newUser.email,
                "media": []
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
        axios.delete(url + "users/delete", {
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

    function getAllUsers() {
        console.log("getting all the users")
        axios.get(url + "users", {
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
        console.log("deleting order")
        axios.delete(url + "user/delete/" + id, {
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