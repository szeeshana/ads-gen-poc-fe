import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import DashboardHeader from './admin/DashboardHeader';
import { Button, Card, Col, Collapse, Divider, Image, Row, Space, Table, Badge, Modal, Tooltip, Select, Spin } from 'antd';
import { CopyOutlined, RedoOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { enqueueSnackbar } from 'notistack'
import ReactJson from 'react-json-view'

import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import { getApi, patchApi } from '../utils/httpServices';
import { socket } from '../socket';
import { ENQUEUESNACKBAR_MSG_FOR_JOB, STATUSES } from '../utils/constants';


function JobDetail() {
    let stageType
    const { state } = useLocation()
    const [stageData, setStageData] = useState()
    const [jobData, setJobData] = useState([])
    const [viewDescription, setViewDescription] = useState(false)
    const [count, setCount] = useState(0)
    // eslint-disable-next-line
    const [isConnected, setIsConnected] = useState(socket.connected)
    const [refreshed, setRefreshed] = useState(false)
    const [btn1, setBtn1] = useState('')
    const [btn2, setBtn2] = useState('')
    const [collapse1, setCollapse1] = useState([''])
    const [collapse2, setCollapse2] = useState([''])

    const getJobData = async () => {
        try {

            setRefreshed(true)

            const response = await getApi({ url: `${process.env.REACT_APP_BASE_URI}/api/job/${state.id}` });
            if (response.status === 200) {
                jobData.length >= 1 ? jobData.pop() : console.log('d');
                setJobData([...jobData, response.data.data]);
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
            console.log(value.message, "SCOKET CALLED ME");
            setJobData([value.message.data])
            enqueueSnackbar(ENQUEUESNACKBAR_MSG_FOR_JOB[value.message.action_type].message, { variant: 'info', autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'center' } })
            if (value.message.first_stage_description === true) {
                setCollapse1(['1'])
            }
            if (value.message.second_stage_description === true) {
                setCollapse2(['2'])
            }
            if (value.message.first_stage_images === true) {
                setBtn2({})
                setBtn1({ color: 'green', borderColor: 'green' })
                handleData(stageType = 'first-stage')
            }
            if (value.message.second_stage_images === true) {
                setBtn1({})
                setBtn2({ color: 'green', borderColor: 'green' })
                handleData(stageType = 'second-stage')
            }
        });

        return () => {
            console.log("PPPREM");
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off(state.id);
        };
        // eslint-disable-next-line
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
                return <Badge count={STATUSES[text]['text']} color={STATUSES[text]['color']} style={{ width: '150px', }} />
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
                    <Row className='pb-16' justify={'space-between'}>
                        <Col span={24} className='mb-16 pb-16'>
                            <Table dataSource={jobData} pagination={false} columns={columns} scroll={{ x: 100 }} size='small' key={'_id'} />
                            <div className='flex justify-content-center mt-8' >
                                {
                                    refreshed ? <Spin size="large" /> : <Button icon={<RedoOutlined />} onClick={() => getJobData()}></Button>
                                }
                            </div>
                        </Col>
                        {jobData[0].status !== 'draft' && <> <Col span={24}>
                            <Collapse
                                size='small'
                                bordered
                                // key={1}
                                activeKey={collapse1}
                                onChange={activeKey => collapse1[0] === '1' ? setCollapse1([]) : setCollapse1(['1'])}
                                items={
                                    [
                                        {
                                            key: '1',
                                            label: <Paragraph>FIRST STAGE DESCRIOTIONS</Paragraph>,
                                            children: jobData && jobData.length && jobData[0]['descriptions'] && jobData[0]['descriptions'].length && jobData[0]['descriptions'].map((item) => <><li><strong>Rating :</strong> {item.rating}</li><li><strong>Description : </strong> <br></br> {item.description}</li> <br></br></>),
                                        }
                                    ]
                                } />
                        </Col>
                            <Col span={24} className='mt-8'>
                                <Collapse
                                    size='small'
                                    bordered
                                    // key={2}
                                    activeKey={collapse2}
                                    onChange={activeKey => collapse2[0] === '2' ? setCollapse2([]) : setCollapse2(['2'])}
                                    items={
                                        [{
                                            key: '2',
                                            label: <Paragraph level={5}>SECOND STAGE DESCRIOTIONS</Paragraph>,
                                            children: jobData && jobData.length && jobData[0]['second_stage_descriptions'] && jobData[0]['second_stage_descriptions'].length && jobData[0]['second_stage_descriptions'].map((item) => <><li><strong>Rating :</strong> {item.rating}</li><li><strong>Description : </strong> <br></br> {item.description}</li> <br></br></>),
                                        }]
                                    } />
                            </Col>
                        </>}
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
                    {jobData[0].status !== 'draft' &&
                        <>
                            <Row>
                                <Divider>
                                    <Space size={20}>
                                        <Button
                                            type='dashed'
                                            onClick={() => {
                                                setBtn2({})
                                                setBtn1({ color: 'green', borderColor: 'green' })
                                                handleData(stageType = 'first-stage')
                                            }}
                                            style={btn1}
                                            className='px-32 h-10'>
                                            Images Stage-1
                                        </Button>
                                        <Button
                                            type='dashed'
                                            onClick={() => {
                                                setBtn1({})
                                                setBtn2({ color: 'green', borderColor: 'green' })
                                                handleData(stageType = 'second-stage')
                                            }}
                                            style={btn2}
                                            className='px-32 h-10'>
                                            Images Stage-2
                                        </Button>
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