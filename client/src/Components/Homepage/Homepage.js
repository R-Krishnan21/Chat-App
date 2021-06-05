import React from 'react';
import Main from '../Chat/Main';
import AuthHandler from '../Auth/Auth';
import { Redirect } from 'react-router';
import Navbar from '../Navbar/Navbar';

export default function Homepage() {
    return (
        <div>
            <Navbar/>
            {AuthHandler.isLoggedIn() ? <Main/> : <Redirect to="/login"/>}
        </div>
    )
}
