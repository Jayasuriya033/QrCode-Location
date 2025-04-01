import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import Login from './Components/Login'
import Dashboard from './Components/Dashboard'
import Signup from "./Components/Signup"
import { AuthContext, AuthProvider } from "./Helpers/AuthContext"
import React, { JSX, useContext } from "react";
const ProtectedRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const auth = useContext(AuthContext);
  return auth?.isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  const isAuthenticated = !!localStorage.getItem("token")

  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route path="/dashboard/*" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
    </AuthProvider>
  )
}

export default App
