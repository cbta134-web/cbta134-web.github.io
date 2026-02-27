import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { generarFichaPDF } from '../utils/pdfGenerator';
import '../styles/PreRegistro.css';

// ─── OPTIONS / CATÁLOGOS DESPLEGABLES ──────────────────────

const ESTADOS_MEXICO = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas',
    'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Estado de México',
    'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit',
    'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí',
    'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas',
];

const OCUPACIONES = [
    'Ama de casa', 'Agricultor/a', 'Albañil', 'Artesano/a', 'Chofer', 'Comerciante',
    'Docente', 'Empleado/a', 'Empleado/a de gobierno', 'Enfermero/a', 'Ganadero/a',
    'Ingeniero/a', 'Mecánico/a', 'Médico/a', 'Militar', 'Obrero/a', 'Pensionado/a',
    'Profesionista', 'Servidor/a público', 'Trabajador/a independiente', 'Otro',
];

const GRADOS_ESTUDIO = [
    'Sin estudios', 'Primaria incompleta', 'Primaria completa',
    'Secundaria incompleta', 'Secundaria completa', 'Preparatoria/Bachillerato',
    'Técnico', 'Licenciatura', 'Posgrado',
];

const TIPOS_ESCUELA = ['Pública', 'Privada', 'Indígena', 'Comunitaria'];
const SEXOS = ['Masculino', 'Femenino', 'Otro'];
const ESTADOS_CIVIL = ['Soltero/a', 'Casado/a', 'Otro'];
const PARENTESCOS = ['Padre', 'Madre', 'Tutor/a', 'Otro'];

// ─── ESTADOS INICIALES ───────────────────────────────────────

const initialAspirante = {
    nombre: '', apellido_paterno: '', apellido_materno: '',
    curp: '', sexo: '', fecha_nacimiento: '', correo: '',
    estado_civil: '', telefono: '', lugar_nacimiento: '',
    domicilio: '', colonia: '', municipio: '', codigo_postal: '',
};

const initialCarrera = { carrera_nombre: '', segunda_opcion_carrera: '', tercera_opcion_carrera: '' };

const initialEscuela = {
    escuela_tipo: '', escuela_nombre: '', escuela_municipio: '', promedio_general: '',
};

const initialTutor = {
    tutor_nombre: '', tutor_ocupacion: '', tutor_curp: '',
    tutor_grado_estudios: '', tutor_telefono: '', tutor_parentesco: '',
};

// STEPS ahora vienen de formConfig.stepper_json (dinámico desde DB)

// ═════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═════════════════════════════════════════════════════════════

