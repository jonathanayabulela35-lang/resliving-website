import { Toaster } from '@/components/ui/toaster';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import Layout from './components/Layout';
import ManagerLayout from './components/manager/ManagerLayout';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import GetStarted from './pages/GetStarted';
import Dashboard from './pages/Dashboard';
import ManagerLogin from './pages/ManagerLogin';
import Visitors from './pages/Visitors';
import Messages from './pages/Messages';
import Community from './pages/Community';
import Settings from './pages/Settings';
import Maintenance from './pages/Maintenance';

function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) return <LoadingScreen />;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/manager-login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) return <LoadingScreen />;

  if (isAuthenticated) {
    return <Navigate to="/manager/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/manager-login"
          element={
            <PublicOnlyRoute>
              <ManagerLogin />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/get-started"
          element={
            <ProtectedRoute>
              <GetStarted />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager"
          element={
            <ProtectedRoute>
              <ManagerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/manager/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="visitors" element={<Visitors />} />
          <Route path="messages" element={<Messages />} />
          <Route path="community" element={<Community />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/dashboard" element={<Navigate to="/manager/dashboard" replace />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AppRoutes />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}
