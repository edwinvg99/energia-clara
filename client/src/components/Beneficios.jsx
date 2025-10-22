import React from 'react'

function Beneficios()  {
  return (
    <div>
        <section id="beneficios" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 text-center">
              {/* Etiqueta superior */}
              <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full font-medium mb-4">
                Beneficios Reales
              </div>

              {/* Título principal */}
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Beneficios Económicos y Ambientales
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-12">
                Información clara y verificada sobre las ventajas de implementar energías renovables en comunidades residenciales
              </p>

              {/* Primera fila de beneficios */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Reducción de costos */}
                <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
                  <div className="flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-lg mb-4 mx-auto">
                    <span className="text-emerald-600 text-2xl font-bold">$</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Reducción de Costos</h3>
                  <p className="text-gray-600 mb-4">
                    Ahorra hasta 40% en facturas de energía con sistemas de paneles solares
                  </p>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-emerald-600 text-2xl font-bold mb-1">40%</p>
                    <p className="text-sm font-semibold text-gray-500">Ahorro promedio</p>
                  </div>
                </div>

                {/* Impacto Ambiental */}
                <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg mb-4 mx-auto">
                    <span className="text-green-600 text-2xl font-bold">🌿</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Impacto Ambiental</h3>
                  <p className="text-gray-600 mb-4">
                    Reduce la huella de carbono de tu comunidad y protege el medio ambiente
                  </p>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-green-600 text-2xl font-bold mb-1">25 ton</p>
                    <p className="text-sm font-semibold text-gray-500">CO₂ evitado/año</p>
                  </div>
                </div>

                {/* Independencia Energética */}
                <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-50 rounded-lg mb-4 mx-auto">
                    <span className="text-yellow-500 text-2xl font-bold">⚡</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Independencia Energética</h3>
                  <p className="text-gray-600 mb-4">
                    Genera tu propia energía y reduce la dependencia de la red eléctrica
                  </p>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-yellow-500 text-2xl font-bold mb-1">70%</p>
                    <p className="text-sm font-semibold text-gray-500">Autosuficiencia</p>
                  </div>
                </div>
              </div>

              {/* Segunda fila */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Bienestar Comunitario */}
                <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4 mx-auto">
                    <span className="text-blue-600 text-2xl font-bold">👥</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Bienestar Comunitario</h3>
                  <p className="text-gray-600 mb-4">
                    Mejora la calidad de vida y el valor de las propiedades
                  </p>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-blue-600 text-2xl font-bold mb-1">+15%</p>
                    <p className="text-sm font-semibold text-gray-500">Valorización</p>
                  </div>
                </div>

                {/* Retorno de Inversión */}
                <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-50 rounded-lg mb-4 mx-auto">
                    <span className="text-purple-500 text-2xl font-bold">📈</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Retorno de Inversión</h3>
                  <p className="text-gray-600 mb-4">
                    Recupera tu inversión en 5–7 años con incentivos gubernamentales
                  </p>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-purple-500 text-2xl font-bold mb-1">5–7</p>
                    <p className="text-sm font-semibold text-gray-500">Años ROI</p>
                  </div>
                </div>

                {/* Estabilidad Tarifaria */}
                <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-50 rounded-lg mb-4 mx-auto">
                    <span className="text-orange-500 text-2xl font-bold">🛡️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Estabilidad Tarifaria</h3>
                  <p className="text-gray-600 mb-4">
                    Protégete de aumentos en tarifas eléctricas con energía propia
                  </p>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-orange-500 text-2xl font-bold mb-1">20 años</p>
                    <p className="text-sm font-semibold text-gray-500">Garantía</p>
                  </div>
                </div>
              </div>

              {/* Información oficial */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl py-10 px-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Información Basada en Fuentes Oficiales
                </h3>
                <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
                  Toda la información presentada está respaldada por normativas gubernamentales, estudios técnicos y datos verificados de instituciones reconocidas en Colombia.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="bg-white border border-emerald-200 px-4 py-2 rounded-full text-gray-700 font-medium">
                    Ministerio de Energía
                  </span>
                  <span className="bg-white border border-emerald-200 px-4 py-2 rounded-full text-gray-700 font-medium">
                    UPME
                  </span>
                  <span className="bg-white border border-emerald-200 px-4 py-2 rounded-full text-gray-700 font-medium">
                    CREG
                  </span>
                  <span className="bg-white border border-emerald-200 px-4 py-2 rounded-full text-gray-700 font-medium">
                    Normativa Técnica
                  </span>
                </div>
              </div>
            </div>
          </section>
    </div>
  )
}

export default Beneficios;
