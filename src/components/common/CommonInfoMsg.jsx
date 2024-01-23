import { InfoCircleOutlined } from '@ant-design/icons'
import { Col, Popover, Row } from 'antd'
import Title from 'antd/es/typography/Title'
import React from 'react'

function CommonInfoMsg({title, content}) {
    return (
        <>
            <Title level={5} className='m-0 p-0' style={{ color: 'gray' }}>
                {title}
                <span style={{ marginInlineStart: '2px', fontSize: '12px', color: '#999', fontWeight: 'normal', position: 'relative', top: '-4px' }} >
                    <Popover 
                    content={
                    <Row style={{ width: '300px', color: 'gray' }}>
                        <Col span={24}>
                            <h4 className='m-0 p-0'>How to use?</h4>
                        </Col>
                        <Col span={24}><p>{content}</p></Col>
                    </Row>
                    }
                    >
                    <InfoCircleOutlined style={{ cursor: 'pointer' }} />
                    </Popover>
                </span>
            </Title>
        </>
    )
}

export default CommonInfoMsg