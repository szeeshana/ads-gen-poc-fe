import React, { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Modal, Row, Spin, Table, Tooltip } from 'antd'
import { EyeOutlined, CopyOutlined, } from '@ant-design/icons'
import Title from 'antd/es/typography/Title'
import Paragraph from 'antd/es/typography/Paragraph'
import { getApi } from '../utils/httpServices'
import DashboardHeader from './admin/DashboardHeader'
import { enqueueSnackbar } from 'notistack'
import ReactJson from 'react-json-view'
import { useNavigate } from 'react-router-dom'
import { STATUSES } from '../utils/constants'
import { stringContinuety, timeStamp } from '../utils/helper'


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
                for (let i = 0; i < res.data.data.length; i++) {
                    res.data.data[i].key = i+1
                }
                setJobsData(res.data.data);
                console.log(jobsData, "POPO");
                setRefreshed(false)
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getJobsData();
        // eslint-disable-next-line
    }, [])

    const columns = [
        {
            title: 'S#',
            dataIndex: 'key',
            sorter: (a, b) => a.key - b.key,
        },
        {
            title: 'Job ID',
            dataIndex: '_id',
            key: 'id',
            render: (text, record) => {
                return (
                    <>
                        <Paragraph>{stringContinuety(text, 0, 10)}
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
            sorter: (a, b) => a.type.localeCompare(b.type),
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
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'data',
            render: (record) => {
                return timeStamp(record)
            },
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
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
            title: 'status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status.localeCompare(b.status),
            render: (text, record) => {
                return <Badge count={STATUSES[text]['text']} color={STATUSES[text]['color']} style={{width: '150px',}} />
            }
        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: 'action',
            width: 70,

            render: (text, record) => {
                return (
                    <>
                        <Row gutter={8} justify={'space-around'} className='w-full'>
                            <Col span={12} className='w-full action_btn' onClick={() => navigate('/job-detail', { state: { id: record._id } })}>
                                <EyeOutlined style={{ color: 'green' }} />
                            </Col>
                            {/* <Col span={8} className='w-full action_btn'>
                                <StopOutlined style={{ color: 'red' }} /> */}
                                {/* <DeleteUserModel
                                onDel={}
                                 id={record.id}
                                 />
                                <DeleteOutlined style={{ color: 'red' }} /> */}
                            {/* </Col> */}
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

                    </Row>
                    <Row className='py-16' justify={'space-between'}>
                        <Col span={24}>
                            <Table
                                dataSource={jobsData}
                                columns={columns}
                                scroll={{ x: 100 }}
                                size='small'
                                // pagination={{
                                //     onChange(current, pageSize) {
                                //         setPage(current);
                                //     }
                                // }}
                            />
                        </Col>
                        <Col span={24} className='align-items-center flex flex-col' >
                            {
                                refreshed ? <Spin size="large" /> : null
                            }
                        </Col>
                    </Row>
                </Card>
            </>
        )
}

export default ViewJobs