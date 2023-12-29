import { Button, Col, Divider, Row, Spin } from 'antd';
import { Form, Formik } from 'formik';
import React, { useState } from 'react'
import DashboardHeader from './admin/DashboardHeader';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import { enqueueSnackbar } from 'notistack';
import { CommonTextAreaInput } from './common/CommonTextArea';
import { postApi } from '../utils/httpServices';
import { useNavigate } from 'react-router-dom';
import CommonSelect from './common/CommonSelect';

function JobByDesc() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    return (
        <div>
            <DashboardHeader />
            <Row style={{ marginTop: '-130px' }} className='mx-16'>
                <Col span={24}>
                    <Title level={3} style={{ color: 'white' }}>Describe Image</Title>
                    <Paragraph style={{ color: 'white' }}>Write Description for the desired image to create attractive ads using AI</Paragraph>
                </Col>
            </Row>
            <Formik
                enableReinitialize
                initialValues={{
                    description: '',
                    status: '',
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    setLoading(true);
                    try {
                        const response = await postApi({
                            url: `${process.env.REACT_APP_BASE_URI}/api/job/create-description`,
                            method: "PATCH",
                            body: values,
                        });
                        if (response.status === 201) {
                            navigate('/')
                            enqueueSnackbar(response.data.message, { variant: 'success' });
                        }
                        setSubmitting(false);
                    } catch (error) {
                        enqueueSnackbar(error.response.data.message, { variant: 'error' });
                        setSubmitting(false);
                    }
                }}
            >
                {({ setFieldValue, }) => (
                    <Form>
                        <Row className='mx-8' style={{ marginTop: '60px' }}>
                            <Col span={24}>
                                <CommonTextAreaInput
                                label={"Describe the image"}
                                    name="description"
                                    id="description"
                                    className='w-full mb-16'
                                    placeholder='Describe the image'
                                    type='text'
                                    size='large'
                                    style={{ minHeight: '120px' }}
                                />
                            </Col>
                            <Col span={24}>
                                <CommonSelect
                                    label="What you want to do with this job?"
                                    name="status"
                                    id="status"
                                    className='w-full'
                                    placeholder='Want to save or render now'
                                    size='large'
                                    value={undefined}
                                    options={[
                                        { value: 'draft', label: 'Draft' },
                                        { value: 'pending', label: 'Render Now' },
                                    ]}
                                    onChange={(e) => setFieldValue('status', e)}
                                />
                            </Col>
                            <Divider>
                                <Button type='primary' disabled={loading} htmlType='submit' className='px-32'>{loading ? <Spin /> : 'Submit'}</Button>
                            </Divider>
                        </Row>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default JobByDesc