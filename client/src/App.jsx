import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from './context/UserContextDef';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';

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

function Educativo() {
  const { user } = useContext(UserContext);
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Bienvenido {user?.nombre}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-emerald-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-emerald-700 mb-2">📚 Formulario 1</h2>
          <p className="text-gray-700 mb-4">Contenido educativo sobre energías renovables</p>
          <button className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600">Ver</button>
        </div>
        <div className="bg-teal-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-teal-700 mb-2">📊 Formulario 2</h2>
          <p className="text-gray-700 mb-4">Análisis de datos energéticos</p>
          <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">Ver</button>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-blue-700 mb-2">💡 Formulario 3</h2>
          <p className="text-gray-700 mb-4">Casos de éxito en transición energética</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Ver</button>
        </div>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Bienvenido a Energía Clara TDEA</h1>
      <p className="text-gray-700">Información confiable sobre energías renovables</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/educativo" element={<ProtectedRoute><Educativo /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* otras rutas */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
