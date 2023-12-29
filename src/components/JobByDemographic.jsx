import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Modal, Row, Spin, Upload } from 'antd';
import DashboardHeader from './admin/DashboardHeader';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import { Form, Formik } from 'formik';
import { enqueueSnackbar } from 'notistack';
import { postApi } from '../utils/httpServices';
import { useNavigate } from 'react-router-dom';
import { CommonTextAreaInput } from './common/CommonTextArea';
import CommonSelect from './common/CommonSelect';
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
function JobByDemographic() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );
    return (
        <div>
            <DashboardHeader />
            <Row style={{ marginTop: '-130px' }} className='mx-16'>
                <Col span={24}>
                    <Title level={3} style={{ color: 'white' }}>Upload and Describe single image (Demograpic)</Title>
                    <Paragraph style={{ color: 'white' }}>Write Description for the desired image to create attractive ads using AI</Paragraph>
                </Col>
            </Row>
            <Formik
                initialValues={{
                    image: fileList[0],
                    description: '',
                    status: '',
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    setLoading(true);
                    try {
                        values.image = fileList[0].originFileObj
                        const response = await postApi({
                            url: `${process.env.REACT_APP_BASE_URI}/api/job/create-description-image`,
                            method: "POST",
                            body: values,
                            options: {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            }
                        });
                        if (response.status === 201) {
                            navigate('/')
                            enqueueSnackbar(response.data.message, { variant: 'success' });
                        }
                        setLoading(false);
                    } catch (error) {
                        enqueueSnackbar(error.response.data.message, { variant: 'error' });
                        setLoading(false);
                    }
                }}
            >
                {({ setFieldValue }) => (
                    <Form>
                        <Row className='mx-8' style={{ marginTop: '60px' }}>
                            <Col span={24}>
                                <CommonTextAreaInput
                                    label="Image Description"
                                    name="description"
                                    id="description"
                                    className='w-full mb-8'
                                    placeholder='Describe the image'
                                    type='text'
                                    size='large'
                                    style={{ minHeight: '100px' }}
                                />
                            </Col>
                            <Col span={24} className='w-full mb-8'>
                                <b className='text-grey'>Upload Image</b>
                                <Upload
                                    name="Images"
                                    className='pt-8 px-8 border-primary uploadButton-bg'
                                    beforeUpload={() => false}
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleChange}
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
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
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
        </div>
    )
}

export default JobByDemographic