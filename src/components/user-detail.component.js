import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Container, Card, Button, Row, Col, Navbar, Nav, Modal, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from './logout-button.component';

const API_KEY = process.env.REACT_APP_API_KEY || "any-default-local-build_env";
const API_URL = process.env.REACT_APP_URL || "any-default-local-build_env";

const UserDetail = () => {

    const [myVideos, setMyVideos] = useState([])
    const [sharedWithMe, setSharedWithMe] = useState([])
    const [refreshMyVideos, setRefreshMyVideos] = useState(false)
    const [refreshSharedVideos, setRefreshSharedVideos] = useState(false)
    const [addVideoFlag, setAddVideoFlag] = useState(false)
    const [newVideo, setNewVideo] = useState({"name": "", "location": "", "owner": "", "viewers": []})
    const [manageAccessFlag, setManageAccessFlag] = useState(false)
    const [newAccessor, setNewAccessor] = useState("")
    const [selectedVideo, setSelectedVideo] = useState({})
    const [refresh, setRefresh] = useState(false)
    const [mediaFile, setMediaFile] = useState({preview: "", raw: "" })
    const [showMediaFlag, setShowMediaFlag] = useState(false)
    const [currentMediaLink, setCurrentMediaLink] = useState("")
    const [mediaLinkDict, setMediaLinkDict] = useState({})
    const [userObject, setUserObject] = useState({})

    const { user } = useAuth0();

    useEffect(() => {
        getUserObject();
      }, [])

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
        formData.append("name", userObject.media[userObject.media.length-1] + "." + getFileExtension(mediaFile.raw.name))

        axios.post(API_URL+"media/post-media",
            formData
        ,{
            'headers': {
                'content-type': 'multipart/form-data',
                'X-Auth-Token': API_KEY
            },
            responseType: 'json',
        }).then(response => {
            console.log(response.status)
            if(response.status == 200){
                setRefreshMyVideos(true)
            }
        })
    }

    if(!userObject || userObject == {}){
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
                        Video Share - {userObject.email}
                    </Navbar.Brand>
                    <Nav>
                        <Nav.Link href="#myvideos" >My Videos</Nav.Link>
                        <Nav.Link href="#shared" >Shared With Me</Nav.Link>
                    </Nav>
                    <Button onClick={() => setAddVideoFlag(true)}>Add Video</Button>
                    <LogoutButton />
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
                                        <Button onClick={()=> onViewButtonClicked(video.location)}>View</Button> {' '}
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
            
            {/* show media */}
            <Modal show={showMediaFlag} onHide={() => setShowMediaFlag(false)} centered>
                <Modal.Header closeButton>
                </Modal.Header>

                <Modal.Body>
                    <img src={currentMediaLink} alt=""></img>
                </Modal.Body>
            </Modal>

        </div>
    )

    function addNewUser(){
        console.log("adding new user")
        axios.post(API_URL + "user/add", {
                "email": user.email,
                "media": [],
                "shared": []
        },
        {
            'headers': {
                'X-Auth-Token': API_KEY
            },
            responseType: 'json',
        }).then(response => {
            console.log(response)
            if(response.status == 200){
                getUserObject()
            }
        })
    }

    function getUserObject() {
        console.log("getting user object");
        axios.get(API_URL + "user/" + user.email, {
            'headers': {
                'X-Auth-Token': API_KEY
            },
            responseType: 'json',
        }).then(response => {
            console.log(response)
            if(response.status == 200){
                if(!response.data){
                    addNewUser()
                }else{
                    setUserObject(response.data[0])
                    setRefreshMyVideos(true)
                    setRefreshSharedVideos(true)
                }
            }
        })
    }

    //Called when the view button is clicked 
    //if the presigned url is stored, then that is used
    //otherwise a new presigned url is taken
    function onViewButtonClicked(mediaLocation){
        if(mediaLinkDict[mediaLocation]){
            setCurrentMediaLink(mediaLinkDict[mediaLocation])
            setShowMediaFlag(true)
        }else{
            getMediaLink(mediaLocation)
        }
    }


    function onFileChange(event){
        if (event.target.files.length) {
            setMediaFile({
                preview: URL.createObjectURL(event.target.files[0]),
                raw: event.target.files[0]
            });   
        }
    }

    //gets a presigned url for a media object
    //on success, the presigned url is stored for later usage
    function getMediaLink(location){
        console.log("getting media link")
        axios.get(API_URL + "media/get-presigned-url/" + location, {
            'headers': {
                'X-Auth-Token': API_KEY
            },
            responseType: 'json',
        }).then(response => {
            console.log(response.status)
            if(response.status == 200){
                mediaLinkDict[location] = response.data
                setCurrentMediaLink(response.data)
                setShowMediaFlag(true)
            }
        })
    }

    function getFileExtension(fileName){
        var arr = fileName.split(".")
        return arr[arr.length-1]
    }

    function closeAccessManagerPopup(){
        setManageAccessFlag(false)
        setRefreshMyVideos(true)
    }

    function getMediaForUser(){
        console.log("getting media for user")
        var mediaList = userObject.media
        axios.post(API_URL + "media/list",{
            "media": mediaList
        }, {
            'headers': {
                'X-Auth-Token': API_KEY
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
        console.log("getting shared media for user")
        var mediaList = userObject.shared
        axios.post(API_URL + "media/list",{
            "media": mediaList
        }, {
            'headers': {
                'X-Auth-Token': API_KEY
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
        axios.delete(API_URL + "media/delete/" + id, {
            'headers': {
                'X-Auth-Token': API_KEY
            },
            responseType: 'json',
        }).then(response => {
            console.log(response.status)
            if(response.status == 200){
                userObject.media.splice(i, 1)
                setRefreshMyVideos(true)
            }
        })
    }

    function addAccessor(){
        console.log("sharing media")
        axios.put(API_URL + "media/change-accessor/"+selectedVideo._id,{
            "accessor": newAccessor,
            "action": "add"
        }, {
            'headers': {
                'X-Auth-Token': API_KEY
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
        axios.put(API_URL + "media/change-accessor/"+selectedVideo._id,{
            "accessor": accessor,
            "action": "delete"
        }, {
            'headers': {
                'X-Auth-Token': API_KEY
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
        var mediatype = getFileExtension(mediaFile.raw.name)
        axios.post(API_URL + "media/add",{
            "name": newVideo.name,
            "owner": user.email,
            "location": "",
            "mediatype": mediatype,
            "viewers": []
        }, {
            'headers': {
                'X-Auth-Token': API_KEY
            },
            responseType: 'json',
        }).then(response => {
            console.log(response.status)
            if(response.status == 200){
                userObject.media.push(response.data["InsertedID"])
                handleVideoUpload()
            }
        })
    }

}

export default UserDetail;