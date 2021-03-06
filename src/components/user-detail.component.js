//#region imports

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

import { Spinner } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import '../css/buttons.css'
import '../css/user-detail.css'
import '../css/card.css'
import '../css/modal.css'

import UserMedia from './user-media.component';
import SharedMedia from './shared-media.components';
import NavigationBar from './navigation-bar.component';
import AddMedia from './add-media.component';
import ShareModal from './share-module.component';
import ShowMedia from './show-media.component';
import LogoutButton from './logout-button.component';

//#endregion



const API_URL = process.env.REACT_APP_URL || "any-default-local-build_env";

const UserDetail = () => {
    
    //#region variables
    //Auth0 Variables
    const { user, getAccessTokenSilently } = useAuth0();

    //General Variables
    const [userObject, setUserObject] = useState({})    
    const [modalAlertFlag, setModalAlertFlag] = useState(false)
    const [modalAlertMessage, setModalAlertMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [userMediaShown, setUserMediaShown] = useState(true)

    //Media Objects 
    const [myVideos, setMyVideos] = useState([])
    const [sharedWithMe, setSharedWithMe] = useState([])

    //triggers to regather data
    const [refreshMyVideos, setRefreshMyVideos] = useState(false)
    const [refreshSharedVideos, setRefreshSharedVideos] = useState(false)
    
    //New Video Variables
    const [newVideo, setNewVideo] = useState({"name": "", "location": "", "owner": "", "viewers": []})
    const [mediaFile, setMediaFile] = useState({preview: "", raw: "" })

    //Share Media Variables
    const [selectedVideo, setSelectedVideo] = useState({})
    const [newAccessor, setNewAccessor] = useState("")
   
    //Viewing Media Variables
    const [currentMediaLink, setCurrentMediaLink] = useState("")
    const [mediaLinkDict, setMediaLinkDict] = useState({})
    const [useQrCode, setUseQrCode] = useState(false);

    //Modal Flags
    const [addVideoFlag, setAddVideoFlag] = useState(false)
    const [manageAccessFlag, setManageAccessFlag] = useState(false)
    const [showMediaFlag, setShowMediaFlag] = useState(false)

    //#endregion

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

    //#region UI 
    if(!userObject || userObject == {}){
        return (
            <div>no user selected</div>
        )
    }
    return (
        <div>
        {loading &&
            <div className="overlay">
                {/* {console.log("test")} */}
                <Spinner animation="border" role="status" className="spinnerStyle">
                </Spinner>
            </div>
        }
        <NavigationBar userObject={userObject} setUserMediaShown={setUserMediaShown} setAddVideoFlag={setAddVideoFlag}/>

        {userMediaShown &&
            <UserMedia myVideos={myVideos} onViewButtonClicked={onViewButtonClicked} setSelectedVideo={setSelectedVideo} setManageAccessFlag={setManageAccessFlag} deleteSingleMedia={deleteSingleMedia} />
        }
        {!userMediaShown &&
            <SharedMedia sharedWithMe={sharedWithMe} onViewButtonClicked={onViewButtonClicked} />
        }
        {/* add media modal */}
        <AddMedia addVideoFlag={addVideoFlag} setAddVideoFlag={setAddVideoFlag} modalAlertFlag={modalAlertFlag} setModalAlertFlag={setModalAlertFlag} modalAlertMessage={modalAlertMessage} addMedia={addMedia} newVideo={newVideo} onFileChange={onFileChange} />

        {/* manage access modal */}
        <ShareModal manageAccessFlag={manageAccessFlag} closeAccessManagerPopup={closeAccessManagerPopup} modalAlertFlag={modalAlertFlag} modalAlertMessage={modalAlertMessage} setModalAlertFlag={setModalAlertFlag} setNewAccessor={setNewAccessor} addAccessor={addAccessor} selectedVideo={selectedVideo} removeAccessor={removeAccessor}/>

        {/* show media modal */}
        <ShowMedia showMediaFlag={showMediaFlag} setShowMediaFlag={setShowMediaFlag} setUseQrCode={setUseQrCode} getQrCode={getQrCode} currentMediaLink={currentMediaLink} useQrCode={useQrCode}/>
        
        </div>
    )

    //#endregion

    //#region functions
    function getQrCode(){
        setUseQrCode(true)
    }

    async function handleVideoUpload(e){
        setLoading(true)
        // console.log("uploading media file")
        
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
            // console.log(response.status)
            if(response.status == 200){
                setMediaFile({preview: "", raw: "" })
                setRefreshMyVideos(true)
            }
        })
        setLoading(false)
    }

    async function addNewUser(){
        setLoading(true)
        // console.log("adding new user")

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
            // console.log(response)
            if(response.status == 200){
                getUserObject()
            }
        })
        setLoading(false)
    }

    async function getUserObject() {
        setLoading(true)
        // console.log("getting user object");

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
            // console.log(response.status)
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
        setLoading(false)
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
        setLoading(true)
        // console.log("getting media link")

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
            // console.log(response.status)
            if(response.status == 200){
                mediaLinkDict[location] = response.data
                // console.log(response.data)
                setCurrentMediaLink(response.data)
                setShowMediaFlag(true)
            }
        })
        setLoading(false)
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
        setLoading(true)
        // console.log("getting media for user")

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
            // console.log(response.status)
            if(response.status == 200){
                setMyVideos(response.data)
            }
        })
        setLoading(false)
    }

    async function getSharedMedia(){
        setLoading(true)
        // console.log("getting shared media for user")

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
            // console.log(response.status)
            if(response.status == 200){
                setSharedWithMe(response.data)
            }
        })
        setLoading(false)
    }

    async function deleteSingleMedia(id, i){
        setLoading(true)
        // console.log("deleting media")

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
            // console.log(response.status)
            if(response.status == 200){
                userObject.media.splice(i, 1)
                setRefreshMyVideos(true)
            }
        })
        setLoading(false)
    }

    async function addAccessor(){
        setLoading(true)
        // console.log("sharing media")

        if(newAccessor == user.email){
            setModalAlertFlag(true)
            setModalAlertMessage("cannot be you own email")
            return;
        }

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
            // console.log(response.status)
            if(response.status == 200){
                selectedVideo.viewers.push(newAccessor)
            }
            else if(response.status == 208){
                setModalAlertFlag(true)
                setModalAlertMessage("email already added")
            }else if(response.status == 204){
                setModalAlertFlag(true)
                setModalAlertMessage("user does not exist")
            }
        })
        setLoading(false)
    }

    async function removeAccessor(accessor, i){
        setLoading(true)
        // console.log("removing accessor")

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
            // console.log(response.status)
            if(response.status == 200){
                selectedVideo.viewers.splice(i, 1)
            }
        })
        setLoading(false)
    }

    async function addMedia(){
        setLoading(true)
        // console.log("adding media for user")

        var mediatype = "";
        try{
            mediatype = getFileExtension(mediaFile.raw.name)
        }catch {
            setModalAlertFlag(true)
            setModalAlertMessage("please include media")
            return 
        }

        if(newVideo.name == ""){
            setModalAlertFlag(true)
            setModalAlertMessage("please include media name")
            return 
        }
   
        const token = await getAccessTokenSilently({
            audience: "https://videoshare/api",
            scope: "update:user",
        });

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
            // console.log(response.status)
            if(response.status == 200){
                setAddVideoFlag(false)
                newVideo.name = ""
                userObject.media.push(response.data["InsertedID"])
                handleVideoUpload()
            }
        })
        setLoading(false)
    }
    //#endregion

}

export default UserDetail;