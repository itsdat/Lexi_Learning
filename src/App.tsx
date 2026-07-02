import Generator from "./components/feature/Generator";
import { AuthProvider } from "./context/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/layout/sidebar/Sidebar";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/home/dashboard/Dashboard";
import PracticeMenu from "./pages/home/practices/PracticeMenu";
import PublicRoute from "./components/feature/route/PublicRoute";
import PrivateRoute from "./components/feature/route/PrivateRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Trang không có sidebar */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Các trang có sidebar (layout route) */}
          <Route element={<PrivateRoute />}>
            <Route element={<Sidebar />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/generator" element={<Generator />} />
              <Route path="/practice" element={<PracticeMenu />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
