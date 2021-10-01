import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Container, Card, Button, Row, Col, Navbar, Nav, Modal, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const UserDetail = ({user}) => {

    const [myVideos, setMyVideos] = useState([])
    const [sharedWithMe, setSharedWithMe] = useState([])
    const [refreshMyVideos, setRefreshMyVideos] = useState(true)
    const [refreshSharedVideos, setRefreshSharedVideos] = useState(true)
    const [addVideoFlag, setAddVideoFlag] = useState(false)
    const [newVideo, setNewVideo] = useState({"name": "", "location": "", "owner": user.email, "viewers": []})
    const [manageAccessFlag, setManageAccessFlag] = useState(false)
    const [newAccessor, setNewAccessor] = useState("")
    const [selectedVideo, setSelectedVideo] = useState({})
    const [refresh, setRefresh] = useState(false)
    const [mediaFile, setMediaFile] = useState({preview: "", raw: "" })

    var data = new FormData

    if(refreshMyVideos){
        setRefreshMyVideos(false)
        getMediaForUser()
    }

    if(refreshSharedVideos){
        setRefreshSharedVideos(false)
        getSharedMedia()
    }

    const handleVideoUpload = async e => {
        console.log("uploading media file")
        
        var formData = new FormData()
        formData.append("video", mediaFile.raw)

        for (var [key, value] of formData.entries()) { 
            console.log("TEST", key, value);
        }

        axios.post(process.env.REACT_APP_URL+"media/post-image",
            formData
        ,{
            'headers': {
                'content-type': 'multipart/form-data',
                'X-Auth-Token': process.env.REACT_APP_API_KEY
            },
            responseType: 'json',
        }).then(response => {
            console.log(response.status)
            if(response.status == 200){
                // setMyVideos(response.data)
            }
            for (var [key, value] of formData.entries()) { 
                console.log("TEST2: ", key, value);
            }
        })
    }

    if(!user || user == {}){
        return (
            <div>no user selected</div>
        )
    }
    return (
        <div>
            {/* top navbar  */}
            <Container>
                <Navbar>
                    <Navbar.Brand>
                        Video Share - {user.email}
                    </Navbar.Brand>
                    <Nav>
                        <Nav.Link href="#myvideos" >My Videos</Nav.Link>
                        <Nav.Link href="#shared" >Shared With Me</Nav.Link>
                    </Nav>
                    <Button onClick={() => setAddVideoFlag(true)}>Add Video</Button>
                </Navbar>
            </Container>

            {/* displays the media */}
            <Container id="myvideos" style={{"paddingBottom": "1%"}}>
                <Card>
                    <Card.Header>
                        My Videos
                    </Card.Header>
                    <Card.Body>
                        {myVideos && myVideos[0] &&
                        myVideos.map((video, i) => (
                            <div style={{"paddingBottom": "1%"}}>
                                <Row>
                                    <Col>
                                        {video.name}{' '}
                                    </Col>
                                    <Col>
                                        Shared With: {video.viewers && video.viewers.length}{' '}
                                    </Col>
                                    <Col style={{}}>
                                        <Button >View</Button> {' '}
                                        <Button onClick={() => {setSelectedVideo(video); setManageAccessFlag(true)}}>Share</Button>{' '}
                                        <Button variant="danger" onClick={() => deleteSingleMedia(video._id, i)}>Delete</Button>
                                    </Col>
                                </Row>   
                            
                            </div>
                            ))
                        }
                    </Card.Body>
                </Card>
            </Container>

            {/* displays shared media */}
            <Container id="shared">
                <Card>
                    <Card.Header>
                        Shared With Me
                    </Card.Header>
                    <Card.Body>
                        {sharedWithMe &&
                        sharedWithMe.map((video, i) => (
                            <div style={{"paddingBottom": "1%"}}>
                                <Row>
                                    <Col>
                                        {video.name}
                                    </Col>
                                    <Col>
                                        Owner: {video.owner}
                                    </Col>
                                    <Col>
                                        <Button >View</Button>
                                    </Col>
                                </Row>
                            </div>
                        ))
                        }
                    </Card.Body>
                </Card>
            </Container>    

            {/* add media */}
            <Modal show={addVideoFlag} onHide={() => setAddVideoFlag(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Video</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group>
                        <Form.Label >name</Form.Label>
                        <Form.Control onChange={(event) => {newVideo.name = event.target.value}}/>
                    </Form.Group>
                    <input type="file" onChange={onFileChange}/>
                    <Button onClick={() => handleVideoUpload()}>upload</Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => addMedia()}>Add</Button>
                    <Button onClick={() => setAddVideoFlag(false)}>Cancel</Button>
                </Modal.Footer>
            </Modal>

            {/* manage access */}
            <Modal show={manageAccessFlag} onHide={() => closeAccessManagerPopup()} centered>\
                <Modal.Header closeButton>
                    <Modal.Title>Manage Access</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label >New Accessor</Form.Label>
                            <Form.Control onChange={(event) => {setNewAccessor(event.target.value)}}/>
                        </Form.Group>
                        <Button onClick={() => addAccessor()}>Add</Button>
                    </Form>
                </Modal.Body>
                <Modal.Body>
                    {selectedVideo && selectedVideo.viewers && selectedVideo.viewers.map((viewer, i) => (
                            <Card>
                                <Row>
                                    <Col>
                                        {viewer}
                                    </Col>
                                    <Col>
                                        <Button variant="danger" onClick={() => removeAccessor(viewer, i)}>remove</Button>
                                    </Col>
                                </Row>
                            </Card>
                        ))
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => closeAccessManagerPopup()}>Close</Button>
                </Modal.Footer>
            </Modal>

        </div>
    )


    function onFileChange(event){
        if (event.target.files.length) {
            setMediaFile({
                preview: URL.createObjectURL(event.target.files[0]),
                raw: event.target.files[0]
            });   
        }
    }

    function closeAccessManagerPopup(){
        setManageAccessFlag(false)
        setRefreshMyVideos(true)
    }

    function uploadMediaFile(){
    }

    function getMediaForUser(){
        console.log("getting media for user")
        var mediaList = user.media
        axios.post(process.env.REACT_APP_URL + "media/list",{
            "media": mediaList
        }, {
            'headers': {
                'X-Auth-Token': process.env.REACT_APP_API_KEY
            },
            responseType: 'json',
        }).then(response => {
            console.log(response.status)
            if(response.status == 200){
                setMyVideos(response.data)
            }
        })
    }

    function getSharedMedia(){
        console.log("getting media for user")
        var mediaList = user.shared
        axios.post(process.env.REACT_APP_URL + "media/list",{
            "media": mediaList
        }, {
            'headers': {
                'X-Auth-Token': process.env.REACT_APP_API_KEY
            },
            responseType: 'json',
        }).then(response => {
            console.log(response.status)
            if(response.status == 200){
                setSharedWithMe(response.data)
            }
        })
    }

    function deleteSingleMedia(id, i){
        console.log("deleting media")
        axios.delete(process.env.REACT_APP_URL + "media/delete/" + id, {
            'headers': {
                'X-Auth-Token': process.env.REACT_APP_API_KEY
            },
            responseType: 'json',
        }).then(response => {
            console.log(response.status)
            if(response.status == 200){
                user.media.splice(i, 1)
                setRefreshMyVideos(true)
            }
        })
    }

    function addAccessor(){
        console.log("sharing media")
        axios.put(process.env.REACT_APP_URL + "media/change-accessor/"+selectedVideo._id,{
            "accessor": newAccessor,
            "action": "add"
        }, {
            'headers': {
                'X-Auth-Token': process.env.REACT_APP_API_KEY
            },
            responseType: 'json',
        }).then(response => {
            console.log(response.status)
            if(response.status == 200){
                selectedVideo.viewers.push(newAccessor)
                setRefresh(!refresh)
            }
        })
    }

    function removeAccessor(accessor, i){
        console.log("removing accessor")
        axios.put(process.env.REACT_APP_URL + "media/change-accessor/"+selectedVideo._id,{
            "accessor": accessor,
            "action": "delete"
        }, {
            'headers': {
                'X-Auth-Token': process.env.REACT_APP_API_KEY
            },
            responseType: 'json',
        }).then(response => {
            console.log(response.status)
            if(response.status == 200){
                selectedVideo.viewers.splice(i, 1)
                setRefresh(!refresh)
            }
        })
    }

    function updateOwnersForMedia(){

    }

    function addMedia(){
        console.log("adding media for user")
        setAddVideoFlag(false)
        axios.post(process.env.REACT_APP_URL + "media/add",{
            "name": newVideo.name,
            "owner": user.email,
            "viewers": []
        }, {
            'headers': {
                'X-Auth-Token': process.env.REACT_APP_API_KEY
            },
            responseType: 'json',
        }).then(response => {
            console.log(response.status)
            if(response.status == 200){
                user.media.push(response.data["InsertedID"])
                setRefreshMyVideos(true)
            }
        })
    }

}

export default UserDetail;