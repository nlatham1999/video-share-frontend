import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Container, Card, Button, Row, Col, Navbar, Nav, Modal, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from './logout-button.component';
import '../css/buttons.css'
import '../css/user-detail.css'
import '../css/card.css'
import UserMedia from './user-media.component';
import SharedMedia from './shared-media.components';

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
    const [userMediaShown, setUserMediaShown] = useState(false)

    const { user, getAccessTokenSilently } = useAuth0();

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

    if(!userObject || userObject == {}){
        return (
            <div>no user selected</div>
        )
    }
    return (
        <div>
            {/* top navbar  */}
            <Container style={{marginTop: "2vh"}}>
                {userObject.email}
                <Navbar className="navigationBar">
                        <Col xs="auto">
                            <Nav>
                                <Nav.Link className="navigationText" style={{paddingLeft: 0}} href="#myvideos" onClick={() => setUserMediaShown(true)}>my media</Nav.Link>
                                <Nav.Link className="navigationText" href="#shared" onClick={() => setUserMediaShown(false)}>shared with me</Nav.Link>
                            </Nav>
                        </Col>
                        <Col className="buttonGroup">
                            <Button variant="outline-dark" className="navigationButton" onClick={() => setAddVideoFlag(true)}>add media</Button>
                            <LogoutButton />
                        </Col>
                </Navbar>
            </Container>

            {userMediaShown &&
                <UserMedia myVideos={myVideos} onViewButtonClicked={onViewButtonClicked} setSelectedVideo={setSelectedVideo} setManageAccessFlag={setManageAccessFlag} deleteSingleMedia={deleteSingleMedia} />
            }
            {!userMediaShown &&
                <SharedMedia sharedWithMe={sharedWithMe} onViewButtonClicked={onViewButtonClicked} />
            }
            {/* add media */}
            <Modal show={addVideoFlag} onHide={() => setAddVideoFlag(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>add media</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group>
                        <Form.Label >name</Form.Label>
                        <Form.Control onChange={(event) => {newVideo.name = event.target.value}}/>
                    </Form.Group>
                    <input type="file" onChange={onFileChange}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => addMedia()}>add</Button>
                    <Button onClick={() => setAddVideoFlag(false)}>cancel</Button>
                </Modal.Footer>
            </Modal>

            {/* manage access */}
            <Modal show={manageAccessFlag} onHide={() => closeAccessManagerPopup()} centered>\
                <Modal.Header closeButton>
                    <Modal.Title>manage access</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label >new accessor</Form.Label>
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

    async function handleVideoUpload(e){
        console.log("uploading media file")
        
        var formData = new FormData()
        formData.append("video", mediaFile.raw)
        formData.append("name", userObject.media[userObject.media.length-1] + "." + getFileExtension(mediaFile.raw.name))

        const token = await getAccessTokenSilently({
            audience: "https://videoshare/api",
            scope: "update:user",
        });

        axios.post(API_URL+"media/post-media",formData,{
            headers: {
                Authorization: `Bearer ${token}`,
                'content-type': 'multipart/form-data',
            },
            responseType: 'json',
        }).then(response => {
            console.log(response.status)
            if(response.status == 200){
                setRefreshMyVideos(true)
            }
        })
    }

    async function addNewUser(){
        console.log("adding new user")

        const token = await getAccessTokenSilently({
            audience: "https://videoshare/api",
            scope: "update:user",
        });

        axios.post(API_URL + "user/add", {
                "email": user.email,
                "media": [],
                "shared": []
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: 'json',
        }).then(response => {
            console.log(response)
            if(response.status == 200){
                getUserObject()
            }
        })
    }

    async function getUserObject() {
        console.log("getting user object");

        const token = await getAccessTokenSilently({
            audience: "https://videoshare/api",
            scope: "update:user",
        });

        axios.get(API_URL + "user/" + user.email, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: 'json',
        }).then(response => {
            console.log(response.status)
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
    async function getMediaLink(location){
        console.log("getting media link")

        const token = await getAccessTokenSilently({
            audience: "https://videoshare/api",
            scope: "update:user",
        });

        axios.get(API_URL + "media/get-presigned-url/" + location, {
            headers: {
                Authorization: `Bearer ${token}`,
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

    async function getMediaForUser(){
        console.log("getting media for user")

        const token = await getAccessTokenSilently({
            audience: "https://videoshare/api",
            scope: "update:user",
        });

        var mediaList = userObject.media
        axios.post(API_URL + "media/list",{
            "media": mediaList
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: 'json',
        }).then(response => {
            console.log(response.status)
            if(response.status == 200){
                setMyVideos(response.data)
            }
        })
    }

    async function getSharedMedia(){
        console.log("getting shared media for user")

        const token = await getAccessTokenSilently({
            audience: "https://videoshare/api",
            scope: "update:user",
        });

        var mediaList = userObject.shared
        axios.post(API_URL + "media/list",{
            "media": mediaList
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: 'json',
        }).then(response => {
            console.log(response.status)
            if(response.status == 200){
                setSharedWithMe(response.data)
            }
        })
    }

    async function deleteSingleMedia(id, i){
        console.log("deleting media")

        const token = await getAccessTokenSilently({
            audience: "https://videoshare/api",
            scope: "update:user",
        });

        axios.delete(API_URL + "media/delete/" + id, {
            headers: {
                Authorization: `Bearer ${token}`,
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

    async function addAccessor(){
        console.log("sharing media")

        const token = await getAccessTokenSilently({
            audience: "https://videoshare/api",
            scope: "update:user",
        });

        axios.put(API_URL + "media/change-accessor/"+selectedVideo._id,{
            "accessor": newAccessor,
            "action": "add"
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
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

    async function removeAccessor(accessor, i){
        console.log("removing accessor")

        const token = await getAccessTokenSilently({
            audience: "https://videoshare/api",
            scope: "update:user",
        });

        axios.put(API_URL + "media/change-accessor/"+selectedVideo._id,{
            "accessor": accessor,
            "action": "delete"
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
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

    async function addMedia(){
        console.log("adding media for user")

        const token = await getAccessTokenSilently({
            audience: "https://videoshare/api",
            scope: "update:user",
        });

        setAddVideoFlag(false)
        var mediatype = getFileExtension(mediaFile.raw.name)
        axios.post(API_URL + "media/add",{
            "name": newVideo.name,
            "owner": user.email,
            "location": "",
            "mediatype": mediatype,
            "viewers": []
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
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