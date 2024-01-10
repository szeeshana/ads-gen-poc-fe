import './auth.css'
import { Button, Col, Row, Spin, Typography } from 'antd'
import React, { useState } from 'react'
import Title from 'antd/es/typography/Title'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import CommonTextInput from '../components/common/CommonTextInput'
import { useNavigate } from 'react-router-dom'
import { enqueueSnackbar } from 'notistack'
import { postApi } from '../utils/httpServices'
import { Card, Divider } from 'antd/es'
import GoogleSignin from './firebase/GoogleSignin'
import ReCAPTCHA from 'react-google-recaptcha'
const { Link, Text } = Typography

function Signin() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [recaptchaToken, setRecaptchaToken] = useState(null)

    return (
        <>
            <Row className='min-h-screen card-gradient'>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} className=''>
                    <Row className='h-full justify-content-center align-content-center'>
                        <Col xs={{ span: 24 }} sm={{ span: 10 }}>
                            <Card className='box-shadow'>
                                <div className='bg-white p-20'>
                                    <Divider><Title style={{ lineHeight: '20px', fontWeight: 'bold', color: '#00a76f' }}>Sign In !</Title></Divider>
                                    <Formik
                                        initialValues={{
                                            email: '',
                                            password: '',
                                        }}
                                        validationSchema={Yup.object({
                                            email: Yup.string()
                                                .email('Invalid email address')
                                                .required('Required'),
                                            password: Yup.string()
                                                .required('Required'),
                                        })}
                                        onSubmit={async (values, { setSubmitting }) => {
                                            try {
                                                setLoading(true)
                                                // eslint-disable-next-line
                                                const response = await postApi({
                                                    url: `${process.env.REACT_APP_BASE_URI}/api/auth/login`,
                                                    method: "POST",
                                                    body: values,
                                                });
                                                setRecaptchaToken(null)
                                                if (response.status === 200) {
                                                    localStorage.setItem('token', response.data.access_token)
                                                    setSubmitting(false)
                                                    navigate('/')
                                                    enqueueSnackbar(response.data.message, { variant: 'success' });
                                                }
                                                setLoading(false);
                                            } catch (error) {
                                                setLoading(false)
                                                setRecaptchaToken(null)
                                                enqueueSnackbar(error.response.data.message, { variant: 'error' });
                                            }
                                        }}
                                    >
                                        <Form>
                                            <CommonTextInput
                                                label="Email"
                                                name="email"
                                                id="email"
                                                type="email"
                                                placeholder="jane@formik.com"
                                                size="large"
                                                className="mb-8"
                                            />
                                            <CommonTextInput
                                                label="Password"
                                                name="password"
                                                id="password"
                                                className="mb-8"
                                                type="password"
                                                placeholder="password"
                                                size="large"
                                            />
                                            <div className="flex flex-row justify-content-between">
                                                <div >
                                                </div>
                                                <div>
                                                    <Link href="http://localhost:3000/signin" target="_blank">
                                                        Forget password?
                                                    </Link>
                                                </div>
                                            </div>
                                            <ReCAPTCHA
                                                sitekey='6LckVEwpAAAAAD5bRAGI12uIUdJ5JRG9pvmGaGkR'
                                                onChange={(value) => {setRecaptchaToken(value)}}
                                            />
                                            <br />
                                            <Button type='primary' disabled={!recaptchaToken? true: false} htmlType='submit' className='px-32'>{loading ? <Spin /> : 'Submit'}</Button>
                                            <br />
                                            <br />
                                            <Text italic>Don't have an account </Text>
                                            <Link italic href="http://localhost:3000/sign-up">
                                                sign up here
                                            </Link>
                                        </Form>
                                    </Formik>
                                </div>
                                <Divider><p className='text-grey'>or</p></Divider>
                                <GoogleSignin />
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default Signin