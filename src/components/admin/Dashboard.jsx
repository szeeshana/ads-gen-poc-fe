import './dashboard.css'
import { Col, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import DashboardHeader from './DashboardHeader'
import Title from 'antd/es/typography/Title'
import Paragraph from 'antd/es/typography/Paragraph'
import JobCard from './JobCard'
import { Link } from 'react-router-dom'
import { getApi } from '../../utils/httpServices'

function Dashboard() {
    const [adsCount, setAdsCount] = useState(0)
   // create a function to get ads count
   
    const [statsData] = useState([
        { title: 'Ads By Image', description: `Jobs`, link: '/job-by-image' , enable : true },
        // { title: 'Ads By Demographic', description: '560 Ads Generated' , link: '/job-by-demographic' ,enable : false},
        // { title: 'Ads By Description', description: '560 Ads Generated' , link: '/job-by-description' ,enable : false},
        // { title: 'Ads By Evaluation', description: '560 Ads Generated' , link: '/job-by-description' ,enable : false},
    ])

    const getCount = async () => {
        try {
            const res = await getApi({ url: `${process.env.REACT_APP_BASE_URI}/api/job/ran` });
            if (res.status === 200) {
                console.log(res.data.data.totalRanJobs);
                setAdsCount(res.data.data.totalRanJobs);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getCount()
    }, [])
    return (
        <>
            <DashboardHeader />
            <Row style={{ marginTop: '-130px' }} className='mx-16'>
                <Col span={24}>
                    <Title style={{ color: 'white' }}>Welcome!</Title>
                    <Paragraph style={{ color: 'white' }}>We are on a mission to create attractive ads using AI</Paragraph>
                </Col>
            </Row>
            <Row className='mx-8' style={{ marginTop: '50px' }}>
                <Col span={24}>
                    <Row gutter={8} className='h-48'>
                        {
                            statsData.map((item) => (
                                <Col key={item.title} xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 12 }} className='pb-8'>
                                    {
                                        item.enable ?  <Link to={item.link}>
                                        <JobCard description={`${adsCount} ${item.description}`} title={item.title} />
                                        </Link> : <JobCard description={item.description} title={item.title} />

                                    }
                                    
                                </Col>
                            ))
                        }
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default Dashboard