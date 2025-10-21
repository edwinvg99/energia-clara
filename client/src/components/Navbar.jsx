import React, { useState, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContextDef';

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(UserContext);

  const handleLogout = () => {
    logoutUser();
    setShowDropdown(false);
    navigate('/login');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="bg-linear-to-r from-slate-900 to-slate-800 flex items-center justify-between px-6 py-4 shadow-lg">
      <div className="flex items-center">
        <Link to="/" className="flex items-center hover:opacity-80 transition">
          <span className="bg-emerald-500 rounded-full h-10 w-10 flex items-center justify-center text-white mr-3 font-bold">
            💡
          </span>
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg">Energía Clara TDEA</span>
            <span className="text-emerald-400 text-xs">Información confiable sobre renovables</span>
          </div>
        </Link>
      </div>

      <div className="flex space-x-8 text-gray-300 items-center">
        <Link to="/" className="hover:text-emerald-400 transition">Inicio</Link>
        <Link to="/beneficios" className="hover:text-emerald-400 transition">Beneficios</Link>
        <Link to="/proceso" className="hover:text-emerald-400 transition">Proceso</Link>
        <Link to="/actores" className="hover:text-emerald-400 transition">Actores</Link>
        <Link to="/normativas" className="hover:text-emerald-400 transition">Normativas</Link>
        <Link to="/educativo" className="hover:text-emerald-400 transition">Educativo</Link>

        {user && (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 bg-emerald-500/90 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-emerald-500/50"
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-base">👤</span>
              </div>
              <span className="font-medium">{user.nombre}</span>
              <svg 
                className={`w-4 h-4 transform transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-100 animate-fadeIn">
                {/* Header del dropdown */}
                <div className="px-5 py-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-b border-emerald-100">
                  <div className="flex items-center space-x-3 mb-2">
          
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{user.nombre} {user.apellido}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 mt-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-emerald-700 font-medium">Sesión activa</span>
                  </div>
                </div>

                <div className="py-2">

                  <div className="border-t border-gray-100 my-2"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-3 group"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Cerrar sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
