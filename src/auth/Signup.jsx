import './auth.css'
import { Button, Col, Row, Spin, Typography } from 'antd'
import React, { useState } from 'react'
import Title from 'antd/es/typography/Title'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import CommonTextInput from '../components/common/CommonTextInput'
import { useNavigate } from 'react-router-dom'
import { enqueueSnackbar } from 'notistack'
import ReCAPTCHA from 'react-google-recaptcha'
import { postApi } from '../utils/httpServices'
import { Card, Divider } from 'antd/es'
const { Link, Text } = Typography

function Signup() {
    const [recaptchaToken, setRecaptchaToken] = useState(null)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    return (
        <>
            <Row className='min-h-screen card-gradient'>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} className=''>
                    <Row className='h-full justify-content-center align-content-center'>
                        <Col xs={{ span: 24 }} sm={{ span: 10 }}>
                            <Card className='box-shadow'>
                                <div className='bg-white p-20'>
                                    <Divider><Title style={{ lineHeight: '20px', fontWeight: 'bold', color: '#00a76f' }}>Sign Up</Title></Divider>
                                    <Formik
                                        initialValues={{
                                            firstName: '',
                                            lastName: '',
                                            email: '',
                                            password: '',
                                        }}
                                        validationSchema={Yup.object({
                                            email: Yup.string()
                                                .email('Invalid email address')
                                                .required('Required'),
                                            password: Yup.string()
                                                .required('Required'),
                                            firstName: Yup.string()
                                                .required('Required'),
                                            lastName: Yup.string()
                                                .required('Required'),
                                        })}
                                        onSubmit={async (values, { setSubmitting }) => {
                                            try {
                                                setLoading(true)
                                                // eslint-disable-next-line
                                                const response = await postApi({
                                                    url: `${process.env.REACT_APP_BASE_URI}/api/auth/register`,
                                                    method: "POST",
                                                    body: values,
                                                });
                                                setRecaptchaToken(null)
                                                if (response.status === 201) {
                                                    setSubmitting(false)
                                                    navigate('/sign-in')
                                                    enqueueSnackbar(response.data.message, { variant: 'success' });
                                                }
                                                setLoading(false);
                                            } catch (error) {
                                                setLoading(false)
                                                enqueueSnackbar(error.response.data.message, { variant: 'error' });
                                                setRecaptchaToken(null)
                                            }
                                        }}
                                    >
                                        <Form>
                                            <CommonTextInput
                                                label="First Name"
                                                name="firstName"
                                                id="firstName"
                                                type="text"
                                                placeholder="Joe"
                                                size="large"
                                                className="mb-8"
                                            />
                                            <CommonTextInput
                                                label="Last Name"
                                                name="lastName"
                                                id="lastName"
                                                type="text"
                                                placeholder="Schmoe"
                                                size="large"
                                                className="mb-8"
                                            />
                                            <CommonTextInput
                                                label="Email"
                                                name="email"
                                                id="email"
                                                type="email"
                                                placeholder="test@domain.com"
                                                size="large"
                                                className="mb-8"
                                            />
                                            <CommonTextInput
                                                label="Password"
                                                name="password"
                                                id="password"
                                                className="mb-8"
                                                type="password"
                                                placeholder="********"
                                                size="large"
                                            />

                                            <ReCAPTCHA
                                                sitekey='6LckVEwpAAAAAD5bRAGI12uIUdJ5JRG9pvmGaGkR'
                                                onChange={(value) => {setRecaptchaToken(value)}}
                                            />
                                            <br />
                                            <Button type='primary' disabled={!recaptchaToken? true: false} htmlType='submit' className='px-32'>{loading ? <Spin/> : 'Submit'}</Button>
                                            <br />
                                            <br />
                                            <Text italic>Already have an account </Text>
                                            <Link italic href="http://localhost:3000/sign-in">
                                                sign in here
                                            </Link>
                                        </Form>
                                    </Formik>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default Signup