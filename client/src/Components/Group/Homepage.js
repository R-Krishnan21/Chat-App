import React from 'react';
import Main from './Main';
import AuthHandler from '../Auth/Auth';
import { Redirect } from 'react-router';
import Navbar from '../Navbar/Navbar';

export default function Homepage(props) {
    return (
        <div>
            <Navbar/>
            {AuthHandler.isLoggedIn() ? <Main/> : <Redirect to="/login"/>}
        </div>
    )
}
