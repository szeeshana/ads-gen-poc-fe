import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import DashboardHeader from './admin/DashboardHeader';
import { Button, Card, Col, Collapse, Divider, Image, Row, Space, Table, Badge, Modal, Tooltip, Select, Flex, Spin } from 'antd';
import { EyeOutlined, StopOutlined, CopyOutlined, RedoOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { enqueueSnackbar } from 'notistack'
import ReactJson from 'react-json-view'

import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import { getApi, patchApi, postApi } from '../utils/httpServices';
import CommonSelect from './common/CommonSelect';
import { socket } from '../socket';
import { ENQUEUESNACKBAR_MSG_FOR_JOB, STATUSES } from '../utils/constants';
import { io } from 'socket.io-client';


function JobDetail() {
    let stageType
    const { state } = useLocation()
    const [stageData, setStageData] = useState()
    const [jobData, setJobData] = useState([])
    const [viewDescription, setViewDescription] = useState(false)
    const [count, setCount] = useState(0)
    const [isConnected, setIsConnected] = useState(socket.connected)
    const [refreshed, setRefreshed] = useState(false)

    const getJobData = async () => {
        try {
            
            setRefreshed(true)
            
            const response = await getApi({ url: `${process.env.REACT_APP_BASE_URI}/api/job/${state.id}` });
            if (response.status === 200) {
                jobData.length >= 1 ? jobData.pop() : console.log('d');
                setJobData([...jobData, response.data.data]);
                console.log(jobData, "POPO");
                setRefreshed(false)
                
            }
        } catch (error) {
            alert('Error: Something went wrong!')
        }
    }


    useEffect(() => {
        function onConnect() {
            console.log('connected');
            setIsConnected(true);
        }

        function onDisconnect() {
            console.log('disconnected');
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        socket.on(state.id, (value) => {
            console.log(value, "SCOKET CALLED ME");
            setJobData([value.message.data])
            enqueueSnackbar(ENQUEUESNACKBAR_MSG_FOR_JOB[value.message.action_type].message, { variant: 'info', autoHideDuration: 2000, anchorOrigin: {vertical: 'top', horizontal: 'center'} })
        });

        return () => {
            console.log("PPPREM");
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off(state.id);
        };

    }, []);

    useEffect(() => {
        getJobData()
    }, [count])


    const handleData = async (stageType) => {
        try {
            const response = await getApi({ url: `${process.env.REACT_APP_BASE_URI}/api/job/${stageType}/${state.id}` });
            if (response.status === 200) {
                setStageData(response.data.data);
                if (response.data.data.length === 0) {
                    enqueueSnackbar('No Data ', { variant: 'error' })
                }
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
            render: (text, record) => {
                return (
                    <>
                        <Paragraph>{text}
                            <Tooltip placement="top" title="Copy ID">
                                <Button type='text'
                                    onClick={() => {
                                        navigator.clipboard.writeText(text)
                                        enqueueSnackbar("Copied To Clipboard!", { variant: 'success' })
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
                if (text === 'image_description_create') {
                    return <Paragraph>By Image</Paragraph>
                }
                else {
                    return <Paragraph>Job</Paragraph>
                }
            }
        },
        {
            title: 'status',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                // if (text === 'draft') {
                //     return <Badge count={text} color="#d2b07d" style={{}} />
                // } else if (text === 'pending') {
                //     return <Badge count={text} color="#e28528" style={{}} />
                // } else if (text === 'in_progress' || text === 'first_stage_completed' || text === 'second_stage_in_progress') {
                //     return <Badge count={text} color="blue" style={{}} />
                // } else if (text === 'completed') {
                //     return <Badge count={text} color="#00a76f" style={{}} />
                // } else if (text === 'completed') {
                //     return <Badge count={text} color="#00a76f" style={{}} />
                // }
                // else {
                return <Badge count={text} color={STATUSES[text]['color']} style={{}} />
                // }
            }
        },
        {
            title: 'Data',
            dataIndex: 'data',
            key: 'data',
            render: (text, record) => {
                return (
                    <>
                        <Button onClick={() => setViewDescription(true)} style={{ padding: '0px 15px', textAlign: 'center' }} >View</Button>
                        <Modal open={viewDescription} title={'Your Data'} footer={null} onCancel={() => setViewDescription(false)}>
                            <Row>
                                <Col span={24} style={{ minHeight: '200px' }}>
                                    <ReactJson src={text} collapsed={1} collapseStringsAfterLength={30} theme={'monokai'} indentWidth={3} iconStyle='square' style={{ wordBreak: 'break-all' }} />
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
                                    disabled={record.status !== 'draft' && record.status !== 'failed'}
                                    className='w-full'
                                    options={[
                                        { value: 'draft', label: 'Draft' },
                                        { value: 'pending', label: 'Render Now' },
                                    ]}
                                    onChange={async (e) => {
                                        try {
                                            const response = await patchApi({
                                                url: `${process.env.REACT_APP_BASE_URI}/api/job/${state.id}`,
                                                method: 'PATCH',
                                                body: { status: e },
                                            });
                                            if (response.status === 200) {
                                                setCount(count + 1)
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
                    {
                        refreshed ? <Spin size="large" /> : <button onClick={() => getJobData()}>Refresh <RedoOutlined /></button>
                    }
                    <Row className='pb-16' justify={'space-between'}>
                        <Col span={24} className='mb-16 pb-16'>
                            <Table dataSource={jobData} pagination={false} columns={columns} scroll={{ x: 100 }} size='small' rowKey="_id"/>
                        </Col>
                        {jobData[0].status !== 'draft' && <> <Col span={24}>
                            <Collapse size='small' bordered items={
                                [{
                                    key: '1',
                                    label: <Paragraph>FIRST STAGE DESCRIOTIONS</Paragraph>,
                                    children: jobData && jobData.length && jobData[0]['descriptions'] && jobData[0]['descriptions'].length && jobData[0]['descriptions'].map((item) => <><li><strong>Rating :</strong> {item.rating}</li><li><strong>Description : </strong> <br></br> {item.description}</li> <br></br></>),
                                }]
                            } />
                        </Col>
                            <Col span={24} className='mt-8'>
                                <Collapse size='small' bordered items={
                                    [{
                                        key: '1',
                                        label: <Paragraph level={5}>SECOND STAGE DESCRIOTIONS</Paragraph>,
                                        children: jobData && jobData.length && jobData[0]['second_stage_descriptions'] && jobData[0]['second_stage_descriptions'].length && jobData[0]['second_stage_descriptions'].map((item) => <><li><strong>Rating :</strong> {item.rating}</li><li><strong>Description : </strong> <br></br> {item.description}</li> <br></br></>),
                                    }]
                                } />
                            </Col></>}
                    </Row>
                    <Row className='justify-content-center'>
                        <Col span={12} className='flex flex-col align-items-center text-center'>
                            {
                                jobData[0].status === 'in_progress' || jobData[0].status === 'first_stage_completed' || jobData[0].status === 'second_stage_in_progress' ?
                                    <div className='flex flex-row align-items-center'>
                                        <Space>
                                            <Spin style={{ verticalAlign: 'center' }} size="large" />
                                            <h3>JOB IN PROGRESS</h3>
                                            <Spin style={{ verticalAlign: 'center' }} size="large" />
                                        </Space>
                                    </div> :
                                    jobData[0].status === 'draft' ? <h3>JOB IN DRAFT <h5>Job is in draft state, you to need to change it to render now</h5></h3> : jobData[0].status === 'completed' ?
                                        <div className='flex flex-row align-items-center'>
                                            <Space>
                                                <CheckCircleOutlined style={{ color: 'green', fontSize: '40px' }} /><h3>JOB COMPLETED</h3><CheckCircleOutlined style={{ color: 'green', fontSize: '40px' }} />
                                            </Space>
                                        </div> :
                                        jobData[0].status === 'pending' ? <h3>JOB PENDING</h3> :
                                            <div className='flex flex-col align-items-center'>
                                                <Space><WarningOutlined style={{ color: 'red', fontSize: '40px' }} />
                                                    <h3>JOB FAILED</h3>
                                                    <WarningOutlined style={{ color: 'red', fontSize: '40px' }} /></Space>
                                                <Paragraph className='mt-16'>{jobData[0].failed_reason}</Paragraph>
                                            </div>
                            }
                        </Col>
                    </Row>

                    {/* {
                    (jobData[0].status === 'completed') && <Row>
                        <Col span={10}></Col>
                        <Col span={5}><Flex align='center' gap="middle">
                            <CheckCircleOutlined style={{ color: 'green', fontSize: '40px' }} />
                            <h3>JOB COMPLTED</h3>
                            <CheckCircleOutlined style={{ color: 'green', fontSize: '40px' }} />
                        </Flex></Col>

                    </Row>
                    } */}
                    {/* {
                        jobData[0].status === 'failed' && <><Row>
                            <Col span={10}></Col>
                            <Col span={5}><Flex align='center' gap="middle">
                                <WarningOutlined style={{ color: 'red', fontSize: '40px' }} />
                                <h2>JOB FAILED</h2>
                                <WarningOutlined style={{ color: 'red', fontSize: '40px' }} />
                            </Flex></Col>
                        </Row>
                            <Row>
                                <Col span={10}></Col>
                                <Col span={5}><Flex align='center' gap="middle">
                                    <p>{jobData[0].failed_reason}</p>
                                </Flex></Col>
                            </Row></>
                    } */}

                    {jobData[0].status !== 'draft' &&
                        <>
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
                                            <Row style={{ marginLeft: '10px' }} key={img.image}>
                                                <Badge count={img.rating}>
                                                    <Image src={img.image} alt={img.image} width={200} height={200} className='border-primary' />
                                                </Badge>
                                            </Row>
                                        ))
                                    }
                                </Space>
                            </Row>
                        </>
                    }
                    

                </Card>
            </>
        )
}

export default JobDetail