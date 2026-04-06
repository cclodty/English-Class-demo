import { HashRouter, Routes, Route } from "react-router-dom";
import { QuestionProvider } from "./context/QuestionContext";
import { SessionProvider } from "./context/SessionContext";
import HomePage from "./pages/HomePage";
import StudentPage from "./pages/StudentPage";
import ResultsPage from "./pages/ResultsPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <QuestionProvider>
      <SessionProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<StudentPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </HashRouter>
      </SessionProvider>
    </QuestionProvider>
  );
}
