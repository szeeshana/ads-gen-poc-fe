import React from 'react'
import { auth } from "./FirebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button, Row, Space } from 'antd';
import {FacebookOutlined, GoogleOutlined, AppleOutlined} from '@ant-design/icons'

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
            <Button icon={<GoogleOutlined />} onClick={handleGoogleSignIn}>Google Sign-in</Button>
            <Button icon={<AppleOutlined />} onClick={handleGoogleSignIn}>Apple Sign-in</Button>
            <Button icon={<FacebookOutlined size="large" />} onClick={handleGoogleSignIn}>Facebook Sign-in</Button>
            </Space>
        </Row>
    )
}

export default GoogleSignin