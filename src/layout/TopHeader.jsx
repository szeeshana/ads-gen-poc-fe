import React, { useState } from 'react'
import Settings from './Settings'
import { Button, Col, Drawer, Row } from 'antd';
import Gear from '../assets/images/admin/gear.png'
import ExitFS from '../assets/images/admin/icons/ic_exit_full_screen.svg'
import EnterFS from '../assets/images/admin/icons/ic_full_screen.svg'
import Title from 'antd/es/typography/Title';

function TopHeader() {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const requestFullScreen = () => {
        setIsFullScreen(true);
        const element = document.documentElement;

        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    };

    const exitFullScreen = () => {
        setIsFullScreen(false);
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    };

    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    return (
        <Row>
            <Col span={24} className='flex justify-content-end pr-16 pt-16'>
                {open === false ?
                    <div onClick={showDrawer} style={{ cursor: 'pointer' }} >
                        <img src={Gear} width={30} alt='settings' className='image' />
                    </div>
                    : ''}
                <Drawer
                    title={
                        <Row>
                            <Col span={24} className='flex justify-content-end'>
                                <Title level={3}>Settings</Title>
                            </Col>
                        </Row>
                    }
                    mask={false}
                    maskClosable={false}
                    placement="right"
                    onClose={onClose}
                    open={open}
                    width={260}
                    footer={
                        <Row>
                            <Col span={24} className='flex justify-content-center'>
                                {
                                    isFullScreen ?
                                    <Button icon={<img src={ExitFS} width={15} alt='exit-fullscreen' />} onClick={exitFullScreen}>Exit Fullscreen</Button>
                                    :
                                    <Button icon={<img src={EnterFS} width={15} alt='full-screen' />} onClick={requestFullScreen}>Fullscreen</Button>
                                }
                            </Col>
                        </Row>
                    }
                >

                    <Settings />
                </Drawer>
            </Col>
        </Row>
    )
}

export default TopHeader