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

            {/* TODO: list out all media in rows 
                    - Need buttons for deleting and viewing accessors
                    - need download button*/}
            {/* TODO: Popup for viewing all accessors to a media file
                    - can add a new one
                    - can delete a current one */}
            {/* TODO: Upload button */}
            {/* TODO: Upload popup 
                    - select file, make sure it's mp4 and upload */}
        </div>
    )

    function getMediaForUser(){

    }

    function deleteSingleMedia(){

    }

    function updateOwnersForMedia(){

    }

    function addMedia(){

    }

}

export default UserDetail;