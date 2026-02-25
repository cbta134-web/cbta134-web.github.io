import React from 'react';
import BackButton from './BackButton';

const Noticias = ({ onBack }) => {
    const containerStyle = {
        minHeight: '100vh',
        paddingTop: '80px',
        padding: '80px 20px 40px',
        backgroundColor: '#f8f9fa'
    };

    const cardStyle = {
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '20px',
        maxWidth: '100%',
        width: '100%',
        margin: '0 auto',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
    };

    const titleStyle = {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#28a745',
        textAlign: 'center',
        marginBottom: '30px'
    };

    const newsContainerStyle = {
        display: 'grid',
        gap: '20px',
        marginBottom: '30px'
    };

    const newsItemStyle = {
        backgroundColor: '#f8f9fa',
        borderRadius: '15px',
        padding: '20px',
        border: '2px solid #28a745',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    };

    const newsDateStyle = {
        color: '#7f8c8d',
        fontSize: '0.9rem',
        marginBottom: '10px'
    };

    const newsTitleStyle = {
        color: '#2c3e50',
        fontSize: '1.3rem',
        fontWeight: 'bold',
        marginBottom: '10px'
    };

    const newsContentStyle = {
        color: '#34495e',
        fontSize: '1rem',
        lineHeight: '1.6'
    };

    const placeholderStyle = {
        textAlign: 'center',
        padding: '40px',
        color: '#7f8c8d',
        fontSize: '1.1rem',
        fontStyle: 'italic'
    };

    // Noticias de ejemplo
    const newsItems = [
        {
            id: 1,
            date: '15 de enero de 2024',
            title: 'Inicio del Ciclo Escolar 2024-2025',
            content: 'Damos la bienvenida a todos los estudiantes al nuevo ciclo escolar. Las clases comenzarán oficialmente el lunes 22 de enero.'
        },
        {
            id: 2,
            date: '10 de enero de 2024',
            title: 'Proceso de Inscripciones Abierto',
            content: 'Ya están abiertas las inscripciones para el nuevo ciclo escolar en todas nuestras carreras técnicas. Acércate a la institución para más información.'
        },
        {
            id: 3,
            date: '5 de enero de 2024',
            title: 'Mantenimiento de Instalaciones',
            content: 'Durante las vacaciones de invierno se realizaron trabajos de mantenimiento y mejora en nuestras instalaciones para brindar un mejor ambiente de aprendizaje.'
        }
    ];

    return (
        <div className="noticias-container" style={containerStyle}>
            <div className="noticias-card" style={cardStyle}>
                <BackButton onClick={onBack} />
                
                <h1 style={titleStyle}>📰 Noticias CBTA 134</h1>
                
                {/* Información sobre las noticias de Facebook */}
                <div
                    style={{
                        backgroundColor: '#e9f7ef',
                        padding: '15px',
                        borderRadius: '10px',
                        marginBottom: '20px',
                        borderLeft: '4px solid #28a745',
                        color: '#155724'
                    }}
                >
                    <strong>📢 Mantente al día:</strong> Aquí puedes ver todas las publicaciones y noticias importantes de nuestra escuela directamente desde nuestra página oficial de Facebook.
                </div>

                {/* Contenedor del iframe de Facebook */}
                <div
                    className="facebook-container"
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '20px',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        padding: '10px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <iframe
                        src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fmicbta134&tabs=timeline&width=500&height=700&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                        style={{
                            border: 'none',
                            borderRadius: '8px',
                            width: '100%',
                            maxWidth: '600px',
                            height: '70vh',
                            minHeight: '500px',
                            maxHeight: '800px',
                            margin: '0 auto',
                            display: 'block'
                        }}
                        scrolling="no"
                        frameBorder="0"
                        allowFullScreen={true}
                        title="Noticias CBTA 134 Facebook"
                        onError={(e) => {
                            console.log('Error cargando Facebook iframe');
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'block';
                        }}
                    />

                    {/* Fallback en caso de error */}
                    <div
                        style={{
                            display: 'none',
                            padding: '40px',
                            textAlign: 'center',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            border: '2px dashed #28a745',
                            width: '100%',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}
                    >
                        <h3 style={{ color: '#28a745', marginBottom: '15px' }}>📱 Síguenos en Facebook</h3>
                        <p style={{ color: '#666', marginBottom: '20px' }}>
                            Visita nuestra página oficial para ver las últimas noticias y actualizaciones.
                        </p>
                        <a
                            href="https://www.facebook.com/micbta134"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-block',
                                padding: '12px 24px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            🔗 Visitar Página de Facebook
                        </a>
                    </div>
                </div>

                {/* Nota sobre actualización automática */}
                <div
                    style={{
                        textAlign: 'center',
                        marginBottom: '20px',
                        color: '#666',
                        fontSize: '0.9rem',
                        fontStyle: 'italic'
                    }}
                >
                    Las publicaciones se actualizan automáticamente desde nuestra página oficial de Facebook.
                </div>

                {/* Contenedor verde de redes sociales */}
                <div
                    style={{
                        backgroundColor: '#28a745',
                        borderRadius: '15px',
                        padding: '20px',
                        textAlign: 'center',
                        color: 'white'
                    }}
                >
                    <h3 style={{ margin: '0 0 10px 0' }}>📢 Síguenos en Redes Sociales</h3>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>
                        No te pierdas ninguna novedad, evento o actividad del CBTA 134. ¡Únete a nuestra comunidad!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Noticias;
