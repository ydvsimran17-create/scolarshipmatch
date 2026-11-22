import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import Dashboard from './pages/Dashboard'
import FindScholarships from './pages/FindScholarships'
import ScholarshipDetail from './pages/ScholarshipDetail'
import MyApplications from './pages/MyApplications'
import Documents from './pages/Documents'
import StudentProfile from './pages/StudentProfile'
import AiEssayAssistant from './pages/AiEssayAssistant'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          {/* 1. Main Student Dashboard Route */}
          <Route index element={<Dashboard />} />

          {/* 2. Scholarship Discovery Routes */}
          <Route path="find-scholarships" element={<FindScholarships />} />
          <Route path="find-scholarships/:id" element={<ScholarshipDetail />} />
          <Route path="scholarships/:id" element={<ScholarshipDetail />} />

          {/* 3. My Applications Routes */}
          <Route path="applications" element={<MyApplications />} />
          <Route path="applications/:applicationId" element={<MyApplications />} />

          {/* 4. Documents Management Route */}
          <Route path="documents" element={<Documents />} />

          {/* 5. Student Profile Builder Routes */}
          <Route path="profile" element={<StudentProfile />} />
          <Route path="settings" element={<StudentProfile />} />

          {/* 6. AI Essay Assistant Route */}
          <Route path="essay-assistant" element={<AiEssayAssistant />} />

          {/* Catch-all redirect to Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
