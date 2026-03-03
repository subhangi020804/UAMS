import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navigation } from "./components/Navigation";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./components/HomePage";
import { DashboardPage } from "./components/DashboardPage";
import { UploadPage } from "./components/UploadPage";
import { SearchPage } from "./components/SearchPage";
import { MyFilesPage } from "./components/MyFilesPage";
import { SystemOverviewPage } from "./components/SystemOverviewPage";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuditPage } from "./components/AuditPage";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-[#051227] via-[#031130] to-[#0a1f44]">
            <Navigation />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <UploadPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/myfiles"
              element={
                <ProtectedRoute>
                  <MyFilesPage />
                </ProtectedRoute>
              }
            />
            <Route path="/system-overview" element={<SystemOverviewPage />} />
            <Route
              path="/audit"
              element={
                <ProtectedRoute requireAdmin>
                  <AuditPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <footer className="text-center text-white/80 py-8 mt-12">
            <p className="text-sm">© 2025 Universal Archive Management System</p>
            <p className="text-xs mt-1 text-white/60">
              Secure • Traceable • Retention Controlled
            </p>
          </footer>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
