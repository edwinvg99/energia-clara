import { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContextDef';
import jsPDF from 'jspdf';
import { modulosEducativos } from '../data/modulosData';
import logoTdea from '../assets/logo-tdea.png';

function ModuloEducativo() {
  const { moduloId } = useParams();
  const modulo = modulosEducativos.find(m => m.id === moduloId);
  
  const [mostrarExamen, setMostrarExamen] = useState(false);
  const [respuestas, setRespuestas] = useState({});
  const [resultados, setResultados] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  if (!modulo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center ">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Módulo no encontrado</h2>
          <button 
            onClick={() => navigate('/educativo')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver a módulos
          </button>
        </div>
      </div>
    );
  }

  const handleRespuesta = (preguntaIndex, opcion) => {
    setRespuestas({ ...respuestas, [preguntaIndex]: opcion });
  };

  const evaluarExamen = () => {
    let correctas = 0;
    modulo.examen.forEach((pregunta, index) => {
      if (respuestas[index] === pregunta.correcta) {
        correctas++;
      }
    });
    setResultados({ correctas, total: modulo.examen.length });
  };

  const generarCertificado = () => {
    // Formato horizontal (landscape)
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Fondo degradado simulado con rectángulos
    doc.setFillColor(250, 251, 252); // Fondo principal gris muy claro
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Borde decorativo doble
    doc.setDrawColor(16, 185, 129); // Verde emerald
    doc.setLineWidth(2);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
    
    doc.setDrawColor(203, 213, 225); // Gris claro
    doc.setLineWidth(0.5);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Barra superior decorativa
    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, pageWidth, 25, 'F');
    
    // Barra inferior decorativa
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');

    // Cargar y agregar logo
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = logoTdea;
    
    img.onload = function() {
      try {
        // Logo en la esquina superior izquierda (sobre la barra verde)
        // Ajustamos proporción para que no se vea estirado
        doc.addImage(img, 'PNG', 15, 7, 35, 12);
      } catch (error) {
        console.warn('Error al cargar logo:', error);
      }
      
      // Titulo "CERTIFICADO" (sin tildes para evitar caracteres raros)
      doc.setFontSize(38);
      doc.setTextColor(16, 185, 129);
      doc.setFont('helvetica', 'bold');
      doc.text('CERTIFICADO DE FINALIZACION', pageWidth / 2, 45, { align: 'center' });
      
      // Linea decorativa debajo del titulo
      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(1);
      doc.line(60, 50, pageWidth - 60, 50);
      
      // Ornamentos decorativos
      doc.setFillColor(16, 185, 129);
      doc.circle(55, 50, 2, 'F');
      doc.circle(pageWidth - 55, 50, 2, 'F');

      // Texto "Se certifica que"
      doc.setFontSize(14);
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'normal');
      doc.text('Se certifica que', pageWidth / 2, 65, { align: 'center' });

      // Nombre del estudiante con fondo
      doc.setFillColor(240, 253, 244); // Verde muy claro
      doc.roundedRect(pageWidth / 2 - 70, 70, 140, 15, 3, 3, 'F');
      
      doc.setFontSize(26);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      const nombreCompleto = `${user.nombre} ${user.apellido}`.toUpperCase();
      doc.text(nombreCompleto, pageWidth / 2, 80, { align: 'center' });

      // Texto descriptivo (sin tildes)
      doc.setFontSize(13);
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'normal');
      doc.text('ha completado satisfactoriamente el modulo educativo', pageWidth / 2, 95, { align: 'center' });

      // Nombre del modulo con destaque
      doc.setFontSize(20);
      doc.setTextColor(16, 185, 129);
      doc.setFont('helvetica', 'bold');
      
      // Dividir texto largo en multiples lineas si es necesario
      const tituloModulo = modulo.titulo.toUpperCase();
      const maxWidth = pageWidth - 80;
      const lines = doc.splitTextToSize(tituloModulo, maxWidth);
      
      if (lines.length === 1) {
        doc.text(lines[0], pageWidth / 2, 108, { align: 'center' });
      } else {
        doc.text(lines[0], pageWidth / 2, 105, { align: 'center' });
        doc.text(lines[1], pageWidth / 2, 112, { align: 'center' });
      }

      // Calificacion con badge
      const yCalificacion = lines.length === 1 ? 118 : 125;
      doc.setFillColor(219, 234, 254); // Azul claro
      doc.roundedRect(pageWidth / 2 - 45, yCalificacion, 90, 10, 2, 2, 'F');
      
      doc.setFontSize(11);
      doc.setTextColor(30, 64, 175);
      doc.setFont('helvetica', 'bold');
      const porcentaje = Math.round((resultados.correctas / resultados.total) * 100);
      doc.text(`Calificacion: ${resultados.correctas}/${resultados.total} (${porcentaje}%)`, 
                pageWidth / 2, yCalificacion + 6.5, { align: 'center' });

      // Fecha y codigo de verificacion
      const fecha = new Date().toLocaleDateString('es-CO', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const codigoVerificacion = `EC-${Date.now().toString(36).toUpperCase()}-${user.nombre.substring(0, 2).toUpperCase()}`;
      
      const yFecha = lines.length === 1 ? 140 : 147;
      
      // Fecha
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.text(`Fecha de emision: ${fecha}`, pageWidth / 2 - 60, yFecha, { align: 'left' });
      
      // Codigo de verificacion
      doc.text(`Codigo: ${codigoVerificacion}`, pageWidth / 2 + 10, yFecha, { align: 'left' });

      // Firma digital (decorativa)
      const yFirma = lines.length === 1 ? 155 : 162;
      doc.setLineWidth(0.5);
      doc.setDrawColor(100, 116, 139);
      doc.line(pageWidth / 2 - 40, yFirma, pageWidth / 2 + 40, yFirma);
      
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'bold');
      doc.text('Plataforma Energia Clara', pageWidth / 2, yFirma + 5, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.text('Tecnologico de Antioquia', pageWidth / 2, yFirma + 10, { align: 'center' });

      // Footer en barra oscura
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('Plataforma Educativa de Energias Renovables | www.tdea.edu.co', pageWidth / 2, pageHeight - 8, { align: 'center' });
      doc.text('Este certificado verifica la completacion del modulo educativo en la plataforma Energia Clara', pageWidth / 2, pageHeight - 4, { align: 'center' });

      // Descargar
      doc.save(`Certificado_${modulo.id}_${user.nombre}_${user.apellido}.pdf`);
    };

    img.onerror = function() {
      // Si falla la carga de imagen, generar sin logo
      console.warn('No se pudo cargar el logo, generando certificado sin imagen');
      
      // Genera el certificado sin logo, con texto alternativo
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('TDEA', 25, 15);
      
      // Continua con el mismo contenido que el onload
      doc.setFontSize(38);
      doc.setTextColor(16, 185, 129);
      doc.setFont('helvetica', 'bold');
      doc.text('CERTIFICADO DE FINALIZACION', pageWidth / 2, 45, { align: 'center' });
      
      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(1);
      doc.line(60, 50, pageWidth - 60, 50);
      
      doc.setFillColor(16, 185, 129);
      doc.circle(55, 50, 2, 'F');
      doc.circle(pageWidth - 55, 50, 2, 'F');

      doc.setFontSize(14);
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'normal');
      doc.text('Se certifica que', pageWidth / 2, 65, { align: 'center' });

      doc.setFillColor(240, 253, 244);
      doc.roundedRect(pageWidth / 2 - 70, 70, 140, 15, 3, 3, 'F');
      
      doc.setFontSize(26);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      const nombreCompleto = `${user.nombre} ${user.apellido}`.toUpperCase();
      doc.text(nombreCompleto, pageWidth / 2, 80, { align: 'center' });

      doc.setFontSize(13);
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'normal');
      doc.text('ha completado satisfactoriamente el modulo educativo', pageWidth / 2, 95, { align: 'center' });

      doc.setFontSize(20);
      doc.setTextColor(16, 185, 129);
      doc.setFont('helvetica', 'bold');
      
      const tituloModulo = modulo.titulo.toUpperCase();
      const maxWidth = pageWidth - 80;
      const lines = doc.splitTextToSize(tituloModulo, maxWidth);
      
      if (lines.length === 1) {
        doc.text(lines[0], pageWidth / 2, 108, { align: 'center' });
      } else {
        doc.text(lines[0], pageWidth / 2, 105, { align: 'center' });
        doc.text(lines[1], pageWidth / 2, 112, { align: 'center' });
      }

      const yCalificacion = lines.length === 1 ? 118 : 125;
      doc.setFillColor(219, 234, 254);
      doc.roundedRect(pageWidth / 2 - 45, yCalificacion, 90, 10, 2, 2, 'F');
      
      doc.setFontSize(11);
      doc.setTextColor(30, 64, 175);
      doc.setFont('helvetica', 'bold');
      const porcentaje = Math.round((resultados.correctas / resultados.total) * 100);
      doc.text(`Calificacion: ${resultados.correctas}/${resultados.total} (${porcentaje}%)`, 
                pageWidth / 2, yCalificacion + 6.5, { align: 'center' });

      const fecha = new Date().toLocaleDateString('es-CO', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const codigoVerificacion = `EC-${Date.now().toString(36).toUpperCase()}-${user.nombre.substring(0, 2).toUpperCase()}`;
      
      const yFecha = lines.length === 1 ? 140 : 147;
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.text(`Fecha de emision: ${fecha}`, pageWidth / 2 - 60, yFecha, { align: 'left' });
      doc.text(`Codigo: ${codigoVerificacion}`, pageWidth / 2 + 10, yFecha, { align: 'left' });

      const yFirma = lines.length === 1 ? 155 : 162;
      doc.setLineWidth(0.5);
      doc.setDrawColor(100, 116, 139);
      doc.line(pageWidth / 2 - 40, yFirma, pageWidth / 2 + 40, yFirma);
      
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'bold');
      doc.text('Plataforma Energia Clara', pageWidth / 2, yFirma + 5, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.text('Tecnologico de Antioquia', pageWidth / 2, yFirma + 10, { align: 'center' });

      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('Plataforma Educativa de Energias Renovables | www.tdea.edu.co', pageWidth / 2, pageHeight - 8, { align: 'center' });
      doc.text('Este certificado verifica la completacion del modulo educativo en la plataforma Energia Clara', pageWidth / 2, pageHeight - 4, { align: 'center' });

      doc.save(`Certificado_${modulo.id}_${user.nombre}_${user.apellido}.pdf`);
    };
  };

  if (!mostrarExamen) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-emerald-50 py-12 px-4 ">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <button
            onClick={() => navigate('/educativo')}
            className="mb-6 flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <span>←</span> Volver a módulos
          </button>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Banner del módulo */}
            <div className={`${modulo.color} p-8 text-white`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{modulo.icono}</span>
                <h1 className="text-3xl font-bold">{modulo.titulo}</h1>
              </div>
              <p className="text-lg opacity-90">{modulo.descripcion}</p>
            </div>

            {/* Contenido educativo */}
            <div className="p-8">
              {modulo.contenido.map((seccion, index) => (
                <div key={index} className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {seccion.titulo}
                  </h2>
                  <div className="prose max-w-none">
                    {seccion.parrafos.map((parrafo, idx) => (
                      <p key={idx} className="text-gray-700 mb-4 leading-relaxed">
                        {parrafo}
                      </p>
                    ))}
                  </div>
                  
                  {seccion.puntos && (
                    <ul className="mt-4 space-y-2">
                      {seccion.puntos.map((punto, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-emerald-500 mt-1">✓</span>
                          <span className="text-gray-700">{punto}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {/* Recursos adicionales */}
              {modulo.recursos && (
                <div className="mt-8 bg-emerald-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    📚 Recursos Adicionales
                  </h3>
                  <div className="space-y-3">
                    {modulo.recursos.map((recurso, index) => (
                      <a
                        key={index}
                        href={recurso.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                      >
                        <span className="text-2xl">{recurso.icono}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{recurso.nombre}</p>
                          <p className="text-sm text-gray-600">{recurso.tipo}</p>
                        </div>
                        <span className="text-emerald-600">→</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Descripción de autoevaluación */}
              <div className="mt-8 bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  📝 Autoevaluación
                </h3>
                <p className="text-gray-700 mb-4">
                  Para completar este módulo, deberás responder un cuestionario de 5 preguntas. 
                  Necesitas al menos 3 respuestas correctas para aprobar y obtener tu certificado.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Total de preguntas: 5</li>
                  <li>✓ Respuestas correctas necesarias: 3</li>
                  <li>✓ Certificado descargable en PDF</li>
                </ul>
              </div>

              {/* Botón para iniciar examen */}
              <button
                onClick={() => setMostrarExamen(true)}
                className="mt-8 w-full bg-linear-to-r from-emerald-600 to-emerald-500 text-white font-semibold py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Iniciar Autoevaluación
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista del examen
  if (!resultados) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Autoevaluación: {modulo.titulo}
              </h2>
              <p className="text-gray-600">
                Responde las siguientes preguntas. Necesitas 3 correctas para aprobar.
              </p>
            </div>

            <div className="space-y-6">
              {modulo.examen.map((pregunta, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <p className="font-semibold text-gray-900 mb-4">
                    {index + 1}. {pregunta.pregunta}
                  </p>
                  <div className="space-y-3">
                    {pregunta.opciones.map((opcion, opIndex) => (
                      <label
                        key={opIndex}
                        className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                          respuestas[index] === opIndex
                            ? 'bg-emerald-100 border-2 border-emerald-500'
                            : 'bg-white border-2 border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`pregunta-${index}`}
                          checked={respuestas[index] === opIndex}
                          onChange={() => handleRespuesta(index, opIndex)}
                          className="w-4 h-4 text-emerald-600"
                        />
                        <span className="text-gray-700">{opcion}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={evaluarExamen}
              disabled={Object.keys(respuestas).length !== modulo.examen.length}
              className="mt-8 w-full bg-linear-to-r from-blue-600 to-blue-500 text-white font-semibold py-4 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar Respuestas
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vista de resultados
  const aprobado = resultados.correctas >= 3;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-emerald-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
            aprobado ? 'bg-emerald-100' : 'bg-red-100'
          }`}>
            <span className="text-5xl">
              {aprobado ? '🎉' : '📚'}
            </span>
          </div>

          <h2 className={`text-3xl font-bold mb-4 ${
            aprobado ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {aprobado ? '¡Felicitaciones!' : 'Sigue Practicando'}
          </h2>

          <p className="text-xl text-gray-700 mb-6">
            Obtuviste {resultados.correctas} de {resultados.total} respuestas correctas
          </p>

          {aprobado ? (
            <>
              <p className="text-gray-600 mb-8">
                Has aprobado el módulo exitosamente. Descarga tu certificado a continuación.
              </p>
              <button
                onClick={generarCertificado}
                className="w-full bg-linear-to-r from-emerald-600 to-emerald-500 text-white font-semibold py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 shadow-lg mb-4"
              >
                📄 Descargar Certificado
              </button>
            </>
          ) : (
            <p className="text-gray-600 mb-8">
              Necesitas al menos 3 respuestas correctas para aprobar. ¡Revisa el contenido e inténtalo de nuevo!
            </p>
          )}

          <button
            onClick={() => navigate('/educativo')}
            className="w-full bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-300 transition-all duration-200"
          >
            Volver a Módulos
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModuloEducativo;
