import './App.css';
import { Route, Routes } from 'react-router'
// import ProtectedRoute from './auth/ProtectedRoute';
import { ConfigProvider, theme } from 'antd';
import MainLayout from './layout';
import { useSelector } from 'react-redux';
import Signin from './auth/Signin';
import Signup from './auth/Signup';

function App() {
  const {themeMode, themeColor}=useSelector(state=> state.themeSetup)
  // fir-sso-169b5
  return (
    <ConfigProvider
      theme={{
        // 1. Use dark algorithm
        algorithm: themeMode === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,

        // 2. Combine dark algorithm and compact algorithm
        // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],

        token: {
          // Seed Token
          // colorPrimary: '#00b96b',
          colorPrimary: themeColor,
          borderRadius: 5,

          // Alias Token
          colorBgContainer: themeMode === 'light' ? '#fefefe' : '#001529',
        },
      }}
    >
    <div>
      <Routes>
        <Route path='sign-in' element={<Signin />} />
        <Route path='sign-up' element={<Signup />} />
        <Route
          path='*'
          element={<MainLayout />}
        />
      </Routes>
    </div>
    </ConfigProvider>

  );
}

export default App;
