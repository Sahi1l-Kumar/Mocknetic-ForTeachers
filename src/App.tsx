import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Classroom from "./pages/Classroom";
import CreateAssessment from "./pages/CreateAssessment";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/classes/:classId" element={<Classroom />} />
      <Route
        path="/classes/:classId/assessments/new"
        element={<CreateAssessment />}
      />
    </Routes>
  );
}
