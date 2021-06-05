import React, {useState,useEffect} from 'react';
import axios from 'axios';
import AuthHandler from '../Auth/Auth';
import { Redirect } from 'react-router-dom';

export default function Logout() {
    const [submited,setSubmited] = useState(false)
    const port = AuthHandler.port()

    useEffect(() => {
        axios({
            method:'post',
            url:`http://127.0.0.1:${port}/users/logout`, 
            headers: {
              Authorization: `Bearer ${AuthHandler.getLoginToken()}`
            }
        }) .then(response => {
            console.log(response)
                AuthHandler.logoutUser()
                setSubmited(true)
            }).catch( err => {
                console.log(err)
            })
    }, [])
    return (
        <div>
            {submited ?
                <Redirect to="/login"/>: ''
            }
        </div>
    )
}
