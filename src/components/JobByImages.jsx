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
import CommonSelect from './common/CommonSelect';
import { CommonTextAreaInput } from './common/CommonTextArea';
import CommonInfoMsg from './common/CommonInfoMsg';
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });


function JobByImages() {
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
    const productDescription = `We are a marketing agency creating advertisements for a client.The product is Auto financing for people with bad credit.`;
    const productDemographic = `The target demographic for the product is males aged 25-34 with below average income and credit score.`
    return (
        <div>
            <DashboardHeader />
            <Row style={{ marginTop: '-130px' }} className='mx-16'>
                <Col span={24}>
                    <Title level={3} style={{ color: 'white' }}>Job By Image Upload</Title>
                    <Paragraph style={{ color: 'white' }}>Upload image to create attractive ads using AI</Paragraph>
                </Col>
            </Row>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    image: '',
                    status:'',
                    product_description:productDescription? productDescription: '',
                    demographic:productDemographic? productDemographic: '',
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    setLoading(true);
                    let imageFiles = fileList.map((file) => file.originFileObj)
                    values.image = imageFiles[0]
                    try {
                        // eslint-disable-next-line
                        const response = await postApi({
                            url: `${process.env.REACT_APP_BASE_URI}/api/job/create-by-image`,
                            method: "POST",
                            body: values,
                            options: {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                }
                            }
                        });
                        if (response.status === 201) {
                            navigate('/job-detail', {state:{id:response.data.data._id}})
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
                        <Col span={24} className='mt-8'>
                                <CommonSelect
                                    label="What you want to do with this job?"
                                    name="status"
                                    id="status"
                                    className='w-full'
                                    placeholder="Want to save or render now"
                                    size='large'
                                    value={undefined}
                                    options={[
                                        { value: 'draft', label: 'Draft' },
                                        { value: 'pending', label: 'Render Now' },
                                    ]}
                                    onChange={(e) => setFieldValue('status', e)}
                                />
                            </Col>
                            <Col span={24} className='mt-16'>
                                <CommonInfoMsg title="Product Description" content="Describe the product" />
                            </Col>
                            <Col span={24}>
                                <CommonTextAreaInput
                                    name="product_description"
                                    id="product_description"
                                    className='w-full mt-4'
                                    type='text'
                                    size='large'
                                    style={{ minHeight: '100px' }}
                                />
                            </Col>
                            <Col span={24} className='mt-16'>
                                <CommonInfoMsg title="Product Demographics" content="product demographics" />
                            </Col>
                            <Col span={24}>
                                <CommonTextAreaInput
                                    name="demographic"
                                    id="demographic"
                                    className='w-full mt-4'
                                    type='text'
                                    size='large'
                                    style={{ minHeight: '100px' }}
                                />
                            </Col>
                            <Col span={24} className='w-full mb-8 mt-16'>
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
                                    {fileList.length <1 ? uploadButton : null}
                                </Upload>
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

export default JobByImages