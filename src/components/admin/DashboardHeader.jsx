import './dashboard.css'
import { Col, Image, Row } from 'antd'
import React from 'react'
import CircleImage from '../../assets/images/admin/BigCircles.png'
import { useSelector } from 'react-redux'

function DashboardHeader() {
  const {themeColor}=useSelector(state=> state.themeSetup)

  return (
    <>
        <Row style={{height:'150px',}}>
            <Image src={CircleImage} alt='header-img' width='100%' height={150} className='filter' />
            <Col span={24} className='dbh' style={{backgroundColor:themeColor, marginTop:'-150px'}}>
            </Col>
        </Row>
    </>
  )
}

export default DashboardHeader