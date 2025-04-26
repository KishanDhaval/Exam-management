// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./src/Components/Auth/ProtectedRoute";
import Login from "./src/pages/Login";
import Register from "./src/pages/Register";
import StudentDashboard from "./src/pages/StudentDashboard";
import TeacherDashboard from "./src/pages/TeacherDashboard";
import { useAuthContext } from "./src/hooks/useAuthContext";

function App() {
  const { user } = useAuthContext();
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            !user ? (
              <Login />
            ) : user.role === "student" ? (
              <Navigate to={"/dashboard/student"} />
            ) : (
              <Navigate to={"/dashboard/teacher"} />
            )
          }
        />
        <Route
          path="/register"
          element={
            !user ? (
              <Register />
            ) : user.role === "student" ? (
              <Navigate to={"/dashboard/student"} />
            ) : (
              <Navigate to={"/dashboard/teacher"} />
            )
          }
        />

        {/* only students */}
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* only teachers */}
        <Route
          path="/dashboard/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        {/* catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
