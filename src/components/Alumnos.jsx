import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './Alumnos.css';

const Alumnos = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [regForm, setRegForm] = useState({ nombre: '', apellidos: '', curp: '', grado: '', grupo: '', numero_control: '', carrera_id: '' });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);
    const [allowedDomain, setAllowedDomain] = useState('');

    // Estados para Carreras
    const [careers, setCareers] = useState([]);


    // Estados para Dashboard
    const [grades, setGrades] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(null);

    useEffect(() => {
        checkUser();
        fetchCareers();
        fetchAccessConfig();
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session) {
                const isAllowed = await checkEmailDomain(session.user.email);
                if (isAllowed) {
                    setUser(session.user);
                    fetchProfile(session.user.id);
                    setAccessDenied(false);
                } else {
                    setAccessDenied(true);
                    setUser(session.user);
                }
            } else {
                setUser(null);
                setProfile(null);
                setAccessDenied(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchAccessConfig = async () => {
        const { data } = await supabase.from('access_config').select('*').eq('config_key', 'alumno_domain').single();
        if (data) {
            setAllowedDomain(data.config_value);
        }
    };

    const checkEmailDomain = async (email) => {
        if (!email) return false;
        const { data } = await supabase.from('access_config').select('config_value').eq('config_key', 'alumno_domain').single();
        if (!data || !data.config_value) return true; // Si no hay config, permitir todo
        const domain = data.config_value.toLowerCase();
        return email.toLowerCase().endsWith(domain);
    };


    const fetchCareers = async () => {
        const { data } = await supabase.from('carreras_tecnicas').select('*').order('nombre', { ascending: true });
        setCareers(data || []);
    };


    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const isAllowed = await checkEmailDomain(session.user.email);
            if (isAllowed) {
                setUser(session.user);
                await fetchProfile(session.user.id, session.user.email);
                setAccessDenied(false);
            } else {
                setAccessDenied(true);
                setUser(session.user);
            }
        }
        setLoading(false);
    };

    const fetchProfile = async (id, email) => {
        let { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();

        // Si no existe el perfil o el rol es nulo, lo inicializamos como alumno
        if (!data || !data.rol) {
            const { data: newProfile, error: createError } = await supabase.from('profiles').upsert({
                id: id,
                rol: 'alumno',
                email: email || null
            }).select().maybeSingle();

            if (createError) console.error("Error creando perfil:", createError);
            data = newProfile;
        }

        if (data && !data.email && email) {
            await supabase.from('profiles').update({ email }).eq('id', id);
            data = { ...data, email };
        }
        setProfile(data);
        if (data && data.rol === 'alumno') {
            setSelectedSemester(data.grado || 1);
            fetchDashboardData(id, data.grado || 1);
        }
    };

    const fetchDashboardData = async (studentId, semestre) => {
        // Fetch Calificaciones
        const { data: gradesData } = await supabase
            .from('calificaciones')
            .select('*')
            .eq('alumno_id', studentId)
            .eq('semestre', semestre);
        setGrades(gradesData || []);

        // Fetch Avisos Globales
        const { data: adsData } = await supabase
            .from('publicaciones_globales')
            .select('*')
            .order('created_at', { ascending: false });
        setAnnouncements(adsData || []);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (regForm.numero_control.length !== 14) {
            alert('El número de control debe tener exactamente 14 dígitos.');
            return;
        }

        const { error } = await supabase.from('profiles').update({
            nombre: regForm.nombre,
            apellidos: regForm.apellidos,
            curp: regForm.curp,
            numero_control: regForm.numero_control,
            grado: parseInt(regForm.grado),
            grupo: regForm.grupo.toUpperCase(),
            carrera_id: regForm.carrera_id ? parseInt(regForm.carrera_id) : null,
            updated_at: new Date().toISOString()
        }).eq('id', user.id);


        if (!error) {
            checkUser();
            setIsEditing(false);
        } else {
            console.error(error);
            alert('Error al guardar datos. Verifica tu conexión.');
        }
    };

    const startEditing = () => {
        setIsEditing(true);
        setRegForm({
            nombre: profile.nombre || '',
            apellidos: profile.apellidos || '',
            curp: profile.curp || '',
            numero_control: profile.numero_control || '',
            grado: profile.grado || '',
            grupo: profile.grupo || '',
            carrera_id: profile.carrera_id || ''
        });

    };


    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/alumnos'
            }
        });

        if (error) {
            console.error("Error en login:", error.message);
            alert("No se pudo iniciar sesión: " + error.message);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className="alumnos-container">
            <div className="alumnos-header">
                <button className="back-button-alumnos" onClick={() => navigate('/')}>
                    <span className="back-icon">←</span> Volver al Inicio
                </button>
                <h1 className="alumnos-title">Portal Estudiantil</h1>
            </div>

            <div className="alumnos-content">
                <div className="login-card-premium">
                    <div className="login-visual-new" style={{
                        backgroundImage: 'url("/images/alumnos-hero.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        flex: '1',
                        minHeight: '300px',
                        position: 'relative'
                    }}>
                        <div className="overlay-green" style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to bottom, rgba(46, 204, 113, 0.2), rgba(39, 174, 96, 0.4))'
                        }}></div>
                    </div>

                    <div className="login-details">
                        {accessDenied ? (
                            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                <div style={{ fontSize: '60px', marginBottom: '20px' }}>🚫</div>
                                <h2 style={{ color: '#e74c3c', marginBottom: '15px' }}>Acceso Denegado</h2>
                                <p style={{ color: '#666', marginBottom: '10px' }}>
                                    Solo se permiten cuentas con el dominio:
                                </p>
                                <p style={{ 
                                    fontWeight: 'bold', 
                                    color: '#2ecc71', 
                                    fontSize: '18px',
                                    background: '#f0fff4',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    display: 'inline-block',
                                    marginBottom: '15px'
                                }}>
                                    {allowedDomain || '@cbta134.edu.mx'}
                                </p>
                                <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
                                    Tu correo: <strong>{user?.email}</strong>
                                </p>
                                <button 
                                    onClick={handleLogout}
                                    style={{
                                        background: '#e74c3c',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 30px',
                                        borderRadius: '25px',
                                        cursor: 'pointer',
                                        fontSize: '16px'
                                    }}
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        ) : user ? (
                            !profile?.curp || isEditing ? (
                                <div className="registration-form">
                                    <h2>{isEditing ? 'Actualizar Datos' : 'Completa tu Perfil'}</h2>
                                    <p>Asegúrate de que tus datos sean correctos.</p>
                                    <form onSubmit={handleRegister}>
                                        <input
                                            type="text"
                                            placeholder="Nombre(s)"
                                            value={regForm.nombre}
                                            onChange={(e) => setRegForm({ ...regForm, nombre: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Apellidos Completos"
                                            value={regForm.apellidos}
                                            onChange={(e) => setRegForm({ ...regForm, apellidos: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="No. Control (14 dígitos)"
                                            value={regForm.numero_control}
                                            maxLength={14}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                setRegForm({ ...regForm, numero_control: val });
                                            }}
                                            required
                                            title="Debes ingresar exactamente 14 números"
                                        />
                                        <input
                                            type="text"
                                            placeholder="CURP (18 caracteres)"
                                            maxLength="18"
                                            value={regForm.curp}
                                            onChange={(e) => setRegForm({ ...regForm, curp: e.target.value.toUpperCase() })}
                                            required
                                        />
                                        <div className="form-row">
                                            <select value={regForm.grado} onChange={(e) => setRegForm({ ...regForm, grado: e.target.value })} required>
                                                <option value="">Grado</option>
                                                <option value="1">1° Semestre</option>
                                                <option value="2">2° Semestre</option>
                                                <option value="3">3° Semestre</option>
                                                <option value="4">4° Semestre</option>
                                                <option value="5">5° Semestre</option>
                                                <option value="6">6° Semestre</option>
                                            </select>
                                            <select
                                                value={regForm.grupo}
                                                onChange={(e) => setRegForm({ ...regForm, grupo: e.target.value })}
                                                required
                                            >
                                                <option value="">Grupo</option>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>
                                                <option value="D">D</option>
                                                <option value="E">E</option>
                                                <option value="F">F</option>
                                                <option value="G">G</option>
                                            </select>
                                        </div>
                                        <div className="form-row" style={{ marginTop: '10px' }}>
                                            <select
                                                value={regForm.carrera_id || ''}
                                                onChange={(e) => setRegForm({ ...regForm, carrera_id: e.target.value })}
                                                required
                                                style={{ width: '100%' }}
                                            >
                                                <option value="">Selecciona tu Carrera Técnica</option>
                                                {careers.map(c => (
                                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button type="submit" className="google-login-btn">Guardar Datos</button>
                                            {isEditing && (
                                                <button type="button" className="google-login-btn cancel-btn" onClick={() => setIsEditing(false)} style={{ background: '#f1f1f1', border: '1px solid #ccc' }}>
                                                    Cancelar
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <>
                                    <h2>¡Hola, {profile.nombre}!</h2>
                                    <div className="profile-info-mini">
                                        <p><strong>Correo:</strong> {user?.email || profile?.email || 'No disponible'}</p>
                                        <p><strong>Matrícula/CURP:</strong> {profile.curp}</p>
                                        <p><strong>Grado y Grupo:</strong> {profile.grado}°{profile.grupo}</p>
                                        <p><strong>Carrera:</strong> {careers.find(c => c.id === profile.carrera_id)?.nombre || 'Sin Asignar'}</p>

                                        <button
                                            onClick={startEditing}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#27ae60',
                                                textDecoration: 'underline',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                marginTop: '5px',
                                                padding: 0
                                            }}
                                        >
                                            Editar mis datos
                                        </button>
                                    </div>
                                    <p>Ya puedes consultar tu información académica. El administrador subirá tus calificaciones pronto.</p>

                                    <div className="student-dashboard">
                                        <section className="dashboard-section">
                                            <h3>📢 Tablero de Avisos</h3>
                                            {announcements.length === 0 ? (
                                                <p style={{ fontStyle: 'italic', color: '#999' }}>No hay avisos recientes.</p>
                                            ) : (
                                                <div className="announcements-list">
                                                    {announcements.map(ann => (
                                                        <div key={ann.id} className="announcement-card">
                                                            <h4>{ann.titulo}</h4>
                                                            <p>{ann.contenido}</p>
                                                            {ann.media_url && (
                                                                <div className="announcement-media" style={{ marginTop: '1rem' }}>
                                                                    {ann.media_type === 'video' ? (
                                                                        <video src={ann.media_url} controls style={{ width: '100%', borderRadius: '8px' }} />
                                                                    ) : (
                                                                        <img src={ann.media_url} alt="Aviso" style={{ width: '100%', borderRadius: '8px' }} />
                                                                    )}
                                                                </div>
                                                            )}
                                                            <small>{new Date(ann.created_at).toLocaleDateString()}</small>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </section>

                                        <section className="dashboard-section">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                <h3>📊 Boleta de Calificaciones</h3>
                                                <select
                                                    value={selectedSemester}
                                                    onChange={(e) => {
                                                        const sem = parseInt(e.target.value);
                                                        setSelectedSemester(sem);
                                                        fetchDashboardData(user.id, sem);
                                                    }}
                                                    className="semester-selector"
                                                    style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
                                                >
                                                    {[1, 2, 3, 4, 5, 6].map(s => <option key={s} value={s}>{s}° Semestre</option>)}
                                                </select>
                                            </div>

                                            {grades.length === 0 ? (
                                                <p style={{ textAlign: 'center', padding: '2rem', background: '#f8f9fa', borderRadius: '8px' }}>
                                                    No hay calificaciones registradas para este semestre.
                                                </p>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                                    {/* Sección Básica */}
                                                    <div>
                                                        <h4 style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'inline-block' }}>
                                                            📘 Formación Básica
                                                        </h4>
                                                        <div style={{ overflowX: 'auto' }}>
                                                            <table className="student-grades-table">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Materia</th>
                                                                        <th style={{ textAlign: 'center' }}>P1</th>
                                                                        <th style={{ textAlign: 'center' }}>P2</th>
                                                                        <th style={{ textAlign: 'center' }}>P3</th>
                                                                        <th style={{ textAlign: 'center' }}>Promedio</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {grades.filter(g => g.tipo_materia !== 'especialidad').map(grade => (
                                                                        <tr key={grade.id}>
                                                                            <td>{grade.materia}</td>
                                                                            <td style={{ textAlign: 'center' }}>{grade.parcial1 || '-'}</td>
                                                                            <td style={{ textAlign: 'center' }}>{grade.parcial2 || '-'}</td>
                                                                            <td style={{ textAlign: 'center' }}>{grade.parcial3 || '-'}</td>
                                                                            <td style={{ textAlign: 'center' }}>
                                                                                {grade.promedio_final ? (
                                                                                    <span className={`grade-badge ${grade.promedio_final >= 9 ? 'excellent' : grade.promedio_final >= 7 ? 'good' : 'bad'}`}>
                                                                                        {grade.promedio_final}
                                                                                    </span>
                                                                                ) : '-'}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                    {grades.filter(g => g.tipo_materia !== 'especialidad').length === 0 && (
                                                                        <tr><td colSpan="5" style={{ textAlign: 'center', color: '#999' }}>No hay materias básicas registradas.</td></tr>
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>

                                                    {/* Sección Especialidad */}
                                                    <div>
                                                        <h4 style={{ color: '#8e44ad', borderBottom: '2px solid #9b59b6', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'inline-block' }}>
                                                            🧪 Formación Profesional
                                                        </h4>
                                                        {grades.filter(g => g.tipo_materia === 'especialidad').length > 0 ? (
                                                            <div style={{ overflowX: 'auto' }}>
                                                                <table className="student-grades-table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Materia</th>
                                                                            <th style={{ textAlign: 'center' }}>P1</th>
                                                                            <th style={{ textAlign: 'center' }}>P2</th>
                                                                            <th style={{ textAlign: 'center' }}>P3</th>
                                                                            <th style={{ textAlign: 'center' }}>Promedio</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {grades.filter(g => g.tipo_materia === 'especialidad').map(grade => (
                                                                            <tr key={grade.id}>
                                                                                <td>
                                                                                    {grade.materia}
                                                                                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#8e44ad' }}>Especialidad</span>
                                                                                </td>
                                                                                <td style={{ textAlign: 'center' }}>{grade.parcial1 || '-'}</td>
                                                                                <td style={{ textAlign: 'center' }}>{grade.parcial2 || '-'}</td>
                                                                                <td style={{ textAlign: 'center' }}>{grade.parcial3 || '-'}</td>
                                                                                <td style={{ textAlign: 'center' }}>
                                                                                    {grade.promedio_final ? (
                                                                                        <span className={`grade-badge ${grade.promedio_final >= 9 ? 'excellent' : grade.promedio_final >= 7 ? 'good' : 'bad'}`}>
                                                                                            {grade.promedio_final}
                                                                                        </span>
                                                                                    ) : '-'}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        ) : (
                                                            <div style={{ padding: '1rem', background: '#fdf2fa', border: '1px dashed #e5b0ea', borderRadius: '8px', color: '#8e44ad' }}>
                                                                No tienes materias de especialidad registradas en este semestre.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </section>
                                    </div>

                                    <div className="auth-methods" style={{ marginTop: '2rem' }}>
                                        <button className="google-login-btn logout-btn" onClick={handleLogout}>
                                            <span>Cerrar Sesión</span>
                                        </button>
                                    </div>
                                </>
                            )
                        ) : (

                            <>
                                <h2>¡Bienvenido, Alumno!</h2>
                                <p>Accede a tus calificaciones, horarios y recursos académicos de manera segura.</p>

                                <div className="auth-methods">
                                    <button className="google-login-btn" onClick={handleGoogleLogin}>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" />
                                        <span>Iniciar sesión con Google</span>
                                    </button>
                                </div>
                            </>
                        )}

                        <div className="login-footer">
                            <p>¿Tienes problemas para entrar? <a href="#contacto">Contacta a soporte</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Alumnos;
