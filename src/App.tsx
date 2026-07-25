import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Resources from './pages/Resources';
import ResourceDetail from './pages/ResourceDetail';
import Clientele from './pages/Clientele';
import Careers from './pages/Careers';
import CareerDetail from './pages/CareerDetail';
import Contact from './pages/Contact';
import LabourCodes from './pages/LabourCodes';
import Industries from './pages/Industries';
import { AdminAuthProvider } from './context/AdminAuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import ForgotCredentials from './pages/admin/ForgotCredentials';
import AdminHome from './pages/admin/AdminHome';
import AdminAbout from './pages/admin/AdminAbout';
import AdminClientele from './pages/admin/AdminClientele';
import AdminServices from './pages/admin/AdminServices';
import AdminCareers from './pages/admin/AdminCareers';
import AdminResources from './pages/admin/AdminResources';
import AdminContact from './pages/admin/AdminContact';
import AdminApplications from './pages/admin/AdminApplications';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="labour-codes" element={<LabourCodes />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        <Route path="resources" element={<Resources />} />
        <Route path="resources/:slug" element={<ResourceDetail />} />
        <Route path="clientele" element={<Clientele />} />
        <Route path="industries" element={<Industries />} />
        <Route path="careers" element={<Careers />} />
        <Route path="careers/:slug" element={<CareerDetail />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      <Route
        path="/admin/*"
        element={
          <AdminAuthProvider>
            <Routes>
              <Route path="login" element={<AdminLogin />} />
              <Route path="forgot-credentials" element={<ForgotCredentials />} />
              <Route
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="home" replace />} />
                <Route path="home" element={<AdminHome />} />
                <Route path="about" element={<AdminAbout />} />
                <Route path="clientele" element={<AdminClientele />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="careers" element={<AdminCareers />} />
                <Route path="resources" element={<AdminResources />} />
                <Route path="contact" element={<AdminContact />} />
                <Route path="applications" element={<AdminApplications />} />
                <Route path="enquiries" element={<AdminEnquiries />} />
              </Route>
            </Routes>
          </AdminAuthProvider>
        }
      />
    </Routes>
  );
}

export default App;
