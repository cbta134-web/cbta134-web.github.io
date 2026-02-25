import React from 'react';
import BackButton from '../../components/BackButton';

const useIsDark = () => {
  if (typeof document === 'undefined') return false;
  return document.body.classList.contains('dark-mode');
};

const Agropecuario = ({ setCurrentView }) => {
  const isDark = useIsDark();

  const pageStyle = {
    paddingTop: '80px',
    minHeight: '100vh',
    backgroundColor: isDark ? 'transparent' : '#f8f9fa'
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '100%',
    margin: '0 auto'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '30px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #28a745, #20c997)',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 8px 25px rgba(40, 167, 69, 0.3)'
  };

  const sectionStyle = {
    background: isDark ? 'rgba(255,255,255,0.03)' : 'white',
    borderRadius: '15px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: isDark ? '0 12px 35px rgba(0,0,0,0.6)' : '0 8px 25px rgba(0,0,0,0.1)',
    border: isDark ? '1px solid rgba(255,255,255,0.05)' : 'none'
  };

  const sectionTitleStyle = {
    fontSize: '22px',
    fontWeight: 'bold',
    color: isDark ? '#4ade80' : '#28a745',
    marginBottom: '20px',
    borderBottom: '3px solid #28a745',
    paddingBottom: '10px'
  };

  const textStyle = {
    fontSize: '16px',
    lineHeight: '1.7',
    color: isDark ? '#e2e8f0' : '#4a5568',
    marginBottom: '15px'
  };

  const listStyle = {
    fontSize: '16px',
    color: isDark ? '#e2e8f0' : '#4a5568',
    lineHeight: '1.7',
    paddingLeft: '20px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    background: isDark ? 'rgba(255,255,255,0.02)' : '#f8f9fa',
    borderRadius: '10px',
    overflow: 'hidden'
  };

  const thStyle = {
    background: 'linear-gradient(135deg, #28a745, #20c997)',
    color: 'white',
    padding: '15px',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '14px'
  };

  const tdStyle = {
    padding: '15px',
    borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e9ecef',
    color: isDark ? '#e2e8f0' : '#4a5568',
    fontSize: '14px',
    lineHeight: '1.6'
  };

  const highlightBoxStyle = {
    background: 'linear-gradient(135deg, rgba(40,167,69,0.1), rgba(32,201,151,0.1))',
    borderLeft: '4px solid #28a745',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '20px'
  };

  const competencyCardStyle = {
    background: isDark ? 'rgba(255,255,255,0.02)' : '#f8f9fa',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '15px',
    borderLeft: '4px solid #28a745'
  };

  return (
    <div style={pageStyle}>
      <BackButton onBack={() => setCurrentView('programas')} />
      <div style={containerStyle}>
        <h1 style={titleStyle}>🌱 TÉCNICO AGROPECUARIO - NUEVA VERSIÓN ACTUALIZADA 2024</h1>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🌱 ¿Por qué estudiar Técnico Agropecuario?</h2>
          <p style={textStyle}>
            El sector agropecuario es la columna vertebral de la economía mundial y México no es la excepción. Con más del 70% de nuestro territorio 
            dedicado a actividades agropecuarias, existe una demanda constante de profesionales capacitados que puedan revolucionar este sector tan importante.
          </p>
          <p style={textStyle}>
            Como Técnico Agropecuario del CBTA 134, no solo aprenderás técnicas tradicionales de cultivo y crianza, sino que dominarás tecnologías modernas 
            como agricultura de precisión, sistemas de riego inteligente, biotecnología aplicada y modelos de negocio sustentables que están transformando 
            el campo mexicano.
          </p>
          <p style={textStyle}>
            Esta carrera te convierte en un profesional integral capaz de producir alimentos de calidad, cuidar el medio ambiente y generar riqueza 
            económica para las comunidades rurales. Desde pequeños productores familiares hasta grandes empresas agroindustriales, todos necesitan 
            de tu expertise técnico y visión innovadora.
          </p>
          
          <div style={highlightBoxStyle}>
            <h3 style={{...sectionTitleStyle, fontSize: '18px', marginBottom: '15px', borderBottom: 'none'}}>
              🌍 Impacto Real en el Mundo
            </h3>
            <ul style={listStyle}>
              <li><strong>Seguridad Alimentaria:</strong> Produces los alimentos que consume la población mexicana</li>
              <li><strong>Cuidado Ambiental:</strong> Implementas prácticas sustentables que protegen nuestros recursos naturales</li>
              <li><strong>Desarrollo Rural:</strong> Generas empleos y oportunidades en comunidades rurales</li>
              <li><strong>Innovación Tecnológica:</strong> Aplicas las últimas tecnologías en agricultura y ganadería</li>
              <li><strong>Exportación:</strong> Contribuyes a que México sea potencia mundial en productos agropecuarios</li>
            </ul>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🚜 Tu Día a Día como Técnico Agropecuario</h2>
          <p style={textStyle}>
            Imagínate despertando cada mañana sabiendo que tu trabajo alimenta a miles de familias. Como Técnico Agropecuario, tu día puede incluir 
            desde revisar cultivos con drones equipados con cámaras multiespectrales, hasta diseñar sistemas de alimentación para ganado que maximicen 
            la producción y minimicen el impacto ambiental.
          </p>
          <p style={textStyle}>
            Podrías estar supervisando invernaderos automatizados donde produces tomates hidropónicos libres de pesticidas, o tal vez coordinando 
            la cosecha de aguacates destinados al mercado internacional. Algunos días trabajarás en laboratorio analizando la calidad nutricional 
            de forrajes, otros estarás en campo implementando sistemas de riego por goteo que ahorran hasta 40% de agua.
          </p>
          <p style={textStyle}>
            Lo más emocionante es que cada proyecto es diferente: desde ayudar a un pequeño productor a duplicar sus ganancias con técnicas orgánicas, 
            hasta liderar equipos en granjas comerciales que abastecen cadenas de supermercados. Tu trabajo tiene propósito, variedad y un impacto 
            directo en la alimentación de México.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>📋 Justificación Académica de la Carrera</h2>
          <p style={textStyle}>
            El currículum laboral tiene como objetivo desarrollar competencias laborales básicas y extendidas, integrando conocimientos, habilidades,
            actitudes y valores con responsabilidad y autonomía para desenvolverse en contextos personales, académicos, sociales y profesionales.
          </p>
          <p style={textStyle}>
            Esta carrera proporciona preparación especializada en: producción de cultivos para la alimentación e industria, manejo de especies pecuarias,
            procesamiento e inocuidad de productos agropecuarios y desarrollo de modelos de negocios. Facilita la incorporación al mundo laboral,
            emprendimiento o continuación de estudios superiores en Ingeniería Agronómica, Zootecnia o Biotecnología.
          </p>
          <p style={textStyle}>
            Nuestro programa está diseñado bajo estándares internacionales de calidad educativa, con certificaciones oficiales que te permitirán 
            trabajar no solo en México, sino también en otros países de América Latina donde existe gran demanda de técnicos agropecuarios especializados.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🎯 Perfil de Egreso</h2>
          <p style={textStyle}>
            El egresado podrá realizar actividades de producción agrícola y pecuaria, agricultura protegida, producción de insumos orgánicos,
            procesamiento de productos, comprobación de inocuidad, y diseño de planes de negocio agropecuario.
          </p>
          
          <div style={competencyCardStyle}>
            <h3 style={{...sectionTitleStyle, fontSize: '18px', marginBottom: '15px'}}>💼 Competencias Laborales</h3>
            <ul style={listStyle}>
              <li>Produce cultivos para la alimentación e industria.</li>
              <li>Maneja especies pecuarias para la producción.</li>
              <li>Procesa productos agropecuarios.</li>
              <li>Verifica la inocuidad de productos agropecuarios.</li>
              <li>Desarrolla modelos de negocio de productos agropecuarios.</li>
            </ul>
          </div>

          <div style={competencyCardStyle}>
            <h3 style={{...sectionTitleStyle, fontSize: '18px', marginBottom: '15px'}}>🚀 Habilidades para la Vida y el Trabajo (HVyT)</h3>
            <ul style={listStyle}>
              <li><strong>Empoderamiento:</strong> Autoconocimiento, comunicación, regulación emocional.</li>
              <li><strong>Empleabilidad:</strong> Autonomía, toma de decisiones, logro de metas.</li>
              <li><strong>Aprendizaje:</strong> Creatividad, mentalidad de crecimiento, resolución de problemas.</li>
              <li><strong>Ciudadanía:</strong> Trabajo en equipo, empatía, conciencia social.</li>
            </ul>
          </div>

          <div style={competencyCardStyle}>
            <h3 style={{...sectionTitleStyle, fontSize: '18px', marginBottom: '15px'}}>🌍 Conceptos de Educación para el Desarrollo Sostenible (CoCEDS)</h3>
            <ul style={listStyle}>
              <li>Nexo Agua – Energía – Alimentación</li>
              <li>Servicios ecosistémicos</li>
              <li>Sistemas socioecológicos</li>
              <li>Economía ecológica</li>
            </ul>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>📚 Mapa de Competencias Laborales</h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Módulo</th>
                <th style={thStyle}>Competencia Laboral</th>
                <th style={thStyle}>Submódulos</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}><strong>Módulo I</strong></td>
                <td style={tdStyle}>Produce cultivos para la alimentación e industria</td>
                <td style={tdStyle}>
                  1. Cultivos agrícolas a cielo abierto<br />
                  2. Agricultura protegida<br />
                  3. Insumos orgánicos para la agricultura
                </td>
              </tr>
              <tr>
                <td style={tdStyle}><strong>Módulo II</strong></td>
                <td style={tdStyle}>Maneja especies pecuarias para la producción</td>
                <td style={tdStyle}>
                  1. Especies monogástricas<br />
                  2. Especies poligástricas<br />
                  3. Aves y especies alternas
                </td>
              </tr>
              <tr>
                <td style={tdStyle}><strong>Módulo III</strong></td>
                <td style={tdStyle}>Procesa productos agropecuarios</td>
                <td style={tdStyle}>
                  1. Productos hortofrutícolas<br />
                  2. Productos lácteos<br />
                  3. Productos cárnicos
                </td>
              </tr>
              <tr>
                <td style={tdStyle}><strong>Módulo IV</strong></td>
                <td style={tdStyle}>Verifica la inocuidad de productos agropecuarios</td>
                <td style={tdStyle}>
                  1. Productos agrícolas<br />
                  2. Productos pecuarios<br />
                  3. Productos agroindustriales
                </td>
              </tr>
              <tr>
                <td style={tdStyle}><strong>Módulo V</strong></td>
                <td style={tdStyle}>Desarrolla modelo de negocios de productos agropecuarios</td>
                <td style={tdStyle}>
                  1. Plan de negocios<br />
                  2. Plan de comercialización
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>✨ Cambios Principales del Programa 2024</h2>
          <ul style={listStyle}>
            <li>
              <strong>Competencias laborales básicas:</strong> Funciones simples en contextos conocidos (nivel 2), con certificación oficial.
            </li>
            <li>
              <strong>Competencias laborales extendidas:</strong> Funciones de mayor complejidad técnica (nivel 3), acreditadas con título.
            </li>
            <li>
              Formación en escenarios reales: integración de saberes, trabajo interdisciplinario, y actividades clave observables y evaluables.
            </li>
            <li>
              Integración del Currículum Fundamental, Ampliado, HVyT y CoCEDS mediante transversalidad curricular.
            </li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🧠 Formación Socioemocional</h2>
          <div style={highlightBoxStyle}>
            <p style={textStyle}>
              <strong>Formación integral por semestre:</strong>
            </p>
            <ul style={listStyle}>
              <li>1º - Formación Socioemocional I</li>
              <li>2º - Formación Socioemocional II</li>
              <li>3º - Formación Socioemocional III</li>
              <li>4º - Formación Socioemocional IV</li>
              <li>5º - Formación Socioemocional V</li>
              <li>6º - Formación Socioemocional VI</li>
            </ul>
          </div>
        </section>

        <section style={{
          ...sectionStyle,
          background: 'linear-gradient(135deg, #28a745, #20c997)',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{...sectionTitleStyle, color: 'white', borderColor: 'white'}}>🌟 Oportunidades Profesionales</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            <div>
              <h4 style={{fontSize: '18px', marginBottom: '10px'}}>🚀 Emprendimiento</h4>
              <p style={{fontSize: '14px', opacity: '0.9'}}>Crear tu propio negocio agropecuario</p>
            </div>
            <div>
              <h4 style={{fontSize: '18px', marginBottom: '10px'}}>🏢 Sector Empresarial</h4>
              <p style={{fontSize: '14px', opacity: '0.9'}}>Trabajo en empresas del sector</p>
            </div>
            <div>
              <h4 style={{fontSize: '18px', marginBottom: '10px'}}>🎓 Educación Superior</h4>
              <p style={{fontSize: '14px', opacity: '0.9'}}>Continuar estudios universitarios</p>
            </div>
            <div>
              <h4 style={{fontSize: '18px', marginBottom: '10px'}}>🌱 Sustentabilidad</h4>
              <p style={{fontSize: '14px', opacity: '0.9'}}>Especialización en agricultura sostenible</p>
            </div>
          </div>
        </section>

        {/* Sección del Plan de Estudios PDF */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>📚 Plan de Estudios Oficial</h2>
          <div style={highlightBoxStyle}>
            <p style={textStyle}>
              Consulta el programa de estudios completo y oficial de la carrera Técnico Agropecuario.
            </p>
            
            <div style={{
              background: isDark ? '#1e2a3d' : 'white',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: isDark ? '0 8px 25px rgba(0,0,0,0.6)' : '0 8px 25px rgba(0,0,0,0.1)',
              marginTop: '20px'
            }}>
              <iframe
                src="/programa de estudios/PROGRAMA_DE_ESTUDIOS_AGROPECUARIO.pdf"
                style={{
                  width: '100%',
                  height: '600px',
                  border: 'none',
                  borderRadius: '10px'
                }}
                title="Plan de Estudios - Técnico Agropecuario"
              />
              
              <div style={{textAlign: 'center', marginTop: '15px'}}>
                <a 
                  href="/programa de estudios/PROGRAMA_DE_ESTUDIOS_AGROPECUARIO.pdf"
                  download="Plan_Estudios_Agropecuario.pdf"
                  style={{
                    display: 'inline-block',
                    backgroundColor: isDark ? '#28a745' : '#1e3c72',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '16px',
                    transition: 'background-color 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}
                >
                  📥 Descargar Plan de Estudios
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Agropecuario;