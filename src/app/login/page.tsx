"use client"

import React from 'react';
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginCard from '../components/LoginCard';
import theme from '../components/theme';
import { ThemeProvider } from '@emotion/react';

function Login() {
    return(
        <ThemeProvider theme={theme}>
            <LoginCard/>
        </ThemeProvider>
    );
}

export default Login;