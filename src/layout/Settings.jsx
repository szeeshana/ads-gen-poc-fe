import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setThemeColor, toggleMode } from '../store/theme/slice'
import Sun from '../assets/images/admin/icons/ic_sun.svg'
import Moon from '../assets/images/admin/icons/ic_moon.svg'
import { Col, Divider, Row } from 'antd'
import Paragraph from 'antd/es/typography/Paragraph'

function Settings() {
    const colors = [
        { color: '#00a76f' },
        { color: '#078dee' },
        { color: '#7635dc' },
        { color: '#fda92d' },
        { color: '#ff3030' },
        { color: '#17a2b8' },
      ];
    const { themeMode } = useSelector((state) => state.themeSetup)
    const dispatch = useDispatch()
    return (
        <>
            <Row gutter={16}>
                <Col span={24}>
                    <Divider><Paragraph className='text-grey'>Mode</Paragraph></Divider>
                </Col>
                <Col span={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div
                        className={`${themeMode === 'light' ? 'box-shadow' : 'sun-btn'} w-full h-full py-16`}
                        style={{ cursor: 'pointer', display: 'flex', borderRadius: '6px', justifyContent: 'center', alignItems: 'center' }}
                        onClick={() => dispatch(toggleMode('light'))}
                    >
                        <img src={Sun} alt='Moon' />
                    </div>
                </Col>
                <Col span={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div
                        className={`${themeMode === 'dark' ? 'box-shadow dark-btn' : ''} w-full h-full py-16 border-secondry`}
                        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        onClick={() => dispatch(toggleMode('dark'))}
                    >
                        <img src={Moon} alt='Moon' />
                    </div>
                </Col>
            </Row>
            <br />
            <br />
            <Row gutter={12}>
                <Col span={24}>
                    <Divider><Paragraph className='text-grey'>Preset</Paragraph></Divider>
                </Col>
                {colors.map((color) => (
                <Col span={4}>
                    <div 
                        className='preset-btn' 
                        style={{backgroundColor:color.color}}
                        onClick={() => dispatch(setThemeColor(color.color))}
                    />
                </Col>
                ))}
                {/* <ColorPicker size='small' onChangeComplete={(color) => dispatch(setThemeColor(color.toHexString()))} /> */}
            </Row>
        </>
    )
}

export default Settings