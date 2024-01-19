import React from 'react'
import { auth } from "./FirebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Row, Space } from 'antd';
import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons';

function GoogleSignin() {
    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            alert('Signed in with Google!');
        } catch (error) {
            console.error('Error signing in with Google:', error.message);
        }
    };
    return (
        <Row>
            <Space>
            <GoogleLoginButton  onClick={handleGoogleSignIn} size='35px' style={{ fontSize:'16px' }} />
            <FacebookLoginButton onClick={() => alert("Hello")} size='35px' style={{ fontSize:'16px' }} />
            </Space>
        </Row>
    )
}

export default GoogleSignin