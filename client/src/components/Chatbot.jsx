import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, ChevronDown, Zap, Loader2, AlertTriangle } from 'lucide-react';
import API_URL from '../api';

// Preguntas predeterminadas con sus claves
const PREDEFINED_QUESTIONS = [
  { key: 'plataforma', label: '¿Qué es Energía Clara?' },
  { key: 'beneficios', label: '¿Beneficios de las renovables?' },
  { key: 'proceso', label: '¿Cómo implementar energía renovable?' },
  { key: 'normativas', label: '¿Qué normativas aplican?' },
  { key: 'actores', label: '¿Quiénes son los actores clave?' },
  { key: 'transicion', label: '¿Qué es la transición energética?' },
  { key: 'autogeneracion', label: '¿Cómo funciona la autogeneración?' },
  { key: 'comunidades', label: '¿Qué son las comunidades energéticas?' },
  { key: 'generacion-distribuida', label: '¿Qué es la generación distribuida?' },
  { key: 'certificados', label: '¿Cómo obtengo un certificado?' },
];

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuestions, setShowQuestions] = useState(true);
  const [remainingQueries, setRemainingQueries] = useState(null);
  const [aiAvailable, setAiAvailable] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll automático al último mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Focus en input cuando se abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Mensaje de bienvenida al abrir por primera vez
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'bot',
        content: '¡Hola! Soy el asistente virtual de **Energía Clara**. Puedo ayudarte con preguntas sobre energías renovables en Colombia.\n\nSelecciona una pregunta predeterminada o escribe tu propia consulta.',
        timestamp: new Date(),
      }]);
    }
  }, [isOpen]);

  // Verificar estado del chatbot al montar
  useEffect(() => {
    fetch(`${API_URL}/api/chatbot/status`)
      .then(res => res.json())
      .then(data => {
        setAiAvailable(data.active);
        if (data.limits) {
          setRemainingQueries(data.limits.remaining);
        }
      })
      .catch(() => setAiAvailable(false));
  }, []);

  const formatMessage = (text) => {
    // Convertir markdown básico a HTML
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>')
      .replace(/• /g, '&bull; ');
  };

  const sendMessage = async (message, predefinedKey = null) => {
    if (isLoading) return;
    if (!predefinedKey && (!message || message.trim().length === 0)) return;

    const userMessage = predefinedKey
      ? PREDEFINED_QUESTIONS.find(q => q.key === predefinedKey)?.label || message
      : message.trim();

    // Agregar mensaje del usuario
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    }]);

    setInputValue('');
    setIsLoading(true);
    setShowQuestions(false);

    try {
      const body = predefinedKey
        ? { predefinedKey }
        : { message: message.trim() };

      const response = await fetch(`${API_URL}/api/chatbot/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessages(prev => [...prev, {
          role: 'bot',
          content: data.error || 'Ocurrió un error. Intenta de nuevo.',
          timestamp: new Date(),
          isError: true,
          fallbackToPredefined: data.fallbackToPredefined,
        }]);

        if (data.fallbackToPredefined) {
          setShowQuestions(true);
        }
      } else {
        setMessages(prev => [...prev, {
          role: 'bot',
          content: data.response,
          timestamp: new Date(),
          source: data.source,
        }]);

        if (data.remainingQueries !== null && data.remainingQueries !== undefined) {
          setRemainingQueries(data.remainingQueries);
        }
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: 'No se pudo conectar con el asistente. Verifica tu conexión a internet.',
        timestamp: new Date(),
        isError: true,
        fallbackToPredefined: true,
      }]);
      setShowQuestions(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handlePredefinedClick = (key) => {
    sendMessage(null, key);
  };

  const toggleQuestions = () => {
    setShowQuestions(prev => !prev);
  };

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-4 shadow-2xl shadow-emerald-500/30 transition-all duration-300 hover:scale-110 hover:-translate-y-1 group"
          aria-label="Abrir asistente virtual"
        >
          <MessageCircle className="h-6 w-6" />
          {/* Indicador de pulso */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full" />
        </button>
      )}

      {/* Ventana del chat */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[400px] h-full sm:h-[600px] sm:max-h-[80vh] flex flex-col bg-white sm:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">

          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 rounded-lg p-1.5">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Asistente Energía Clara</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-emerald-400 text-xs">En línea</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition"
              aria-label="Cerrar chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Indicador de consultas restantes */}
          {remainingQueries !== null && remainingQueries <= 10 && (
            <div className={`px-4 py-1.5 text-xs flex items-center gap-1.5 shrink-0 ${
              remainingQueries <= 5 ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
            }`}>
              <AlertTriangle className="h-3 w-3" />
              <span>
                {remainingQueries === 0
                  ? 'Límite diario alcanzado. Usa las preguntas predeterminadas.'
                  : `${remainingQueries} consultas libres restantes hoy`}
              </span>
            </div>
          )}

          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'bot' && (
                  <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${
                    msg.isError ? 'bg-red-100' : 'bg-emerald-100'
                  }`}>
                    <Bot className={`h-4 w-4 ${msg.isError ? 'text-red-600' : 'text-emerald-600'}`} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-500 text-white rounded-br-md'
                      : msg.isError
                        ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-md'
                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                  }`}
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                />
                {msg.role === 'user' && (
                  <div className="shrink-0 w-7 h-7 bg-slate-700 rounded-full flex items-center justify-center mt-0.5">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Indicador de carga */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="shrink-0 w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                  <Bot className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-emerald-500 animate-spin" />
                    <span className="text-sm text-gray-500">Pensando...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Preguntas predeterminadas */}
          <div className="shrink-0 border-t border-gray-200 bg-white">
            <button
              onClick={toggleQuestions}
              className="w-full px-4 py-2 flex items-center justify-between text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition"
            >
              <span>Preguntas sugeridas</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${showQuestions ? 'rotate-180' : ''}`} />
            </button>

            {showQuestions && (
              <div className="px-3 pb-3 max-h-36 overflow-y-auto">
                <div className="flex flex-wrap gap-1.5">
                  {PREDEFINED_QUESTIONS.map((q) => (
                    <button
                      key={q.key}
                      onClick={() => handlePredefinedClick(q.key)}
                      disabled={isLoading}
                      className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2.5 py-1.5 rounded-full border border-emerald-200 transition disabled:opacity-50 disabled:cursor-not-allowed text-left"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="shrink-0 border-t border-gray-200 bg-white px-3 py-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={aiAvailable ? 'Escribe tu pregunta...' : 'IA no disponible, usa las sugeridas'}
                disabled={isLoading || (!aiAvailable && inputValue.length === 0)}
                maxLength={500}
                className="flex-1 bg-gray-100 text-gray-800 rounded-full px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white border border-transparent focus:border-emerald-300 transition disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isLoading || inputValue.trim().length === 0}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white rounded-full p-2.5 transition-all duration-200 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/30"
                aria-label="Enviar mensaje"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            {inputValue.length > 400 && (
              <p className="text-xs text-amber-600 mt-1 ml-4">
                {500 - inputValue.length} caracteres restantes
              </p>
            )}
          </form>
        </div>
      )}
    </>
  );
}

export default Chatbot;
