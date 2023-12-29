import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import DashboardHeader from './admin/DashboardHeader';
import { Button, Card, Col, Collapse, Divider, Image, Row, Space, Table, Badge, Modal, Tooltip, Select } from 'antd';
import { EyeOutlined, StopOutlined, CopyOutlined } from '@ant-design/icons'
import { enqueueSnackbar } from 'notistack'
import ReactJson from 'react-json-view'

import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import { getApi, patchApi, postApi } from '../utils/httpServices';
import CommonSelect from './common/CommonSelect';

function JobDetail() {
    let stageType
    const { state } = useLocation()
    const [stageData, setStageData] = useState()
    const [jobData, setJobData] = useState([])
    const [viewDescription, setViewDescription] = useState(false)
    const [count, setCount]= useState(0)

    useEffect(() => {
        const getJobData= async()=>{
        try {
            const response = await getApi({ url: `${process.env.REACT_APP_BASE_URI}/api/job/${state.id}` });
            if (response.status === 200) {
                jobData.length >=1? jobData.pop(): console.log('d');
                setJobData([...jobData, response.data.data]);
                console.log(jobData);
            }
        } catch (error) {
            alert('Error: Something went wrong!')
        }
    }
    getJobData()
    }, count)


    const handleData = async (stageType) => {
        try {
            const response = await getApi({ url: `${process.env.REACT_APP_BASE_URI}/api/job/${stageType}/${state.id}` });
            if (response.status === 200) {
                setStageData(response.data.data);
            }
        } catch (error) {
            alert('Error: Something went wrong!')
        }
    }
    const columns = [
        {
            title: 'Job ID',
            dataIndex: '_id',
            key: 'id',
            render: (text, record)=>{
                return(
                  <>
                  <Paragraph>{text}
                  <Tooltip placement="top" title="Copy ID">
                    <Button type='text' 
                      onClick={() => {
                        navigator.clipboard.writeText(text)
                        enqueueSnackbar("Copied To Clipboard!", {variant: 'success'})
                        }}>
                      {<CopyOutlined />}
                    </Button>
                  </Tooltip>
                  </Paragraph>
                  </>
                )
              }
        },
        {
            title: 'Job Type',
            dataIndex: 'type',
            key: 'type',
            render: (text, record) => {
                if (text === 'description_create') {
                    return <Paragraph>Description Only</Paragraph>
                } else if (text === 'image_description_create') {
                    return <Paragraph>Description & Image</Paragraph>
                }
                else {
                    return <Paragraph>Evaluation</Paragraph>
                }
            }
        },
        {
            title: 'Data',
            dataIndex: 'data',
            key: 'data',
            render: (text, record) => {
                return (
                    <>
                        <Button onClick={() => setViewDescription(true)} style={{padding:'0px 15px', textAlign:'center'}} >View</Button>
                        <Modal open={viewDescription} title={'Your Data'} footer={null} onCancel={() => setViewDescription(false)}>
                            <Row>
                                <Col span={24} style={{ minHeight:'200px'}}>
                                        <ReactJson src={text} collapsed={1} collapseStringsAfterLength={30} theme={'monokai'} indentWidth={3} iconStyle='square' style={{ wordBreak:'break-all'}} />
                                </Col>
                            </Row>
                        </Modal>
                    </>
                )
            }
        },
        {
            title: 'Change Status',
            key: 'action',
            dataIndex: 'action',
            width: 150,

            render: (text, record) => {
                return (
                    <>
                        <Row gutter={8} justify={'space-around'} className='w-full'>
                        <Col span={24}>
                                <Select 
                                    placeholder="Change Status"
                                    value={record.status}
                                    disabled={record.status === 'completed'}
                                    className='w-full'
                                    options={[
                                        { value: 'draft', label: 'Draft' },
                                        { value: 'pending', label: 'Render Now' },
                                    ]}
                                    onChange={async(e)=>{
                                        try {
                                            const response = await patchApi({ 
                                                url: `${process.env.REACT_APP_BASE_URI}/api/job/${state.id}`,
                                                method:'PATCH',
                                                body:{status:e},
                                            });
                                            if (response.status === 200) {
                                                setCount(count+1)
                                                enqueueSnackbar('Updated Successfully', { variant: 'success' });
                                            }
                                        } catch (error) {
                                            enqueueSnackbar('Error: Something went wrong!', { variant: 'error' })
                                        }
                                    }}
                                />
                            </Col>
                        </Row>
                    </>
                )
            }
        },
    ];
    if (jobData.length)
    return (
        <>
            <DashboardHeader />
            <Row style={{ marginTop: '-130px' }} className='mx-16'>
                <Col span={24}>
                    <Title style={{ color: 'white' }}>All Jobs</Title>
                    <Paragraph style={{ color: 'white' }}>You can change the status of your Sales Officer's accounts, also you can remove them permanently.</Paragraph>
                </Col>
            </Row>
            <Card bordered={false} style={{ width: '95%', margin: '0 auto' }}>
                <Row className='pb-16' justify={'space-between'}>
                    <Col span={24} className='mb-16 pb-16'>
                        <Table dataSource={jobData} pagination={false} columns={columns} scroll={{ x: 100 }} size='small' />
                    </Col>
                    <Col span={24}>
                        <Collapse size='small' bordered items={
                            [{
                                key: '1',
                                label: <Paragraph> Click to read stage one description</Paragraph>,
                                children: <p>{'sdsds'}</p>,
                            }]
                        } />
                    </Col>
                    <Col span={24} className='mt-8'>
                        <Collapse size='small' bordered items={
                            [{
                                key: '1',
                                label: <Paragraph level={5}>Click to read stage one description</Paragraph>,
                                children: <p>{'sdsds'}</p>,
                            }]
                        } />
                    </Col>
                </Row>
                <Row>
                    <Divider>
                        <Space size={20}>
                            <Button type='dashed' onClick={() => handleData(stageType = 'first-stage')} className='px-32 h-10'>Data Stage-1</Button>
                            <Button type='dashed' onClick={() => handleData(stageType = 'second-stage')} className='px-32 h-10'>Data Stage-2</Button>
                        </Space>
                    </Divider>
                </Row>
                <Row className='mt-16 mb-16 pt-16'>
                    <Space className='flex-wrap'>

                        {
                            stageData?.map((img) => (
                                <Row key={img.image} >
                                    <Image src={img.image} alt={img.image} width={200} height={200} className='border-primary' />
                                    <p>{img.rating}</p>
                                </Row>
                            ))
                        }
                    </Space>
                </Row>
            </Card>
        </>
    )
}

export default JobDetail