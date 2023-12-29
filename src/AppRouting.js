import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './components/admin/Dashboard'
import JobByImages from './components/JobByImages'
import JobByDemographic from './components/JobByDemographic'
import JobByDesc from './components/JobByDesc'
import ProtectedRoute from './auth/ProtectedRoute'
import ViewJobs from './components/ViewJobs'
import WebSocketComponent from './components/WebSocket'
import JobDetail from './components/JobDetail'

function AppRouting() {
    return (
        <div>
            <Routes>
                <Route path='/' element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
                />
            </Routes>
            <Routes>
                <Route path='/job-by-image' element={
                    <ProtectedRoute>
                        <JobByImages />
                    </ProtectedRoute>
                }
                />
            </Routes>
            <Routes>
                <Route path='/job-by-demographic' element={
                    <ProtectedRoute>
                        <JobByDemographic />
                    </ProtectedRoute>
                }
                />
            </Routes>
            <Routes>
                <Route path='/job-by-description' element={
                    <ProtectedRoute>
                        <JobByDesc />
                    </ProtectedRoute>
                }
                />
            </Routes>
            <Routes>
                <Route path='/jobs' element={
                    <ProtectedRoute>
                        <ViewJobs />
                    </ProtectedRoute>
                }
                />
            </Routes>
            <Routes>
                <Route path='/job-detail' element={
                    <ProtectedRoute>
                        <JobDetail />
                    </ProtectedRoute>
                }
                />
            </Routes>
            <Routes>
                <Route path='ws' element={<WebSocketComponent />} />
            </Routes>
        </div>
    )
}

export default AppRouting