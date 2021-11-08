import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Button, Modal} from "react-bootstrap";
import QRCode from "qrcode.react";

const ShowMedia = ({showMediaFlag, setShowMediaFlag, useQrCode, setUseQrCode, getQrCode, currentMediaLink}) => {

    return (
        <Modal className="modalOverall" show={showMediaFlag} onHide={() => setShowMediaFlag(false)} centered>
            <Modal.Header className="modalHeader" closeButton>
                <Button className="modalButton2" variant="outline-dark" onClick={() => setUseQrCode(false)}>media</Button>
                <Button className="modalButton2" variant="outline-dark" onClick={()=>getQrCode()}>QR code</Button>
                <a href={currentMediaLink} style={{color: "black"}} target="_blank">external link</a>
            </Modal.Header>

            <Modal.Body >
                {useQrCode &&
                    <QRCode value={currentMediaLink} />
                }
                {!useQrCode &&
                    <img src={currentMediaLink} alt="could not display. use external link" className="img-fluid" ></img>
                }
            </Modal.Body>
        </Modal> 
    )
}

export default ShowMedia;