export default function PreRegistro({ setCurrentView }) {
    const [session, setSession] = useState(null);
    const [step, setStep] = useState(1);
    const [aspirante, setAspirante] = useState(initialAspirante);
    const [carrera, setCarrera] = useState(initialCarrera);
    const [escuela, setEscuela] = useState(initialEscuela);
    const [tutor, setTutor] = useState(initialTutor);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [folio, setFolio] = useState('');
    const [pdfBlob, setPdfBlob] = useState(null);
    const [carreras, setCarreras] = useState([]);
    const [existingReg, setExistingReg] = useState(null);
    const [formConfig, setFormConfig] = useState({
        form_badge: 'Nuevo Ingreso 2025–2026',
        form_titulo: 'Pre-Registro de Aspirantes',
        form_subtitulo: 'Completa tu pre-registro para obtener tu ficha de inscripción. Es rápido y seguro.',
        form_titulo_paso1: '👤 Datos del Aspirante',
        form_titulo_paso2: '🎓 Carrera Técnica',
        form_desc_paso2: 'Selecciona la carrera técnica de tu preferencia. Considera tus intereses y vocación.',
        form_titulo_paso3: '🏫 Escuela de Procedencia',
        form_desc_paso3: 'Proporciona los datos de la secundaria de la que egresaste o estás por egresar.',
        form_titulo_paso4: '👨‍👩‍👦 Datos del Tutor / Padre o Madre',
        form_desc_paso4: 'Proporciona los datos de la persona responsable del aspirante.',
        form_titulo_paso5: '✅ Confirmación de Datos',
        form_desc_paso5: 'Revisa que todos tus datos sean correctos antes de enviar.',
        exito_icono: '🎉',
        exito_titulo: '¡Pre-Registro Exitoso!',
        exito_mensaje: 'Tu pre-registro ha sido recibido. Guarda tu folio y descarga tu ficha.',
        exito_btn_pdf: '📄 Descargar Ficha PDF',
        exito_btn_inicio: 'Ir al Inicio',
        stepper_json: [
            { id: 1, label: 'Datos Personales', icon: '👤' },
            { id: 2, label: 'Carrera', icon: '🎓' },
            { id: 3, label: 'Escuela Origen', icon: '🏫' },
            { id: 4, label: 'Datos del Tutor', icon: '👨‍👩‍👦' },
            { id: 5, label: 'Confirmación', icon: '✅' },
        ],
    });
    const formRef = useRef(null);

    // Gestión de Sesión
    useEffect(() => {
        const handleSession = async (session) => {
            setSession(session);
            if (session?.user?.email) {
                setAspirante(prev => ({ ...prev, correo: session.user.email }));
                await checkExistingRegistration(session.user.email);
            }
        };

        supabase.auth.getSession().then(({ data: { session } }) => {
            handleSession(session).then(() => setLoading(false));
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            handleSession(session).then(() => setLoading(false));
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkExistingRegistration = async (email) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('preregistros')
                .select('*')
                .eq('correo', email)
                .maybeSingle();

            if (data) {
                setExistingReg(data);
                setFolio(data.folio);
                // Generar PDF para tenerlo listo
                const blob = await generarFichaPDF(data);
                setPdfBlob(blob);
            }
        } catch (err) {
            console.error("Error buscando registro previo:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/preregistro/formulario'
            }
        });
        if (error) alert("Error al iniciar sesión: " + error.message);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setExistingReg(null);
        setSubmitted(false);
        setStep(1);
    };

    // Cargar config del formulario desde Supabase
    useEffect(() => {
        const fetchFormConfig = async () => {
            const { data } = await supabase
                .from('preregistro_config')
                .select('form_badge, form_titulo, form_subtitulo, form_titulo_paso1, form_titulo_paso2, form_desc_paso2, form_titulo_paso3, form_desc_paso3, form_titulo_paso4, form_desc_paso4, form_titulo_paso5, form_desc_paso5, exito_icono, exito_titulo, exito_mensaje, exito_btn_pdf, exito_btn_inicio, stepper_json')
                .eq('id', 1)
                .single();
            if (data) {
                setFormConfig(prev => ({
                    ...prev,
                    ...Object.fromEntries(
                        Object.entries(data).filter(([_, v]) => v != null && v !== '')
                    ),
                    stepper_json: data.stepper_json || prev.stepper_json,
                }));
            }
        };
        fetchFormConfig();
    }, []);

    // Cargar carreras desde Supabase (tabla real: carreras_tecnicas)
    useEffect(() => {
        const fetchCarreras = async () => {
            try {
                const { data, error } = await supabase
                    .from('carreras_tecnicas')
                    .select('id, nombre, descripcion, imagen_url');
                if (data && data.length > 0) {
                    setCarreras(data.map(c => ({
                        ...c,
                        icono: getCarreraIcon(c.nombre),
                        descripcion_corta: c.descripcion ? c.descripcion.substring(0, 120) + (c.descripcion.length > 120 ? '...' : '') : '',
                    })));
                } else {
                    // Fallback hardcoded
                    setCarreras([
                        { id: 1, nombre: 'Técnico en Contabilidad', descripcion_corta: 'Finanzas, contabilidad y administración.', icono: '💼' },
                        { id: 2, nombre: 'Técnico en Ofimática', descripcion_corta: 'Herramientas digitales y productividad.', icono: '💻' },
                        { id: 3, nombre: 'Técnico en Programación', descripcion_corta: 'Desarrollo de software y apps.', icono: '⌨️' },
                        { id: 4, nombre: 'Técnico Agropecuario', descripcion_corta: 'Producción agrícola sustentable.', icono: '🌾' },
                        { id: 5, nombre: 'Técnico en Sistemas de Producción Pecuaria', descripcion_corta: 'Ganadería y producción animal.', icono: '🐄' },
                    ]);
                }
            } catch (err) {
                console.error('Error fetching carreras:', err);
            }
        };
        fetchCarreras();
    }, []);

    // ── helpers ──────────────────────────────────────────────
    const setField = (setter) => (e) =>
        setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const validateStep = () => {
        const errs = {};
        if (step === 1) {
            if (!aspirante.nombre.trim()) errs.nombre = 'Requerido';
            if (!aspirante.apellido_paterno.trim()) errs.apellido_paterno = 'Requerido';
            if (!aspirante.apellido_materno.trim()) errs.apellido_materno = 'Requerido';
            if (!aspirante.curp.trim()) errs.curp = 'Requerido';
            else if (!/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(aspirante.curp.toUpperCase()))
                errs.curp = 'CURP inválida';
            if (!aspirante.sexo) errs.sexo = 'Requerido';
            if (!aspirante.fecha_nacimiento) errs.fecha_nacimiento = 'Requerido';
            if (!aspirante.correo.trim()) errs.correo = 'Requerido';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(aspirante.correo))
                errs.correo = 'Correo inválido';
            if (!aspirante.estado_civil) errs.estado_civil = 'Requerido';
            if (!aspirante.telefono.trim()) errs.telefono = 'Requerido';
            else if (!/^\d{10}$/.test(aspirante.telefono))
                errs.telefono = '10 dígitos requeridos';
            if (!aspirante.lugar_nacimiento) errs.lugar_nacimiento = 'Requerido';
            if (!aspirante.domicilio.trim()) errs.domicilio = 'Requerido';
            if (!aspirante.colonia.trim()) errs.colonia = 'Requerido';
            if (!aspirante.municipio) errs.municipio = 'Requerido';
            if (!aspirante.codigo_postal.trim()) errs.codigo_postal = 'Requerido';
            else if (!/^\d{5}$/.test(aspirante.codigo_postal))
                errs.codigo_postal = '5 dígitos requeridos';
        }
        if (step === 2) {
            if (!carrera.carrera_nombre) errs.carrera_nombre = 'Selecciona tu primera opción de carrera';
        }
        if (step === 3) {
            if (!escuela.escuela_tipo) errs.escuela_tipo = 'Requerido';
            if (!escuela.escuela_nombre.trim()) errs.escuela_nombre = 'Requerido';
            if (!escuela.escuela_municipio) errs.escuela_municipio = 'Requerido';
            if (!escuela.promedio_general) errs.promedio_general = 'Requerido';
            else if (parseFloat(escuela.promedio_general) < 0 || parseFloat(escuela.promedio_general) > 10)
                errs.promedio_general = 'Entre 0 y 10';
        }
        if (step === 4) {
            if (!tutor.tutor_nombre.trim()) errs.tutor_nombre = 'Requerido';
            if (!tutor.tutor_ocupacion) errs.tutor_ocupacion = 'Requerido';
            if (!tutor.tutor_curp.trim()) errs.tutor_curp = 'Requerido';
            else if (!/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(tutor.tutor_curp.toUpperCase()))
                errs.tutor_curp = 'CURP inválida';
            if (!tutor.tutor_grado_estudios) errs.tutor_grado_estudios = 'Requerido';
            if (!tutor.tutor_telefono.trim()) errs.tutor_telefono = 'Requerido';
            else if (!/^\d{10}$/.test(tutor.tutor_telefono))
                errs.tutor_telefono = '10 dígitos requeridos';
            if (!tutor.tutor_parentesco) errs.tutor_parentesco = 'Requerido';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const next = () => { if (validateStep()) { setStep((s) => Math.min(s + 1, 5)); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
    const prev = () => { setErrors({}); setStep((s) => Math.max(s - 1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                ...aspirante,
                curp: aspirante.curp.toUpperCase(),
                carrera_nombre: carrera.carrera_nombre,
                segunda_opcion_carrera: carrera.segunda_opcion_carrera || null,
                tercera_opcion_carrera: carrera.tercera_opcion_carrera || null,
                ...escuela,
                promedio_general: parseFloat(escuela.promedio_general),
                ...tutor,
                tutor_curp: tutor.tutor_curp.toUpperCase(),
                folio: '',   // el trigger de Supabase lo genera
            };

            const { data, error } = await supabase
                .from('preregistros')
                .insert([payload])
                .select()
                .single();

            if (error) throw error;

            const fichaData = { ...payload, folio: data.folio, id: data.id };
            const blob = await generarFichaPDF(fichaData);
            setPdfBlob(blob);
            setFolio(data.folio);
            setSubmitted(true);
        } catch (err) {
            console.error('Error al guardar:', err);
            alert('Ocurrió un error al guardar tu pre-registro. Intenta de nuevo.\n' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        if (!pdfBlob) return;
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Ficha_PreRegistro_${folio}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // ── render ────────────────────────────────────────────────
    if (loading && !session) {
        return (
            <div className="prereg-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="loader" style={{ marginBottom: '1rem' }}></div>
                    <p>Verificando identidad...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="prereg-wrapper">
                <div className="prereg-hero">
                    <div className="prereg-hero__content">
                        <span className="prereg-hero__badge">{formConfig.form_badge}</span>
                        <h1 className="prereg-hero__title">{formConfig.form_titulo}</h1>
                        <p className="prereg-hero__subtitle">{formConfig.form_subtitulo}</p>
                    </div>
                </div>
                <div className="prereg-form-container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎫</div>
                    <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Identificación de Aspirante</h2>
                    <p style={{ marginBottom: '2rem', opacity: 0.8, maxWidth: '500px', margin: '0 auto 2rem', color: '#5f6368' }}>
                        Para iniciar tu proceso de pre-registro o **recuperar un folio anterior**,
                        es necesario ingresar con tu cuenta de correo personal.
                    </p>

                    <button
                        onClick={handleLogin}
                        className="btn-primary"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            margin: '0 auto',
                            padding: '12px 28px',
                            background: '#fff',
                            color: '#3c4043',
                            border: '1px solid #dadce0',
                            borderRadius: '24px',
                            fontSize: '1rem',
                            fontWeight: '500',
                            boxShadow: '0 1px 3px rgba(60,64,67,0.3)',
                            cursor: 'pointer',
                            transition: 'background-color .2s,box-shadow .2s'
                        }}
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '20px' }} />
                        <span>Continuar con Google</span>
                    </button>

                    <div style={{
                        marginTop: '3.5rem',
                        padding: '1.5rem',
                        background: '#f8f9fa',
                        borderRadius: '1rem',
                        maxWidth: '450px',
                        margin: '3.5rem auto 0',
                        border: '1px dashed #dee2e6'
                    }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#1a73e8', fontSize: '0.9rem' }}>✨ Recuperación Automática</h4>
                        <p style={{ fontSize: '0.85rem', color: '#5f6368', margin: 0, lineHeight: '1.5' }}>
                            Si ya completaste tu pre-registro anteriormente, al iniciar sesión verás directamente tu folio y el botón para descargar tu ficha PDF nuevamente.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (submitted || existingReg) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-sans transition-colors duration-500 overflow-x-hidden">
                <header className="w-full pt-16 pb-12 px-6 text-center relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/20 -z-10 animate-gradient-flow"></div>
                    <div className="mb-6 inline-flex items-center justify-center w-24 h-24 bg-white dark:bg-slate-900 rounded-[32px] text-5xl shadow-2xl border border-emerald-50 dark:border-emerald-800 animate-pulse-icon">
                        👋
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                        ¡Hola de nuevo, <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 font-black">aspirante</span>!
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto font-medium">
                        Tu proceso de pre-registro está casi listo. Sigue estos pasos para finalizar satisfactoriamente.
                    </p>
                    <div className="relative group inline-flex items-center gap-4 bg-white dark:bg-slate-900 px-8 py-4 rounded-[28px] border border-emerald-100 dark:border-emerald-800/50 shadow-2xl shadow-emerald-900/10">
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mb-1">Folio de Aspirante</span>
                            <span className="text-xl md:text-2xl font-mono font-black text-slate-800 dark:text-white tracking-wider">{folio}</span>
                        </div>
                        <div className="w-px h-10 bg-slate-100 dark:bg-slate-800 mx-2"></div>
                        <div className="flex items-center gap-2 text-emerald-600">
                            <span className="material-symbols-outlined font-bold text-3xl">verified</span>
                        </div>
                    </div>
                </header>

                <main className="flex-grow w-full max-w-7xl mx-auto px-6 pb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Paso 1 */}
                        <div className="instruction-card relative group bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-900/10 dark:to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-5 group-hover:opacity-20 transition-all duration-700 -rotate-12 translate-x-4">
                                <span className="material-symbols-outlined text-[150px]">download</span>
                            </div>
                            <div className="glow-effect absolute inset-0 opacity-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none"></div>
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-900/20">1</div>
                                <div className="relative mb-10">
                                    <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-3xl group-hover:bg-emerald-400/40 transition-all duration-700 animate-wave"></div>
                                    <div className="relative w-32 h-32 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-inner border border-emerald-50/50 dark:border-emerald-800/30 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50 to-transparent dark:from-emerald-900/20 opacity-50"></div>
                                        <div className="animate-3d">
                                            <span className="material-symbols-outlined text-6xl text-emerald-600 dark:text-emerald-400 animate-pulse-icon">file_download</span>
                                        </div>
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-400 rounded-full animate-float-particle opacity-40"></div>
                                </div>
                                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-4">Descarga tu ficha</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                    Obtén tu comprobante oficial en formato PDF. Es el documento más importante de esta etapa.
                                </p>
                            </div>
                        </div>

                        {/* Paso 2 */}
                        <div className="instruction-card relative group bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-900/10 dark:to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-5 group-hover:opacity-20 transition-all duration-700 rotate-12 translate-x-4">
                                <span className="material-symbols-outlined text-[150px]">print</span>
                            </div>
                            <div className="glow-effect absolute inset-0 opacity-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none"></div>
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-900/20">2</div>
                                <div className="relative mb-10">
                                    <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-3xl group-hover:bg-emerald-400/40 transition-all duration-700 animate-wave" style={{ animationDelay: '-3s' }}></div>
                                    <div className="relative w-32 h-32 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-inner border border-emerald-50/50 dark:border-emerald-800/30 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50 to-transparent dark:from-emerald-900/20 opacity-50"></div>
                                        <div className="relative animate-3d" style={{ animationDelay: '-1s' }}>
                                            <span className="material-symbols-outlined text-6xl text-emerald-600 dark:text-emerald-400">print</span>
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-5 bg-emerald-100 dark:bg-emerald-900/50 rounded-sm animate-paper border-x border-emerald-300 dark:border-emerald-700"></div>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-4">Imprime 2 veces</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                    Prepara dos copias físicas legibles del documento para su entrega.
                                </p>
                            </div>
                        </div>

                        {/* Paso 3 */}
                        <div className="instruction-card relative group bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-900/10 dark:to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-5 group-hover:opacity-20 transition-all duration-700 -rotate-6 translate-x-4">
                                <span className="material-symbols-outlined text-[150px]">apartment</span>
                            </div>
                            <div className="glow-effect absolute inset-0 opacity-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none"></div>
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-900/20">3</div>
                                <div className="relative mb-10">
                                    <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-3xl group-hover:bg-emerald-400/40 transition-all duration-700 animate-wave" style={{ animationDelay: '-5s' }}></div>
                                    <div className="relative w-32 h-32 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-inner border border-emerald-50/50 dark:border-emerald-800/30 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50 to-transparent dark:from-emerald-900/20 opacity-50"></div>
                                        <div className="animate-3d" style={{ animationDelay: '-2s' }}>
                                            <span className="material-symbols-outlined text-6xl text-emerald-600 dark:text-emerald-400 animate-pulse-icon">account_balance</span>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-4">Acude a ventanilla</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                    Visita el área de Servicios Escolares con tus documentos originales para el cotejo final.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="sticky bottom-0 w-full bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl border-t border-emerald-50 dark:border-slate-800/50 py-6 px-8 z-40">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="hidden lg:flex items-center gap-4">
                            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <span className="material-symbols-outlined">school</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Institución</p>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">CBTA No. 134 - Control Escolar</p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <button
                                onClick={handleDownloadPDF}
                                disabled={!pdfBlob}
                                className="relative group overflow-hidden flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-lg active:scale-95 text-lg"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                                <span className="material-symbols-outlined text-2xl">download_for_offline</span>
                                <span>{pdfBlob ? 'Descargar Mi Ficha' : 'Generando...'}</span>
                            </button>
                            <button
                                onClick={() => setCurrentView && setCurrentView('home')}
                                className="flex items-center justify-center gap-3 bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 font-bold py-4 px-8 rounded-2xl transition-all active:scale-95 text-lg border border-slate-200 dark:border-slate-700"
                            >
                                <span className="material-symbols-outlined text-2xl">logout</span>
                                <span>Finalizar</span>
                            </button>
                        </div>
                        <div className="text-center md:text-right">
                            <button
                                onClick={handleLogout}
                                className="group flex items-center justify-center md:justify-end gap-2 text-xs font-bold text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                            >
                                <span className="material-symbols-outlined text-base">person</span>
                                <span className="border-b border-transparent group-hover:border-emerald-500/30 pb-0.5 transition-all">Cerrar sesión de {session?.user?.email}</span>
                            </button>
                        </div>
                    </div>
                </footer>

                {/* Theme Toggle */}
                <div className="fixed top-6 right-6 z-50">
                    <button
                        className="w-12 h-12 rounded-[18px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg shadow-xl border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
                        onClick={() => document.documentElement.classList.toggle('dark')}
                    >
                        <span className="material-symbols-outlined text-2xl dark:hidden group-hover:rotate-90 transition-transform duration-500">dark_mode</span>
                        <span className="material-symbols-outlined text-2xl hidden dark:block group-hover:-rotate-90 transition-transform duration-500">light_mode</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="prereg-wrapper" ref={formRef}>
            {/* Hero */}
            <div className="prereg-hero">
                <div className="prereg-hero__content">
                    <span className="prereg-hero__badge">{formConfig.form_badge}</span>
                    <h1 className="prereg-hero__title">{formConfig.form_titulo}</h1>
                    <p className="prereg-hero__subtitle">
                        {formConfig.form_subtitulo}
                    </p>
                </div>
            </div>

            {/* Stepper */}
            <div className="prereg-stepper">
                {(formConfig.stepper_json || []).map((s) => (
                    <div
                        key={s.id}
                        className={`prereg-step ${step === s.id ? 'active' : ''} ${step > s.id ? 'done' : ''}`}
                    >
                        <div className="prereg-step__circle">
                            {step > s.id ? '✓' : s.icon}
                        </div>
                        <span className="prereg-step__label">{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Form */}
            <div className="prereg-form-container">
                {step === 1 && <StepPersonal data={aspirante} onChange={setField(setAspirante)} errors={errors} cfg={formConfig} />}
                {step === 2 && <StepCarrera data={carrera} onChange={setField(setCarrera)} errors={errors} carreras={carreras} cfg={formConfig} />}
                {step === 3 && <StepEscuela data={escuela} onChange={setField(setEscuela)} errors={errors} cfg={formConfig} />}
                {step === 4 && <StepTutor data={tutor} onChange={setField(setTutor)} errors={errors} cfg={formConfig} />}
                {step === 5 && (
                    <StepConfirmacion
                        aspirante={aspirante}
                        carrera={carrera}
                        escuela={escuela}
                        tutor={tutor}
                        cfg={formConfig}
                    />
                )}

                {/* Navegación */}
                <div className="prereg-nav">
                    {step > 1 && (
                        <button className="btn-secondary" onClick={prev} disabled={loading}>
                            ← Anterior
                        </button>
                    )}
                    {step < 5 && (
                        <button className="btn-primary" onClick={next}>
                            Siguiente →
                        </button>
                    )}
                    {step === 5 && (
                        <button className="btn-success" onClick={handleSubmit} disabled={loading}>
                            {loading ? '⏳ Guardando...' : '✅ Enviar Pre-Registro'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ════════════════════════════════════════════════════
// PASO 1 – Datos personales (MEJORADO CON SELECTS)
// ════════════════════════════════════════════════════
function StepPersonal({ data, onChange, errors, cfg }) {
    return (
        <div className="prereg-section">
            <h2 className="prereg-section__title">{cfg.form_titulo_paso1}</h2>

            <div className="form-grid form-grid--3">
                <Field label="Nombre(s)" name="nombre" value={data.nombre} onChange={onChange} error={errors.nombre} required />
                <Field label="Apellido Paterno" name="apellido_paterno" value={data.apellido_paterno} onChange={onChange} error={errors.apellido_paterno} required />
                <Field label="Apellido Materno" name="apellido_materno" value={data.apellido_materno} onChange={onChange} error={errors.apellido_materno} required />
            </div>

            <div className="form-grid form-grid--2">
                <Field label="CURP" name="curp" value={data.curp} onChange={onChange} error={errors.curp}
                    required placeholder="XXXX000000XXXXXXXX" maxLength={18}
                    onInput={e => e.target.value = e.target.value.toUpperCase()} />
                <SelectField label="Sexo" name="sexo" value={data.sexo} onChange={onChange} error={errors.sexo} required
                    options={SEXOS} placeholder="-- Selecciona tu sexo --" />
            </div>

            <div className="form-grid form-grid--2">
                <Field label="Fecha de Nacimiento" name="fecha_nacimiento" type="date" value={data.fecha_nacimiento}
                    onChange={onChange} error={errors.fecha_nacimiento} required />
                <SelectField label="Estado Civil" name="estado_civil" value={data.estado_civil} onChange={onChange}
                    error={errors.estado_civil} required options={ESTADOS_CIVIL} placeholder="-- Selecciona --" />
            </div>

            <div className="form-grid form-grid--2">
                <Field label="Correo Electrónico Verified (Google)" name="correo" type="email" value={data.correo}
                    onChange={onChange} error={errors.correo} required readOnly />
                <Field label="Teléfono (10 dígitos)" name="telefono" type="tel" value={data.telefono}
                    onChange={onChange} error={errors.telefono} required maxLength={10} placeholder="5512345678" />
            </div>

            <SelectField label="Lugar de Nacimiento (Estado)" name="lugar_nacimiento" value={data.lugar_nacimiento}
                onChange={onChange} error={errors.lugar_nacimiento} required
                options={ESTADOS_MEXICO} placeholder="-- Selecciona tu estado de nacimiento --" />

            <h3 className="prereg-section__subtitle">📍 Domicilio Actual</h3>
            <Field label="Domicilio (calle y número)" name="domicilio" value={data.domicilio}
                onChange={onChange} error={errors.domicilio} required placeholder="Calle Ejemplo #123" />

            <div className="form-grid form-grid--3">
                <Field label="Colonia" name="colonia" value={data.colonia} onChange={onChange} error={errors.colonia} required />
                <Field label="Municipio" name="municipio" value={data.municipio} onChange={onChange}
                    error={errors.municipio} required placeholder="Escribe tu municipio" />
                <Field label="Código Postal" name="codigo_postal" value={data.codigo_postal} onChange={onChange}
                    error={errors.codigo_postal} required maxLength={5} placeholder="12345" />
            </div>
        </div>
    );
}

// ════════════════════════════════════════════════════
// PASO 2 – Carrera (DINÁMICO desde Supabase)
// ════════════════════════════════════════════════════
function StepCarrera({ data, onChange, errors, carreras, cfg }) {
    // Filtrar carreras ya seleccionadas para 2ª y 3ª opción
    const carrerasDisponibles2 = carreras.filter(c => c.nombre !== data.carrera_nombre);
    const carrerasDisponibles3 = carreras.filter(c => c.nombre !== data.carrera_nombre && c.nombre !== data.segunda_opcion_carrera);

    return (
        <div className="prereg-section">
            <h2 className="prereg-section__title">{cfg.form_titulo_paso2}</h2>
            <p className="prereg-section__desc">
                {cfg.form_desc_paso2}
            </p>

            {/* ── 1ª OPCIÓN DE CARRERA ── */}
            <h3 className="prereg-section__subtitle" style={{ marginTop: '0.5rem' }}>🥇 Primera Opción de Carrera <span className="required">*</span></h3>
            <div className="carrera-cards">
                {carreras.map((c) => (
                    <label key={c.nombre} className={`carrera-card ${data.carrera_nombre === c.nombre ? 'selected' : ''}`}>
                        <input
                            type="radio"
                            name="carrera_nombre"
                            value={c.nombre}
                            checked={data.carrera_nombre === c.nombre}
                            onChange={(e) => {
                                onChange(e);
                                // Si la 2ª o 3ª coincide con la nueva 1ª, limpiar
                                if (data.segunda_opcion_carrera === e.target.value) {
                                    onChange({ target: { name: 'segunda_opcion_carrera', value: '' } });
                                }
                                if (data.tercera_opcion_carrera === e.target.value) {
                                    onChange({ target: { name: 'tercera_opcion_carrera', value: '' } });
                                }
                            }}
                            hidden
                        />
                        <div className="carrera-card__icon">{c.icono || getCarreraIcon(c.nombre)}</div>
                        <div className="carrera-card__name">{c.nombre}</div>
                        {c.descripcion_corta && <div className="carrera-card__desc">{c.descripcion_corta}</div>}
                    </label>
                ))}
            </div>
            {errors.carrera_nombre && <span className="field-error">{errors.carrera_nombre}</span>}

            <div style={{ marginTop: '1.5rem' }}>
                <SelectField
                    label="O selecciona desde el menú desplegable"
                    name="carrera_nombre"
                    value={data.carrera_nombre}
                    onChange={onChange}
                    error={null}
                    options={carreras.map(c => c.nombre)}
                    placeholder="-- Selecciona tu 1ª opción --"
                />
            </div>

            {/* ── 2ª OPCIÓN DE CARRERA ── */}
            <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(59,130,246,0.05)', borderRadius: '1rem', border: '1px dashed rgba(59,130,246,0.3)' }}>
                <h3 className="prereg-section__subtitle" style={{ margin: '0 0 0.5rem 0' }}>🥈 Segunda Opción de Carrera <span style={{ fontSize: '0.75rem', opacity: 0.6, fontWeight: 'normal' }}>(opcional)</span></h3>
                <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1rem' }}>En caso de no haber cupo en tu primera opción, se considerará esta alternativa.</p>
                <SelectField
                    label="Segunda opción de carrera"
                    name="segunda_opcion_carrera"
                    value={data.segunda_opcion_carrera}
                    onChange={(e) => {
                        onChange(e);
                        if (data.tercera_opcion_carrera === e.target.value) {
                            onChange({ target: { name: 'tercera_opcion_carrera', value: '' } });
                        }
                    }}
                    error={null}
                    options={carrerasDisponibles2.map(c => c.nombre)}
                    placeholder="-- Selecciona tu 2ª opción (opcional) --"
                />
            </div>

            {/* ── 3ª OPCIÓN DE CARRERA ── */}
            <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'rgba(168,85,247,0.05)', borderRadius: '1rem', border: '1px dashed rgba(168,85,247,0.3)' }}>
                <h3 className="prereg-section__subtitle" style={{ margin: '0 0 0.5rem 0' }}>🥉 Tercera Opción de Carrera <span style={{ fontSize: '0.75rem', opacity: 0.6, fontWeight: 'normal' }}>(opcional)</span></h3>
                <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1rem' }}>Otra alternativa en caso de que no haya disponibilidad en las dos primeras opciones.</p>
                <SelectField
                    label="Tercera opción de carrera"
                    name="tercera_opcion_carrera"
                    value={data.tercera_opcion_carrera}
                    onChange={onChange}
                    error={null}
                    options={carrerasDisponibles3.map(c => c.nombre)}
                    placeholder="-- Selecciona tu 3ª opción (opcional) --"
                />
            </div>
        </div>
    );
}

function getCarreraIcon(n) {
    if (n.includes('Contabilidad')) return '💼';
    if (n.includes('Ofimática')) return '💻';
    if (n.includes('Programación')) return '⌨️';
    if (n.includes('Agropecuario')) return '🌾';
    if (n.includes('Pecuaria')) return '🐄';
    return '📚';
}

// ════════════════════════════════════════════════════
// PASO 3 – Escuela de procedencia (MEJORADO CON SELECTS)
// ════════════════════════════════════════════════════
function StepEscuela({ data, onChange, errors, cfg }) {
    return (
        <div className="prereg-section">
            <h2 className="prereg-section__title">{cfg.form_titulo_paso3}</h2>
            <p className="prereg-section__desc">
                {cfg.form_desc_paso3}
            </p>

            <div className="form-grid form-grid--2">
                <SelectField label="Tipo de Escuela" name="escuela_tipo" value={data.escuela_tipo}
                    onChange={onChange} error={errors.escuela_tipo} required
                    options={TIPOS_ESCUELA} placeholder="-- Selecciona el tipo --" />
                <Field label="Nombre de la Escuela" name="escuela_nombre" value={data.escuela_nombre}
                    onChange={onChange} error={errors.escuela_nombre} required
                    placeholder="Ej. Sec. Tec. No. 5" />
            </div>

            <div className="form-grid form-grid--2">
                <Field label="Municipio de la Escuela" name="escuela_municipio" value={data.escuela_municipio}
                    onChange={onChange} error={errors.escuela_municipio} required
                    placeholder="Escribe el municipio" />
                <Field label="Promedio General (0 – 10)" name="promedio_general" type="number"
                    value={data.promedio_general} onChange={onChange} error={errors.promedio_general}
                    required min={0} max={10} step={0.1} placeholder="8.5" />
            </div>
        </div>
    );
}

// ════════════════════════════════════════════════════
// PASO 4 – Datos del tutor (MEJORADO CON SELECTS)
// ════════════════════════════════════════════════════
function StepTutor({ data, onChange, errors, cfg }) {
    return (
        <div className="prereg-section">
            <h2 className="prereg-section__title">{cfg.form_titulo_paso4}</h2>
            <p className="prereg-section__desc">
                {cfg.form_desc_paso4}
            </p>

            <div className="form-grid form-grid--2">
                <Field label="Nombre Completo del Tutor" name="tutor_nombre" value={data.tutor_nombre}
                    onChange={onChange} error={errors.tutor_nombre} required />
                <SelectField label="Parentesco" name="tutor_parentesco" value={data.tutor_parentesco}
                    onChange={onChange} error={errors.tutor_parentesco} required
                    options={PARENTESCOS} placeholder="-- Selecciona parentesco --" />
            </div>

            <div className="form-grid form-grid--2">
                <Field label="CURP del Tutor" name="tutor_curp" value={data.tutor_curp}
                    onChange={onChange} error={errors.tutor_curp} required
                    placeholder="XXXX000000XXXXXXXX" maxLength={18}
                    onInput={e => e.target.value = e.target.value.toUpperCase()} />
                <SelectField label="Ocupación" name="tutor_ocupacion" value={data.tutor_ocupacion}
                    onChange={onChange} error={errors.tutor_ocupacion} required
                    options={OCUPACIONES} placeholder="-- Selecciona ocupación --" />
            </div>

            <div className="form-grid form-grid--2">
                <SelectField label="Último Grado de Estudios" name="tutor_grado_estudios"
                    value={data.tutor_grado_estudios} onChange={onChange}
                    error={errors.tutor_grado_estudios} required options={GRADOS_ESTUDIO}
                    placeholder="-- Selecciona grado de estudios --" />
                <Field label="Teléfono del Tutor (10 dígitos)" name="tutor_telefono" type="tel"
                    value={data.tutor_telefono} onChange={onChange} error={errors.tutor_telefono}
                    required maxLength={10} placeholder="5512345678" />
            </div>
        </div>
    );
}

// ════════════════════════════════════════════════════
// PASO 5 – Confirmación
// ════════════════════════════════════════════════════
function StepConfirmacion({ aspirante, carrera, escuela, tutor, cfg }) {
    const rows = [
        { label: 'Nombre Completo', value: `${aspirante.nombre} ${aspirante.apellido_paterno} ${aspirante.apellido_materno}` },
        { label: 'CURP', value: aspirante.curp?.toUpperCase() },
        { label: 'Sexo', value: aspirante.sexo },
        { label: 'Fecha de Nacimiento', value: aspirante.fecha_nacimiento },
        { label: 'Correo', value: aspirante.correo },
        { label: 'Estado Civil', value: aspirante.estado_civil },
        { label: 'Teléfono', value: aspirante.telefono },
        { label: 'Lugar de Nacimiento', value: aspirante.lugar_nacimiento },
        { label: 'Domicilio', value: `${aspirante.domicilio}, Col. ${aspirante.colonia}, ${aspirante.municipio}, C.P. ${aspirante.codigo_postal}` },
        { label: '— CARRERA —', value: '' },
        { label: '1ª Opción de Carrera', value: carrera.carrera_nombre },
        ...(carrera.segunda_opcion_carrera ? [{ label: '2ª Opción de Carrera', value: carrera.segunda_opcion_carrera }] : []),
        ...(carrera.tercera_opcion_carrera ? [{ label: '3ª Opción de Carrera', value: carrera.tercera_opcion_carrera }] : []),
        { label: '— ESCUELA —', value: '' },
        { label: 'Tipo de Escuela', value: escuela.escuela_tipo },
        { label: 'Escuela', value: escuela.escuela_nombre },
        { label: 'Municipio Escuela', value: escuela.escuela_municipio },
        { label: 'Promedio General', value: escuela.promedio_general },
        { label: '— TUTOR —', value: '' },
        { label: 'Tutor', value: `${tutor.tutor_nombre} (${tutor.tutor_parentesco})` },
        { label: 'CURP Tutor', value: tutor.tutor_curp?.toUpperCase() },
        { label: 'Ocupación', value: tutor.tutor_ocupacion },
        { label: 'Grado de Estudios', value: tutor.tutor_grado_estudios },
        { label: 'Teléfono Tutor', value: tutor.tutor_telefono },
    ];

    return (
        <div className="prereg-section">
            <h2 className="prereg-section__title">{cfg.form_titulo_paso5}</h2>
            <p className="prereg-section__desc">
                {cfg.form_desc_paso5}
                {' '}Al hacer clic en <strong>"Enviar Pre-Registro"</strong> se generará tu ficha en PDF.
            </p>
            <div className="confirm-table">
                {rows.map((r, i) => (
                    r.label.startsWith('—') ? (
                        <div key={i} className="confirm-table__header">{r.label.replace(/—/g, '').trim()}</div>
                    ) : (
                        <div key={i} className="confirm-table__row">
                            <span className="confirm-table__label">{r.label}:</span>
                            <span className="confirm-table__value">{r.value || '—'}</span>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}

// ════════════════════════════════════════════════════
// Componentes reutilizables
// ════════════════════════════════════════════════════
function Field({ label, name, value, onChange, error, required, type = 'text', placeholder, maxLength, min, max, step, onInput }) {
    return (
        <div className="form-field">
            <label className="form-label">
                {label} {required && <span className="required">*</span>}
            </label>
            <input
                className={`form-input ${error ? 'input-error' : ''}`}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onInput={onInput}
                placeholder={placeholder}
                maxLength={maxLength}
                min={min}
                max={max}
                step={step}
                autoComplete="off"
            />
            {error && <span className="field-error">{error}</span>}
        </div>
    );
}

function SelectField({ label, name, value, onChange, error, required, options, placeholder }) {
    return (
        <div className="form-field">
            <label className="form-label">
                {label} {required && <span className="required">*</span>}
            </label>
            <select
                className={`form-input form-select ${error ? 'input-error' : ''}`}
                name={name}
                value={value}
                onChange={onChange}
            >
                <option value="">{placeholder || '-- Selecciona --'}</option>
                {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            {error && <span className="field-error">{error}</span>}
        </div>
    );
}
