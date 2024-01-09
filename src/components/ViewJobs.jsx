import React, { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Modal, Row, Spin, Table, Tooltip } from 'antd'
import { EyeOutlined, StopOutlined, CopyOutlined, RedoOutlined } from '@ant-design/icons'
import Title from 'antd/es/typography/Title'
import Paragraph from 'antd/es/typography/Paragraph'
import { getApi } from '../utils/httpServices'
import DashboardHeader from './admin/DashboardHeader'
import { enqueueSnackbar } from 'notistack'
import ReactJson from 'react-json-view'
import { useNavigate } from 'react-router-dom'


function ViewJobs() {
    const [viewDescription, setViewDescription] = useState(false)
    const navigate = useNavigate()
    const [jobsData, setJobsData] = useState([])
    const [refreshed, setRefreshed] = useState(false)
    const getJobsData = async () => {
        try {
            setRefreshed(true)
            const res = await getApi({ url: `${process.env.REACT_APP_BASE_URI}/api/job` });
            if (res.status === 200) {
                setJobsData(res.data.data);
                setRefreshed(false)
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getJobsData();
    }, [])
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
            title: 'Result',
            dataIndex: 'result',
            key: 'result',
            render: (text, record) => {
                return (
                    <>
                        <Button onClick={() => navigate('/job-detail', {state:{id:record._id}})} style={{padding:'0px 15px', textAlign:'center'}} >View</Button>
                        {/* <Modal open={viewResult} title={'Your Result'} footer={null} onCancel={() => setViewResult(false)}>
                            <Row>
                                <Col span={24} style={{ minHeight:'200px'}}>
                                        <ReactJson src={text} collapsed={1} collapseStringsAfterLength={30} theme={'monokai'} indentWidth={3} iconStyle='square' style={{ wordBreak:'break-all'}} />
                                </Col>
                            </Row>
                        </Modal> */}
                    </>
                )
            }
        },
        {
            title: 'status',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                if (text === 'draft') {
                    return <Badge count={text} color="#d2b07d" style={{}} />
                } else if (text === 'pending') {
                    return <Badge count={text} color="#e28528" style={{}} />
                } else if (text === 'in_progress' || text === 'first_stage_completed' || text === 'second_stage_in_progress') {
                    return <Badge count={text} color="blue" style={{}} />
                }else if (text === 'completed') {
                    return <Badge count={text} color="#00a76f" style={{}} />
                }else if (text === 'completed') {
                    return <Badge count={text} color="#00a76f" style={{}} />
                }
                else {
                    return <Badge count={text} color="#ec0606" style={{}}/>
                }
            }
        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: 'action',
            width: 100,

            render: (text, record) => {
                return (
                    <>
                        <Row gutter={8} justify={'space-around'} className='w-full'>
                            <Col span={8} className='w-full action_btn'>
                                <EyeOutlined style={{ color: 'green' }} />
                            </Col>
                            <Col span={8} className='w-full action_btn'>
                            <StopOutlined style={{ color: 'red' }}/>
                                {/* <DeleteUserModel
                                onDel={}
                                 id={record.id}
                                 />
                                <DeleteOutlined style={{ color: 'red' }} /> */}
                            </Col>
                        </Row>
                    </>
                )
            }
        },
    ];
    if (jobsData)
    
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
                <Row>
                {
                    refreshed ? <Spin size="large" /> : <button onClick={() => getJobsData()}>Refresh <RedoOutlined /></button>
                }
                
                </Row>
                    <Row className='py-16' justify={'space-between'}>
                        <Col span={24}>
                            <Table dataSource={jobsData} columns={columns} scroll={{ x: 100 }} size='small' />
                        </Col>
                    </Row>
                </Card>
            </>
        )
}

export default ViewJobs