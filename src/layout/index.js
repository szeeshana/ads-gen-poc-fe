import React, { useState, useEffect } from 'react';
import ic_dashboard from '../assets/images/admin/icons/ic_dashboard.svg'
import ic_job from '../assets/images/admin/icons/ic_job.svg'
import ic_user from '../assets/images/admin/icons/ic_user.svg'
import ic_exit from '../assets/images/admin/icons/ic_exit_full_screen.svg'
import { Layout, Menu, theme } from 'antd';
import { useSelector } from 'react-redux';
import { setThemeColor } from '../store/theme/slice';
import AppRouting from '../AppRouting';
import TopHeader from './TopHeader';
import { Link, useNavigate } from 'react-router-dom';
import Title from 'antd/es/typography/Title';
const { Header, Content, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const MainLayout = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState('1');
  const keyUrl = window.location.pathname
  useEffect(() => {
    window.scrollTo(0, 0);
    if (keyUrl === '/') {
      setCurrent('1')
    } else if (keyUrl === '/job-by-image') {
      setCurrent('2')
    } else if (keyUrl === '/job-by-demographic') {
      setCurrent('3')
    } else if (keyUrl === '/job-by-description') {
      setCurrent('4')
    } else if (keyUrl === '/jobs') {
      setCurrent('5')
    }
  }, [keyUrl])

  const [collapsed, setCollapsed] = useState(true);
  const { themeMode } = useSelector(state => state.themeSetup)
  const items = [
    getItem(
      <Link to={'/'} >Home</Link>,
      '1',
      <span style={{ WebkitMask: `url(${ic_dashboard}) no-repeat center/cover`, width: '30px', height: '30px', backgroundColor: 'currentcolor', color: setThemeColor }}></span>,
    ),
    getItem('Jobs', 'sub', <span style={{ WebkitMask: `url(${ic_job}) no-repeat center/cover`, width: '30px', marginLeft:`${collapsed? '0px': '-5px'}`, height: '30px', backgroundColor: 'currentcolor', color: setThemeColor }}></span>, [
      getItem(
        <Link to={'/job-by-image'} >Job By Image</Link>,
        '2',
        ''
      ),
      getItem(
        <Link to={'/job-by-demographic'} >Job By Demographic</Link>,
        '3',
        ''
      ),
      getItem(
        <Link to={'/job-by-description'} >Job Bu Description</Link>,
        '4',
        ''
      ),
    ]),
    getItem(
      <Link to={'/jobs'} >View Jobs</Link>,
      '5',
      <span style={{ WebkitMask: `url(${ic_job}) no-repeat center/cover`, width: '30px', height: '30px', backgroundColor: 'currentcolor', color: setThemeColor }}></span>,
    ),
    getItem(
      <Link to={''} >Profile</Link>,
      '6',
      <span style={{ WebkitMask: `url(${ic_user}) no-repeat center/cover`, width: '30px', height: '30px', backgroundColor: 'currentcolor', color: setThemeColor }}></span>,
    ),
    getItem(
      <Link onClick={() => { localStorage.clear(); navigate('/') }}>Logout</Link>,
      '7',
      <span style={{ WebkitMask: `url(${ic_exit}) no-repeat center/cover`, width: '30px', height: '30px', backgroundColor: 'currentcolor', color: setThemeColor }}></span>,
    ),
  ];
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint='md'
        style={{ backgroundColor: colorBgContainer }}
      >
        <div className="demo-logo-vertical flex justify-content-center align-items-end" style={{ height: '65px' }}>
          {/* <Image  src= {logo} height={100} preview={false} alt='logo' /> */}
          <Title level={3}>AdsGen</Title>
        </div>
        <Menu theme={themeMode} onClick={({ key }) => setCurrent(key)} selectedKeys={current} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            borderBottom: '1px solid #fc'
          }}
          className='flex justify-content-end align-items-center '
        >
          <TopHeader />
          {/* <div style={{display:'flex', justifyContent:'space-around', alignItems:'center'}}>
            <Switch 
            checkedChildren="Light"
            unCheckedChildren="Dark"
                onClick={()=>dispatch(toggleMode('light'))}
            />
            <ColorPicker style={{}} size='small' onChangeComplete={(color) => dispatch(setThemeColor(color.toHexString()))} />
            </div> */}
        </Header>
        <Content
          style={{
            margin: '0 16px',
            // backgroundColor: colorBgContainer
          }}
        >
          <div
            className='content_shadow'
            style={{
              marginTop: 15,
              background: colorBgContainer,
              minHeight: '100dvh'
            }}
          >
            <AppRouting />
          </div>
        </Content>
        {/* <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©2023 Created by Ant UED
        </Footer> */}
      </Layout>
    </Layout>
  );
};
export default MainLayout;


