import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ClassroomDetail from "./pages/ClassroomDetail";
import CreateAssessment from "./pages/CreateAssessment";
import Profile from "./pages/Profile";
import AssessmentResults from "./pages/AssessmentResults";
import StudentResultDetail from "./pages/StudentResultDetail";
import ClassroomResults from "./pages/ClassroomResults";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classroom/:id"
          element={
            <ProtectedRoute>
              <ClassroomDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classroom/:id/results"
          element={
            <ProtectedRoute>
              <ClassroomResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classroom/:id/create-assessment"
          element={
            <ProtectedRoute>
              <CreateAssessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessment/:assessmentId/results"
          element={
            <ProtectedRoute>
              <AssessmentResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessment/:assessmentId/result/:resultId"
          element={
            <ProtectedRoute>
              <StudentResultDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
