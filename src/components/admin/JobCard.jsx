import { Avatar, Card, Col, Row } from 'antd'
import Meta from 'antd/es/card/Meta'
import CardIcon from '../../assets/images/job-1.png'
import { useState } from 'react'

function StatsCard({description, title}) {
    const [style, setStyle]=useState('none')
    return (
        <Row >
            <Card className='w-full box-shadow card-gradient h-36' hoverable>
                <Row justify={'center'} align={'middle'} style={{margin:'0px'}}>
                    <Col span={10}>
                        <Meta avatar={<Avatar src={CardIcon} style={{width:'100px', height:'100px'}} />} />
                    </Col>
                    <Col span={14}>
                        <Meta description={title} />
                        <div className='p-4' />
                        <Meta title={description} />
                    </Col>
                    <div 
                        className='b3 w-full h-8' 
                        style={{display:style}}
                        onMouseOver={() => {
                            setStyle('block')
                        }}
                        onMouseDown={() => {
                            setStyle('none')
                        }}
                    >
                         Click Me
                    </div>
                </Row>
            </Card>
        </Row>
    )
}

export default StatsCard