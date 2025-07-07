import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Integrations from './pages/Integrations';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AuthCallback from './components/Auth/AuthCallback';


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/produtos" element={
                  <ProtectedRoute>
                    <Layout>
                      <Products />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/produtos/:id" element={
                  <ProtectedRoute>
                    <Layout>
                      <ProductDetails />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <Layout>
                      <Analytics />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/alertas" element={
                  <ProtectedRoute>
                    <Layout>
                      <Alerts />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/relatorios" element={
                  <ProtectedRoute>
                    <Layout>
                      <Reports />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/integracoes" element={
                  <ProtectedRoute>
                    <Layout>
                      <Integrations />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/planos" element={
                  <ProtectedRoute>
                    <Layout>
                      <Pricing />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/configuracoes" element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin>
                    <Layout>
                      <Admin />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/auth/callback" element={<AuthCallback />} />
              </Routes>
            </div>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;