import { BrowserRouter, Routes, Route } from "react-router-dom";

import Interview from "./pages/Interview";
import Result from "./pages/Result";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import { QuickStartCard } from "./components/home/QuickStartCard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/roleselect" element={<RoleSelect />} /> */}
        <Route path="/interview/:role" element={<Interview />} />
        <Route path="/result" element={<Result />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/interview" element={<Interview />} />
       
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
