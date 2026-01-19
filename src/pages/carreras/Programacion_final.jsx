import React from 'react';
import BackButton from '../../components/BackButton';

const useIsDark = () => {
if (typeof document === 'undefined') return false;
return document.body.classList.contains('dark-mode');
};

const Programacion = ({ setCurrentView }) => {
const isDark = useIsDark();

return (
<div style={{
paddingTop: '80px',
minHeight: '100vh',
backgroundColor: isDark ? 'transparent' : '#f8f9fa'
}}>
<BackButton onBack={() => setCurrentView('programas')} />
<div style={{
padding: '20px',
maxWidth: '100%',
margin: '0 auto'
}}>
<h1 style={{
fontSize: '28px',
fontWeight: 'bold',
color: 'white',
marginBottom: '30px',
textAlign: 'center',
background: 'linear-gradient(135deg, #28a745, #218838)',
padding: '25px',
borderRadius: '15px',
boxShadow: '0 8px 25px rgba(40, 167, 69, 0.3)'
}}>
💻 Técnico en Programación </h1>

```
    <section style={{
      background: isDark ? 'rgba(255,255,255,0.03)' : 'white',
      borderRadius: '15px',
      padding: '30px',
      marginBottom: '30px',
      boxShadow: isDark ? '0 12px 35px rgba(0,0,0,0.6)' : '0 8px 25px rgba(0,0,0,0.1)',
      border: isDark ? '1px solid rgba(255,255,255,0.05)' : 'none'
    }}>
      <h2 style={{
        fontSize: '22px',
        fontWeight: 'bold',
        color: isDark ? '#9ae6b4' : '#28a745',
        marginBottom: '20px',
        borderBottom: '3px solid #28a745',
        paddingBottom: '10px'
      }}>
        🎯 ¿Por qué estudiar Programación en el CBTA 134?
      </h2>
      <p style={{
        fontSize: '16px',
        lineHeight: '1.7',
        color: isDark ? '#e2e8f0' : '#4a5568',
        marginBottom: '15px'
      }}>
        En la era digital actual, la programación se ha convertido en una de las habilidades más demandadas y mejor remuneradas del mercado laboral. 
        Nuestro programa de Técnico en Programación te prepara para ser parte de la revolución tecnológica, desarrollando software que transforma 
        industrias completas.
      </p>
      <p style={{
        fontSize: '16px',
        lineHeight: '1.7',
        color: isDark ? '#e2e8f0' : '#4a5568',
        marginBottom: '15px'
      }}>
        Desde aplicaciones móviles utilizadas por millones de personas hasta sistemas web que administran empresas multinacionales, los programadores 
        son los arquitectos del futuro digital. En el CBTA 134 no solo aprendes a programar, sino que desarrollas el pensamiento lógico 
        y la creatividad necesarios para resolver problemas complejos del mundo real.
      </p>
      
      <div style={{
        background: 'linear-gradient(135deg, rgba(40,167,69,0.1), rgba(33,136,56,0.1))',
        borderLeft: '4px solid #28a745',
        padding: '20px',
        borderRadius: '10px',
        marginTop: '20px'
      }}>
        <h3 style={{
          fontSize: '18px',
          marginBottom: '15px',
          color: isDark ? '#9ae6b4' : '#28a745'
        }}>
          💡 ¿Sabías que...?
        </h3>
        <ul style={{
          fontSize: '16px',
          color: isDark ? '#e2e8f0' : '#4a5568',
          lineHeight: '1.7',
          paddingLeft: '20px'
        }}>
          <li>Los programadores tienen una de las tasas de empleo más altas del mercado laboral.</li>
          <li>Es posible trabajar de forma remota desde cualquier parte del mundo.</li>
          <li>El sector tecnológico ofrece los mejores salarios para jóvenes profesionales.</li>
          <li>Puedes crear tu propia empresa tecnológica y ser tu propio jefe.</li>
        </ul>
      </div>
    </section>

    {/* Sección de aprendizaje */}
    <section style={{
      background: isDark ? 'rgba(255,255,255,0.03)' : 'white',
      borderRadius: '15px',
      padding: '30px',
      marginBottom: '30px',
      boxShadow: isDark ? '0 12px 35px rgba(0,0,0,0.6)' : '0 8px 25px rgba(0,0,0,0.1)',
      border: isDark ? '1px solid rgba(255,255,255,0.05)' : 'none'
    }}>
      <h2 style={{
        fontSize: '22px',
        fontWeight: 'bold',
        color: isDark ? '#9ae6b4' : '#28a745',
        marginBottom: '20px',
        borderBottom: '3px solid #28a745',
        paddingBottom: '10px'
      }}>
        💼 Lo que Aprenderás
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {[
          { icon: '⚙️', title: 'Desarrollo de Software', text: 'Diseñas, codificas e implementas software que controla sistemas completos, desde aplicaciones de escritorio hasta sistemas especializados.' },
          { icon: '🌐', title: 'Desarrollo Web', text: 'Construyes aplicaciones web responsivas usando tecnologías modernas, creando experiencias de usuario excepcionales.' },
          { icon: '📱', title: 'Aplicaciones Móviles', text: 'Desarrollas apps para iOS y Android usando frameworks multiplataforma, llegando a millones de usuarios.' },
          { icon: '🗄️', title: 'Bases de Datos', text: 'Dominas bases de datos relacionales y no relacionales, manejando grandes volúmenes de información con eficiencia.' }
        ].map((item, i) => (
          <div key={i} style={{
            background: isDark ? 'rgba(255,255,255,0.02)' : '#f8f9fa',
            borderRadius: '10px',
            padding: '20px',
            borderLeft: '4px solid #28a745'
          }}>
            <h4 style={{
              color: isDark ? '#9ae6b4' : '#28a745',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #28a745, #218838)',
                borderRadius: '8px',
                padding: '8px',
                color: 'white',
                display: 'inline-block',
                marginRight: '10px',
                fontSize: '16px'
              }}>{item.icon}</span>
              {item.title}
            </h4>
            <p style={{
              fontSize: '14px',
              color: isDark ? '#e2e8f0' : '#4a5568'
            }}>{item.text}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Futuro del programador */}
    <section style={{
      background: 'linear-gradient(135deg, #28a745, #218838)',
      color: 'white',
      textAlign: 'center',
      borderRadius: '15px',
      padding: '40px 30px',
      marginBottom: '30px'
    }}>
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>
        🚀 Tu Futuro como Programador
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        <div><h4>🏢 Empresas Tech</h4><p>Google, Microsoft, Meta, Amazon</p></div>
        <div><h4>🌐 Trabajo Remoto</h4><p>Colabora con clientes internacionales</p></div>
        <div><h4>🚀 Tu Startup</h4><p>Crea tu propia aplicación o empresa</p></div>
        <div><h4>💰 Excelentes Salarios</h4><p>$15,000 - $50,000+ mensuales</p></div>
      </div>
    </section>

    {/* Plan de estudios */}
    <section style={{
      background: isDark ? 'rgba(255,255,255,0.03)' : 'white',
      borderRadius: '15px',
      padding: '30px',
      marginBottom: '30px',
      boxShadow: isDark ? '0 12px 35px rgba(0,0,0,0.6)' : '0 8px 25px rgba(0,0,0,0.1)',
      border: isDark ? '1px solid rgba(255,255,255,0.05)' : 'none',
      textAlign: 'center'
    }}>
      <h3 style={{
        fontSize: '22px',
        color: isDark ? '#9ae6b4' : '#28a745',
        marginBottom: '20px'
      }}>
        📚 Plan de Estudios
      </h3>
      <p style={{
        fontSize: '16px',
        color: isDark ? '#e2e8f0' : '#4a5568',
        marginBottom: '20px'
      }}>
        Nuestro plan de estudios está diseñado para llevarte de principiante a programador profesional en tres años, 
        combinando teoría sólida con práctica intensiva y proyectos reales.
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {[
          { n: '1️⃣', t: 'Fundamentos', d: 'Lógica de programación y algoritmos básicos.' },
          { n: '2️⃣', t: 'Desarrollo Web', d: 'Frontend y backend con proyectos reales.' },
          { n: '3️⃣', t: 'Especialización', d: 'Aplicaciones móviles y bases de datos avanzadas.' }
        ].map((s, i) => (
          <div key={i} style={{
            padding: '20px',
            background: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fa',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '30px', marginBottom: '10px' }}>{s.n}</div>
            <h4 style={{ marginBottom: '10px', color: isDark ? '#e6eef8' : '#2c3e50' }}>{s.t}</h4>
            <p style={{ color: isDark ? '#c8cdd3' : '#666', fontSize: '14px' }}>{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
</div>


);
};

export default Programacion;
