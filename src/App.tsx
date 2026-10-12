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
import PublicRoute from "./components/feature/route/PublicRoute";
import PrivateRoute from "./components/feature/route/PrivateRoute";
import FlashCardPage from "./pages/home/flashcard/FlashCardPage";
import FlashcardList from "./pages/home/flashcard/details/FlashcardList";
import { BreadcrumbProvider } from "./context/BreadcrumbContext";
import PracticeMenu from "./pages/home/practices/PracticeMenu";
import Settings from "./pages/home/settings/Settings";
import LevelTest from "./pages/home/level-test/LevelTest";

function App() {
  return (
    <Router>
      <BreadcrumbProvider>
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
                <Route path="/flashcard" element={<FlashCardPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/level-test" element={<LevelTest />} />

                <Route
                  path="/flashcard/learn/:setId"
                  element={<FlashcardList />}
                />
              </Route>
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" />} />
            {/* <Route path="*" element={<Navigate to="/not-found" />} /> */}
          </Routes>
        </AuthProvider>
      </BreadcrumbProvider>
    </Router>
  );
}

export default App;