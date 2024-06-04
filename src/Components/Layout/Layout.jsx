import React, { useContext, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Outlet } from 'react-router-dom';
import { userContext } from '../../Context/userContext';
import Cookies from 'js-cookie';

export default function Layout() {
    const {  setUserToken } = useContext(userContext);

    useEffect(() => {
        const accessToken = Cookies.get('access_token');
        if (accessToken !== undefined && accessToken !== null) {
            setUserToken(accessToken);
        }
    }, [setUserToken]);

    return (
        <>
            <Navbar />
              <Outlet />
            <Footer />
        </>
    );
}