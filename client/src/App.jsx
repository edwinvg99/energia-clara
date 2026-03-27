import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from './context/UserContextDef';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Beneficios from './components/Beneficios';
import Procesos from './components/Procesos';
import Actores from './components/Actores';
import Normativas from './components/Normativas';
import Educativo from './components/Educativo';
import ModuloEducativo from './components/ModuloEducativo';
import Chatbot from './components/Chatbot';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Noticias from './components/Noticias';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext);
  
  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/educativo" element={<ProtectedRoute><Educativo /></ProtectedRoute>} />
        <Route path="/educativo/:moduloId" element={
          <ProtectedRoute>
            <ModuloEducativo />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/beneficios" element={<Beneficios />} />
        <Route path="/procesos" element={<Procesos />} />
        <Route path="/actores" element={<Actores />} />
        <Route path="/normativas" element={<Normativas />} />
        <Route path="/noticias" element={<Noticias />} />
        {/* otras rutas */}
      </Routes>
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;
