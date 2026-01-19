import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import AddClubModal from './AddClubModal';
import AddCareerModal from './AddCareerModal';
import ChatbotPrompt from './ChatbotPrompt';

const MaestrosAdmin = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [announcement, setAnnouncement] = useState({ titulo: '', contenido: '' });
    const [darkMode, setDarkMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeNav, setActiveNav] = useState('dashboard');

    // Estados para Carreras Técnicas
    const [careers, setCareers] = useState([]);
    const [showCareerModal, setShowCareerModal] = useState(false);
    const [careerToEdit, setCareerToEdit] = useState(null);

    // Estados para Clubes
    const [clubs, setClubs] = useState([]);
    const [showClubModal, setShowClubModal] = useState(false);
    const [clubToEdit, setClubToEdit] = useState(null);

    // Estados para Proceso de Admisión
    const [admissionConfig, setAdmissionConfig] = useState(null);
    const [admissionConfigForm, setAdmissionConfigForm] = useState({
        target_date: '',
        countdown_message: '',
        header_title: '',
        header_subtitle: ''
    });
    const [admissionDates, setAdmissionDates] = useState([]);
    const [admissionDateForm, setAdmissionDateForm] = useState({
        title: '',
        date_range: '',
        subtitle: ''
    });
    const [editingAdmissionDate, setEditingAdmissionDate] = useState(null);

    const [admissionRequirements, setAdmissionRequirements] = useState([]);
    const [admissionRequirementForm, setAdmissionRequirementForm] = useState({
        requirement: ''
    });
    const [editingAdmissionRequirement, setEditingAdmissionRequirement] = useState(null);

    const [admissionSpecialties, setAdmissionSpecialties] = useState([]);
    const [admissionSpecialtyForm, setAdmissionSpecialtyForm] = useState({
        emoji: '',
        name: '',
        description: ''
    });
    const [editingAdmissionSpecialty, setEditingAdmissionSpecialty] = useState(null);

    const [admissionContact, setAdmissionContact] = useState(null);
    const [admissionContactForm, setAdmissionContactForm] = useState({
        address: '',
        phone_label: '',
        phone_value: '',
        email_label: '',
        email_value: '',
        website_label: '',
        website_value: '',
        schedule: ''
    });

    // Estados para BAETAM
    const [baetamConfig, setBaetamConfig] = useState(null);
    const [baetamConfigForm, setBaetamConfigForm] = useState({
        hero_image_url: '',
        title: '',
        subtitle: '',
        target_date: '',
        countdown_label: '',
        countdown_date_text: '',
        inscriptions_title: '',
        inscriptions_period_title: '',
        inscriptions_period_description: '',
        requirements_title: '',
        advantages_title: '',
        contact_title: '',
        contact_description: ''
    });
    const [baetamInfoCards, setBaetamInfoCards] = useState([]);
    const [baetamInfoForm, setBaetamInfoForm] = useState({ title: '', description: '' });
    const [editingBaetamInfo, setEditingBaetamInfo] = useState(null);

    const [baetamRequirements, setBaetamRequirements] = useState([]);
    const [baetamRequirementForm, setBaetamRequirementForm] = useState({ icon: '', text: '' });
    const [editingBaetamRequirement, setEditingBaetamRequirement] = useState(null);

    const [baetamAdvantages, setBaetamAdvantages] = useState([]);
    const [baetamAdvantageForm, setBaetamAdvantageForm] = useState({ title: '', description: '' });
    const [editingBaetamAdvantage, setEditingBaetamAdvantage] = useState(null);

    const [baetamContactLines, setBaetamContactLines] = useState([]);
    const [baetamContactLineForm, setBaetamContactLineForm] = useState({ line_text: '' });
    const [editingBaetamContactLine, setEditingBaetamContactLine] = useState(null);
    // Estados para Contacto
    const [contactMain, setContactMain] = useState(null);
    const [contactMainForm, setContactMainForm] = useState({
        address_line1: '',
        address_line2: '',
        address_line3: '',
        phone: '',
        email: '',
        website: '',
        rating_text: '',
        status_text: '',
        hours_line1: '',
        hours_line2: ''
    });
    const [contactDirectory, setContactDirectory] = useState([]);
    const [contactDirectoryForm, setContactDirectoryForm] = useState({ icon: '', title: '', detail: '' });
    const [editingContactDirectory, setEditingContactDirectory] = useState(null);

    const [contactSocial, setContactSocial] = useState([]);
    const [contactSocialForm, setContactSocialForm] = useState({ icon: '', name: '', url: '', description: '' });
    const [editingContactSocial, setEditingContactSocial] = useState(null);

    const [contactLocation, setContactLocation] = useState(null);
    const [contactLocationForm, setContactLocationForm] = useState({ address_text: '', map_embed_url: '' });

    const [contactFaqs, setContactFaqs] = useState([]);
    const [contactFaqForm, setContactFaqForm] = useState({ question: '', answer: '' });
    const [editingContactFaq, setEditingContactFaq] = useState(null);

    const [contactCta, setContactCta] = useState(null);
    const [contactCtaForm, setContactCtaForm] = useState({ title: '', description: '', highlight_text: '' });

    // Estados para Acerca de CBTa
    const [aboutConfig, setAboutConfig] = useState(null);
    const [aboutConfigForm, setAboutConfigForm] = useState({
        title: '',
        logo_url: '',
        croquis_image_url: '',
        history_text: '',
        mission_text: '',
        vision_text: '',
        lema_text: '',
        commitment_text_1: '',
        commitment_text_2: ''
    });
    const [aboutCroquisFile, setAboutCroquisFile] = useState(null);
    const [uploadingCroquis, setUploadingCroquis] = useState(false);
    const [aboutValues, setAboutValues] = useState([]);
    const [aboutValueForm, setAboutValueForm] = useState({ icon: '', title: '', description: '' });
    const [editingAboutValue, setEditingAboutValue] = useState(null);

    // Estados para Galería
    const [galleryItems, setGalleryItems] = useState([]);
    const [galleryForm, setGalleryForm] = useState({
        section: 'instalaciones',
        title: '',
        description: '',
        image_url: '',
        is_locked: false
    });
    const [editingGalleryItem, setEditingGalleryItem] = useState(null);
    const [galleryFile, setGalleryFile] = useState(null);
    const [uploadingGallery, setUploadingGallery] = useState(false);

    // Estados para Interfaz General
    const [uiHeaderConfig, setUiHeaderConfig] = useState(null);
    const [uiHeaderForm, setUiHeaderForm] = useState({ logo_url: '', title_text: '' });
    const [uiHeaderLinks, setUiHeaderLinks] = useState([]);
    const [uiHeaderLinkForm, setUiHeaderLinkForm] = useState({ label: '', href: '', path: '' });
    const [editingHeaderLink, setEditingHeaderLink] = useState(null);

    const [uiFooterConfig, setUiFooterConfig] = useState(null);
    const [uiFooterForm, setUiFooterForm] = useState({
        school_name: '',
        location_text: '',
        tagline_text: '',
        copyright_text: '',
        rights_text: '',
        legal_text_1: '',
        legal_text_2: '',
        legal_text_3: ''
    });
    const [uiFooterLinks, setUiFooterLinks] = useState([]);
    const [uiFooterLinkForm, setUiFooterLinkForm] = useState({ label: '', href: '', icon_url: '', style_class: '' });
    const [editingFooterLink, setEditingFooterLink] = useState(null);

    const [heroSlides, setHeroSlides] = useState([]);
    const [heroForm, setHeroForm] = useState({ image_url: '', is_locked: false });
    const [editingHero, setEditingHero] = useState(null);
    const [heroFile, setHeroFile] = useState(null);
    const [uploadingHero, setUploadingHero] = useState(false);

    const [homeOptionsAdmin, setHomeOptionsAdmin] = useState([]);
    const [homeOptionForm, setHomeOptionForm] = useState({ image_url: '', title: '', description: '', path: '', is_locked: false });
    const [editingHomeOption, setEditingHomeOption] = useState(null);
    const [homeOptionFile, setHomeOptionFile] = useState(null);
    const [uploadingHomeOption, setUploadingHomeOption] = useState(false);

    // Estados para Maestros (Portal Docente)
    const [teachersConfig, setTeachersConfig] = useState(null);
    const [teachersConfigForm, setTeachersConfigForm] = useState({
        title: '',
        subtitle: '',
        hero_image_url: '',
        cta_label: ''
    });
    const [teacherLinks, setTeacherLinks] = useState([]);
    const [teacherLinkForm, setTeacherLinkForm] = useState({
        name: '',
        description: '',
        icon: '',
        url: '',
        color: '',
        order_index: '',
        is_active: true
    });
    const [editingTeacherLink, setEditingTeacherLink] = useState(null);

    // Estados para Créditos
    const [creditsConfig, setCreditsConfig] = useState(null);
    const [creditsConfigForm, setCreditsConfigForm] = useState({
        title: '',
        subtitle: '',
        license_title: '',
        license_text: ''
    });
    const [creditsAuthors, setCreditsAuthors] = useState([]);
    const [creditsAuthorForm, setCreditsAuthorForm] = useState({
        full_name: '',
        career: '',
        description: '',
        photo_url: ''
    });
    const [editingCreditsAuthor, setEditingCreditsAuthor] = useState(null);
    const [creditsFile, setCreditsFile] = useState(null);
    const [uploadingCredits, setUploadingCredits] = useState(false);

    // Estados para IA Chatbot
    const [chatbotConfig, setChatbotConfig] = useState(null);
    const [chatbotForm, setChatbotForm] = useState({
        provider: 'groq',
        base_url: '',
        api_key: '',
        groq_api_key: '',
        gemini_api_key: '',
        model: '',
        system_prompt: '',
        enable_db_context: true,
        enabled: true,
        fallback_enabled: false,
        primary_provider: 'groq'
    });
    const [chatbotSaving, setChatbotSaving] = useState(false);
    const [aiModels, setAiModels] = useState([]);
    const [aiModelForm, setAiModelForm] = useState({ provider: 'groq', name: '' });
    const [chatbotTestInput, setChatbotTestInput] = useState('');
    const [chatbotTestResponse, setChatbotTestResponse] = useState('');
    const [chatbotTestLoading, setChatbotTestLoading] = useState(false);
    const [showAdvancedChatbotConfig, setShowAdvancedChatbotConfig] = useState(false);
    const [chatbotQuestions, setChatbotQuestions] = useState([]);
    const [chatbotQuestionsOpen, setChatbotQuestionsOpen] = useState(false);
    const [chatbotQuestionsLoading, setChatbotQuestionsLoading] = useState(false);
    const [storageUsage, setStorageUsage] = useState(null);
    const [storageLoading, setStorageLoading] = useState(false);
    const [gmailForm, setGmailForm] = useState({
        subject: '',
        messageHtml: '',
        messageText: '',
        sendToAll: false,
        grados: [],
        grupos: []
    });
    const [gmailSending, setGmailSending] = useState(false);
    const [gmailStatus, setGmailStatus] = useState(null);
    const [gmailConnected, setGmailConnected] = useState(false);
    const [gmailChecking, setGmailChecking] = useState(false);
    const [providerToken, setProviderToken] = useState(null);
    const [gmailEmail, setGmailEmail] = useState(null);

    // Estados para código de seguridad de maestros
    const [securityVerified, setSecurityVerified] = useState(false);
    const [securityForm, setSecurityForm] = useState({ user: '', password: '' });
    const [securityError, setSecurityError] = useState('');
    const [securityLoading, setSecurityLoading] = useState(false);

    // Estados para cuentas permitidas del EduPanel
    const [allowedAccounts, setAllowedAccounts] = useState([]);
    const [isMasterAccount, setIsMasterAccount] = useState(false);
    const [accountNotAllowed, setAccountNotAllowed] = useState(false);
    const [newAllowedEmail, setNewAllowedEmail] = useState('');
    const [addingAccount, setAddingAccount] = useState(false);

    // Estados para configuración de acceso (panel admin)
    const [accessConfig, setAccessConfig] = useState({
        alumno_domain: '',
        maestro_user: '',
        maestro_password: ''
    });
    const [accessConfigLoading, setAccessConfigLoading] = useState(false);
    const [accessConfigSaved, setAccessConfigSaved] = useState(false);

    // Estados para calificaciones
    const [editingStudent, setEditingStudent] = useState(null);
    const [grades, setGrades] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(1);
    const [newSubject, setNewSubject] = useState({ materia: '', parcial1: '', parcial2: '', parcial3: '', tipo: 'basica' });

    // Estados para Navegación Jerárquica
    const [viewLevel, setViewLevel] = useState('semesters'); // 'semesters', 'groups', 'students'
    const [selectedSemesterFilter, setSelectedSemesterFilter] = useState(null);
    const [selectedGroupFilter, setSelectedGroupFilter] = useState(null);

    const getAvailableGroups = (semester) => {
        const groups = students
            .filter(s => s.grado === semester && s.grupo)
            .map(s => s.grupo)
            .filter((value, index, self) => self.indexOf(value) === index) // Unique
            .sort();
        return groups;
    };

    const getFilteredStudents = () => {
        return students.filter(s => s.grado === selectedSemesterFilter && s.grupo === selectedGroupFilter);
    };

    // Escuchar cambios de autenticación para capturar el provider_token de Google
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth event:', event, 'Provider token:', session?.provider_token ? 'presente' : 'ausente');
            
            const shouldCapture = (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED');
            if (shouldCapture && session?.provider_token) {
                // Guardar el token de Google en localStorage
                localStorage.setItem('gmail_provider_token', session.provider_token);
                localStorage.setItem('gmail_user_email', session.user?.email || '');
                console.log('✅ Token de Gmail guardado para:', session.user?.email);
                
                // Actualizar estado si estamos en la sección de Gmail
                setProviderToken(session.provider_token);
                setGmailEmail(session.user?.email || null);
                setGmailConnected(true);
            }
            
            if (event === 'SIGNED_OUT') {
                // Limpiar token al cerrar sesión
                localStorage.removeItem('gmail_provider_token');
                localStorage.removeItem('gmail_user_email');
                setProviderToken(null);
                setGmailEmail(null);
                setGmailConnected(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        checkUser();
        fetchPosts();
        fetchCareers();
        fetchClubs();
        fetchAdmissionData();
        fetchBaetamData();
        fetchTeachersData();
        fetchContactData();
        fetchAboutData();
        fetchGalleryData();
        fetchUiData();
        fetchCreditsData();
        fetchChatbotConfig();
        fetchAiModels();
        
        // Cargar token de Gmail desde localStorage si existe
        const savedToken = localStorage.getItem('gmail_provider_token');
        const savedEmail = localStorage.getItem('gmail_user_email');
        if (savedToken) {
            setProviderToken(savedToken);
            setGmailEmail(savedEmail);
            setGmailConnected(true);
        }
    }, []);

    useEffect(() => {
        if (activeNav === 'gmail') {
            checkGmailStatus();
        }
        if (activeNav === 'access') {
            fetchAccessConfig();
            fetchAllowedAccounts();
        }
    }, [activeNav]);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            setLoading(false);
            return;
        }
        setUser(session.user);
        
        // Verificar si la cuenta está permitida en el EduPanel
        try {
            const { data: allowedData, error: allowedError } = await supabase
                .from('edupanel_allowed_accounts')
                .select('*')
                .eq('email', session.user.email.toLowerCase())
                .maybeSingle();
            
            // Si la tabla no existe o hay error, permitir acceso (la tabla aún no se ha creado)
            if (allowedError) {
                console.warn('Tabla edupanel_allowed_accounts no existe o error:', allowedError.message);
                // Continuar sin restricción de cuentas
                setAccountNotAllowed(false);
                setIsMasterAccount(true); // Dar permisos completos mientras no exista la tabla
            } else if (!allowedData) {
                setAccountNotAllowed(true);
                setLoading(false);
                return;
            } else {
                setIsMasterAccount(allowedData.is_master === true);
                setAccountNotAllowed(false);
            }
        } catch (err) {
            console.warn('Error verificando cuentas permitidas:', err);
            setAccountNotAllowed(false);
            setIsMasterAccount(true);
        }
        
        // Verificar si ya está verificado en esta sesión
        const verified = sessionStorage.getItem('maestro_security_verified');
        if (verified === 'true') {
            setSecurityVerified(true);
        }

        // Obtener o crear perfil con rol maestro
        let { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (!profileData || profileData.rol !== 'maestro') {
            const { data: updatedProfile } = await supabase
                .from('profiles')
                .upsert({
                    id: session.user.id,
                    rol: 'maestro',
                    nombre: session.user.user_metadata.full_name,
                    avatar_url: session.user.user_metadata.avatar_url
                })
                .select()
                .single();
            profileData = updatedProfile;
        }

        setProfile(profileData);
        if (verified === 'true') {
            fetchStudents();
        }
        setLoading(false);
    };

    const verifySecurityCode = async (e) => {
        e.preventDefault();
        setSecurityError('');
        setSecurityLoading(true);
        
        try {
            // Obtener credenciales de la base de datos
            const { data: configs, error } = await supabase
                .from('access_config')
                .select('config_key, config_value')
                .in('config_key', ['maestro_user', 'maestro_password']);
            
            // Si la tabla no existe, usar credenciales por defecto
            if (error) {
                console.warn('Tabla access_config no existe, usando credenciales por defecto');
                // Credenciales por defecto si la tabla no existe
                if (securityForm.user === 'cbta' && securityForm.password === 'cbta134#pagina') {
                    setSecurityVerified(true);
                    sessionStorage.setItem('maestro_security_verified', 'true');
                    fetchStudents();
                } else {
                    setSecurityError('Usuario o contraseña incorrectos.');
                }
                return;
            }
            
            if (!configs || configs.length < 2) {
                // Si no hay configuración, usar credenciales por defecto
                if (securityForm.user === 'cbta' && securityForm.password === 'cbta134#pagina') {
                    setSecurityVerified(true);
                    sessionStorage.setItem('maestro_security_verified', 'true');
                    fetchStudents();
                } else {
                    setSecurityError('Usuario o contraseña incorrectos.');
                }
                return;
            }
            
            const dbUser = configs.find(c => c.config_key === 'maestro_user')?.config_value;
            const dbPassword = configs.find(c => c.config_key === 'maestro_password')?.config_value;
            
            if (securityForm.user === dbUser && securityForm.password === dbPassword) {
                setSecurityVerified(true);
                sessionStorage.setItem('maestro_security_verified', 'true');
                fetchStudents();
            } else {
                setSecurityError('Usuario o contraseña incorrectos.');
            }
        } catch (err) {
            setSecurityError('Error al verificar. Intenta de nuevo.');
        } finally {
            setSecurityLoading(false);
        }
    };

    const fetchAccessConfig = async () => {
        const { data } = await supabase.from('access_config').select('*');
        if (data) {
            const config = {};
            data.forEach(item => {
                config[item.config_key] = item.config_value;
            });
            setAccessConfig({
                alumno_domain: config.alumno_domain || '',
                maestro_user: config.maestro_user || '',
                maestro_password: config.maestro_password || ''
            });
        }
    };

    const saveAccessConfig = async () => {
        setAccessConfigLoading(true);
        setAccessConfigSaved(false);
        
        try {
            const updates = [
                { config_key: 'alumno_domain', config_value: accessConfig.alumno_domain, description: 'Dominio de correo permitido para alumnos' },
                { config_key: 'maestro_user', config_value: accessConfig.maestro_user, description: 'Usuario de seguridad para maestros' },
                { config_key: 'maestro_password', config_value: accessConfig.maestro_password, description: 'Contraseña de seguridad para maestros' }
            ];
            
            for (const update of updates) {
                await supabase
                    .from('access_config')
                    .update({ config_value: update.config_value, updated_at: new Date().toISOString() })
                    .eq('config_key', update.config_key);
            }
            
            setAccessConfigSaved(true);
            setTimeout(() => setAccessConfigSaved(false), 3000);
        } catch (err) {
            console.error('Error saving access config:', err);
        } finally {
            setAccessConfigLoading(false);
        }
    };

    // Funciones para gestionar cuentas permitidas del EduPanel
    const fetchAllowedAccounts = async () => {
        const { data } = await supabase
            .from('edupanel_allowed_accounts')
            .select('*')
            .order('created_at', { ascending: true });
        setAllowedAccounts(data || []);
    };

    const addAllowedAccount = async () => {
        if (!newAllowedEmail.trim()) return;
        
        setAddingAccount(true);
        try {
            const { error } = await supabase
                .from('edupanel_allowed_accounts')
                .insert({
                    email: newAllowedEmail.toLowerCase().trim(),
                    is_master: false,
                    added_by: user?.email || 'desconocido'
                });
            
            if (error) {
                if (error.code === '23505') {
                    alert('Este correo ya está en la lista.');
                } else {
                    console.error('Error adding account:', error);
                    alert('Error al agregar cuenta.');
                }
            } else {
                setNewAllowedEmail('');
                fetchAllowedAccounts();
            }
        } finally {
            setAddingAccount(false);
        }
    };

    const removeAllowedAccount = async (id, email, isMaster) => {
        const masterCount = allowedAccounts.filter(acc => acc.is_master).length;
        
        if (isMaster) {
            if (masterCount <= 1) {
                alert('No puedes eliminar la única cuenta maestra. Primero asigna otra cuenta como maestra.');
                return;
            }
            if (!window.confirm(`⚠️ ATENCIÓN: "${email}" es una cuenta maestra.\n\n¿Estás seguro de que deseas eliminarla?`)) {
                return;
            }
        } else {
            if (!window.confirm(`¿Eliminar acceso para ${email}?`)) return;
        }
        
        const { error } = await supabase
            .from('edupanel_allowed_accounts')
            .delete()
            .eq('id', id);
        
        if (error) {
            console.error('Error eliminando cuenta:', error);
            alert(error.message || 'Error al eliminar la cuenta.');
        } else {
            fetchAllowedAccounts();
        }
    };

    const toggleMasterStatus = async (id, email, currentIsMaster) => {
        const masterCount = allowedAccounts.filter(acc => acc.is_master).length;
        
        if (currentIsMaster) {
            // Quitando rol de maestra
            if (masterCount <= 1) {
                alert('No puedes quitar el rol de maestra a la única cuenta maestra.');
                return;
            }
            if (!window.confirm(`¿Quitar rol de cuenta maestra a "${email}"?`)) return;
        } else {
            // Haciendo maestra
            if (masterCount >= 10) {
                alert('Ya hay 10 cuentas maestras (máximo permitido).');
                return;
            }
            if (!window.confirm(`¿Hacer "${email}" cuenta maestra?\n\nLas cuentas maestras pueden gestionar el acceso de otras cuentas.`)) return;
        }

        const { error } = await supabase
            .from('edupanel_allowed_accounts')
            .update({ is_master: !currentIsMaster })
            .eq('id', id);

        if (error) {
            console.error('Error actualizando estado:', error);
            alert(error.message || 'Error al actualizar el estado de la cuenta.');
        } else {
            fetchAllowedAccounts();
        }
    };

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { 
                redirectTo: window.location.origin + '/maestros/admin',
                scopes: 'https://www.googleapis.com/auth/gmail.send',
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent'
                }
            }
        });
    };

    const fetchStudents = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('rol', 'alumno')
            .order('grado', { ascending: true })
            .order('grupo', { ascending: true });

        if (!error) setStudents(data);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este alumno?')) {
            const { error } = await supabase.from('profiles').delete().eq('id', id);
            if (!error) fetchStudents();
        }
    };


    const [posts, setPosts] = useState([]);
    const [editingProfile, setEditingProfile] = useState(null);

    const fetchPosts = async () => {
        const { data } = await supabase.from('publicaciones_globales').select('*').order('created_at', { ascending: false });
        setPosts(data || []);
    };

    const handleDeletePost = async (id) => {
        if (window.confirm('¿Eliminar este aviso?')) {
            const { error } = await supabase.from('publicaciones_globales').delete().eq('id', id);
            if (!error) fetchPosts();
        }
    };

    const handleUpdate = (student) => {
        setEditingProfile({ ...student });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('profiles').update({
            nombre: editingProfile.nombre,
            apellidos: editingProfile.apellidos,
            email: editingProfile.email,
            curp: editingProfile.curp,
            numero_control: editingProfile.numero_control
        }).eq('id', editingProfile.id);

        if (!error) {
            setEditingProfile(null);
            fetchStudents();
        }
    };

    const [editingPost, setEditingPost] = useState(null);

    const handleEditPost = (post) => {
        setEditingPost(post);
        setAnnouncement({ titulo: post.titulo, contenido: post.contenido });
    };

    const [mediaFile, setMediaFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handlePostAnnouncement = async (e) => {
        e.preventDefault();
        setUploading(true);

        let mediaUrl = null;
        let mediaType = null;

        if (mediaFile) {
            const fileExt = mediaFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('posts_media')
                .upload(filePath, mediaFile);

            if (uploadError) {
                alert('Error subiendo archivo: ' + uploadError.message);
                setUploading(false);
                return;
            }

            const { data: { publicUrl } } = supabase.storage.from('posts_media').getPublicUrl(filePath);
            mediaUrl = publicUrl;
            mediaType = mediaFile.type.startsWith('video/') ? 'video' : 'image';
        }

        const postData = {
            titulo: announcement.titulo,
            contenido: announcement.contenido,
            media_url: mediaUrl,
            media_type: mediaType
        };

        let error;

        if (editingPost) {
            // Update existing post
            const { error: updateError } = await supabase
                .from('publicaciones_globales')
                .update(mediaFile ? postData : { titulo: announcement.titulo, contenido: announcement.contenido }) // Only update media if new file
                .eq('id', editingPost.id);
            error = updateError;
        } else {
            // Create new post
            const { error: insertError } = await supabase.from('publicaciones_globales').insert([
                { ...postData, autor_id: user.id }
            ]);
            error = insertError;
        }

        if (!error) {
            alert(editingPost ? 'Aviso actualizado' : 'Aviso publicado');
            setAnnouncement({ titulo: '', contenido: '' });
            setMediaFile(null);
            setEditingPost(null);
            fetchPosts();
        } else {
            alert('Error al guardar publicación: ' + error.message);
        }
        setUploading(false);
    };

    const openGradesModal = async (student) => {
        setEditingStudent(student);
        setSelectedSemester(student.grado || 1);
        await fetchGrades(student.id, student.grado || 1);
    };

    const fetchGrades = async (studentId, semestre) => {
        const { data, error } = await supabase
            .from('calificaciones')
            .select('*')
            .eq('alumno_id', studentId)
            .eq('semestre', semestre);

        if (!error) setGrades(data || []);
    };

    const handleSaveGrade = async (gradeId, field, value) => {
        const newValue = value === '' ? null : parseFloat(value);
        const { error } = await supabase
            .from('calificaciones')
            .update({ [field]: newValue })
            .eq('id', gradeId);

        if (!error) {
            setGrades(grades.map(g => g.id === gradeId ? { ...g, [field]: newValue } : g));
        }
    };

    const handleAddSubject = async () => {
        if (!newSubject.materia) return;

        // Validación de Especialidad
        if (newSubject.tipo === 'especialidad' && selectedSemester < 2) {
            alert('Las materias de especialidad solo pueden asignarse a partir del 2do semestre.');
            return;
        }

        const { data, error } = await supabase.from('calificaciones').insert([{
            alumno_id: editingStudent.id,
            semestre: selectedSemester,
            materia: newSubject.materia,
            tipo_materia: newSubject.tipo,
            parcial1: newSubject.parcial1 || null,
            parcial2: newSubject.parcial2 || null,
            parcial3: newSubject.parcial3 || null
        }]).select();

        if (!error && data) {
            setGrades([...grades, data[0]]);
            setNewSubject({ materia: '', parcial1: '', parcial2: '', parcial3: '', tipo: 'basica' });
        } else {
            alert('Error al agregar materia: ' + (error?.message || 'Error desconocido'));
        }
    };

    // Funciones para Carreras
    // Funciones para Carreras Técnicas
    const fetchCareers = async () => {
        const { data } = await supabase.from('carreras_tecnicas').select('*').order('created_at', { ascending: false });
        setCareers(data || []);
    };

    const handleEditCareer = (career) => {
        setCareerToEdit(career);
        setShowCareerModal(true);
    };

    const handleDeleteCareer = async (id) => {
        if (window.confirm('¿Eliminar esta carrera técnica? Esto podría afectar a los alumnos inscritos.')) {
            const { error } = await supabase.from('carreras_tecnicas').delete().eq('id', id);
            if (!error) fetchCareers();
        }
    };

    // Funciones para Clubes
    const fetchClubs = async () => {
        const { data } = await supabase.from('clubs').select('*').order('created_at', { ascending: false });
        setClubs(data || []);
    };

    const handleEditClub = (club) => {
        setClubToEdit(club);
        setShowClubModal(true);
    };

    const handleDeleteClub = async (id) => {
        if (window.confirm('¿Eliminar este club?')) {
            const { error } = await supabase.from('clubs').delete().eq('id', id);
            if (!error) fetchClubs();
        }
    };

    // Funciones para Proceso de Admisión
    const fetchAdmissionData = async () => {
        const { data: configData } = await supabase
            .from('admission_config')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        const { data: datesData } = await supabase
            .from('admission_dates')
            .select('*')
            .order('order_index', { ascending: true });

        const { data: requirementsData } = await supabase
            .from('admission_requirements')
            .select('*')
            .order('order_index', { ascending: true });

        const { data: specialtiesData } = await supabase
            .from('admission_specialties')
            .select('*')
            .order('order_index', { ascending: true });

        const { data: contactData } = await supabase
            .from('admission_contact')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        setAdmissionConfig(configData || null);
        setAdmissionDates(datesData || []);
        setAdmissionRequirements(requirementsData || []);
        setAdmissionSpecialties(specialtiesData || []);
        setAdmissionContact(contactData || null);

        if (configData) {
            setAdmissionConfigForm({
                target_date: configData.target_date ? configData.target_date.split('T')[0] : '',
                countdown_message: configData.countdown_message || '',
                header_title: configData.header_title || '',
                header_subtitle: configData.header_subtitle || ''
            });
        }

        if (contactData) {
            setAdmissionContactForm({
                address: contactData.address || '',
                phone_label: contactData.phone_label || '',
                phone_value: contactData.phone_value || '',
                email_label: contactData.email_label || '',
                email_value: contactData.email_value || '',
                website_label: contactData.website_label || '',
                website_value: contactData.website_value || '',
                schedule: contactData.schedule || ''
            });
        }
    };

    const handleSaveAdmissionConfig = async (e) => {
        e.preventDefault();
        const payload = {
            target_date: admissionConfigForm.target_date ? new Date(admissionConfigForm.target_date).toISOString() : null,
            countdown_message: admissionConfigForm.countdown_message,
            header_title: admissionConfigForm.header_title,
            header_subtitle: admissionConfigForm.header_subtitle
        };

        if (admissionConfig?.id) {
            const { error } = await supabase
                .from('admission_config')
                .update(payload)
                .eq('id', admissionConfig.id);
            if (!error) fetchAdmissionData();
        } else {
            const { error } = await supabase.from('admission_config').insert([payload]);
            if (!error) fetchAdmissionData();
        }
    };

    const handleSaveAdmissionDate = async (e) => {
        e.preventDefault();
        if (!admissionDateForm.title || !admissionDateForm.date_range) return;
        if (editingAdmissionDate) {
            const { error } = await supabase
                .from('admission_dates')
                .update(admissionDateForm)
                .eq('id', editingAdmissionDate.id);
            if (!error) {
                setEditingAdmissionDate(null);
                setAdmissionDateForm({ title: '', date_range: '', subtitle: '' });
                fetchAdmissionData();
            }
        } else {
            const { error } = await supabase
                .from('admission_dates')
                .insert([{ ...admissionDateForm, order_index: admissionDates.length + 1 }]);
            if (!error) {
                setAdmissionDateForm({ title: '', date_range: '', subtitle: '' });
                fetchAdmissionData();
            }
        }
    };

    const handleDeleteAdmissionDate = async (id) => {
        if (window.confirm('¿Eliminar esta fecha?')) {
            const { error } = await supabase.from('admission_dates').delete().eq('id', id);
            if (!error) fetchAdmissionData();
        }
    };

    const handleSaveAdmissionRequirement = async (e) => {
        e.preventDefault();
        if (!admissionRequirementForm.requirement) return;
        if (editingAdmissionRequirement) {
            const { error } = await supabase
                .from('admission_requirements')
                .update(admissionRequirementForm)
                .eq('id', editingAdmissionRequirement.id);
            if (!error) {
                setEditingAdmissionRequirement(null);
                setAdmissionRequirementForm({ requirement: '' });
                fetchAdmissionData();
            }
        } else {
            const { error } = await supabase
                .from('admission_requirements')
                .insert([{ ...admissionRequirementForm, order_index: admissionRequirements.length + 1 }]);
            if (!error) {
                setAdmissionRequirementForm({ requirement: '' });
                fetchAdmissionData();
            }
        }
    };

    const handleDeleteAdmissionRequirement = async (id) => {
        if (window.confirm('¿Eliminar este requisito?')) {
            const { error } = await supabase.from('admission_requirements').delete().eq('id', id);
            if (!error) fetchAdmissionData();
        }
    };

    const handleSaveAdmissionSpecialty = async (e) => {
        e.preventDefault();
        if (!admissionSpecialtyForm.name) return;
        if (editingAdmissionSpecialty) {
            const { error } = await supabase
                .from('admission_specialties')
                .update(admissionSpecialtyForm)
                .eq('id', editingAdmissionSpecialty.id);
            if (!error) {
                setEditingAdmissionSpecialty(null);
                setAdmissionSpecialtyForm({ emoji: '', name: '', description: '' });
                fetchAdmissionData();
            }
        } else {
            const { error } = await supabase
                .from('admission_specialties')
                .insert([{ ...admissionSpecialtyForm, order_index: admissionSpecialties.length + 1 }]);
            if (!error) {
                setAdmissionSpecialtyForm({ emoji: '', name: '', description: '' });
                fetchAdmissionData();
            }
        }
    };

    const handleDeleteAdmissionSpecialty = async (id) => {
        if (window.confirm('¿Eliminar esta especialidad?')) {
            const { error } = await supabase.from('admission_specialties').delete().eq('id', id);
            if (!error) fetchAdmissionData();
        }
    };

    const handleSaveAdmissionContact = async (e) => {
        e.preventDefault();
        if (admissionContact?.id) {
            const { error } = await supabase
                .from('admission_contact')
                .update(admissionContactForm)
                .eq('id', admissionContact.id);
            if (!error) fetchAdmissionData();
        } else {
            const { error } = await supabase.from('admission_contact').insert([admissionContactForm]);
            if (!error) fetchAdmissionData();
        }
    };

    // BAETAM CRUD
    const fetchBaetamData = async () => {
        const { data: configData } = await supabase
            .from('baetam_config')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        const { data: infoData } = await supabase
            .from('baetam_info_cards')
            .select('*')
            .order('order_index', { ascending: true });

        const { data: requirementsData } = await supabase
            .from('baetam_requirements')
            .select('*')
            .order('order_index', { ascending: true });

        const { data: advantagesData } = await supabase
            .from('baetam_advantages')
            .select('*')
            .order('order_index', { ascending: true });

        const { data: contactData } = await supabase
            .from('baetam_contact_lines')
            .select('*')
            .order('order_index', { ascending: true });

        setBaetamConfig(configData || null);
        setBaetamInfoCards(infoData || []);
        setBaetamRequirements(requirementsData || []);
        setBaetamAdvantages(advantagesData || []);
        setBaetamContactLines(contactData || []);

        if (configData) {
            setBaetamConfigForm({
                hero_image_url: configData.hero_image_url || '',
                title: configData.title || '',
                subtitle: configData.subtitle || '',
                target_date: configData.target_date ? configData.target_date.split('T')[0] : '',
                countdown_label: configData.countdown_label || '',
                countdown_date_text: configData.countdown_date_text || '',
                inscriptions_title: configData.inscriptions_title || '',
                inscriptions_period_title: configData.inscriptions_period_title || '',
                inscriptions_period_description: configData.inscriptions_period_description || '',
                requirements_title: configData.requirements_title || '',
                advantages_title: configData.advantages_title || '',
                contact_title: configData.contact_title || '',
                contact_description: configData.contact_description || ''
            });
        }
    };

    const handleSaveBaetamConfig = async (e) => {
        e.preventDefault();
        const payload = {
            hero_image_url: baetamConfigForm.hero_image_url,
            title: baetamConfigForm.title,
            subtitle: baetamConfigForm.subtitle,
            target_date: baetamConfigForm.target_date ? new Date(baetamConfigForm.target_date).toISOString() : null,
            countdown_label: baetamConfigForm.countdown_label,
            countdown_date_text: baetamConfigForm.countdown_date_text,
            inscriptions_title: baetamConfigForm.inscriptions_title,
            inscriptions_period_title: baetamConfigForm.inscriptions_period_title,
            inscriptions_period_description: baetamConfigForm.inscriptions_period_description,
            requirements_title: baetamConfigForm.requirements_title,
            advantages_title: baetamConfigForm.advantages_title,
            contact_title: baetamConfigForm.contact_title,
            contact_description: baetamConfigForm.contact_description
        };

        if (baetamConfig?.id) {
            const { error } = await supabase
                .from('baetam_config')
                .update(payload)
                .eq('id', baetamConfig.id);
            if (!error) fetchBaetamData();
        } else {
            const { error } = await supabase.from('baetam_config').insert([payload]);
            if (!error) fetchBaetamData();
        }
    };

    const handleSaveBaetamInfo = async (e) => {
        e.preventDefault();
        if (!baetamInfoForm.title || !baetamInfoForm.description) return;
        if (editingBaetamInfo) {
            const { error } = await supabase
                .from('baetam_info_cards')
                .update(baetamInfoForm)
                .eq('id', editingBaetamInfo.id);
            if (!error) {
                setEditingBaetamInfo(null);
                setBaetamInfoForm({ title: '', description: '' });
                fetchBaetamData();
            }
        } else {
            const { error } = await supabase
                .from('baetam_info_cards')
                .insert([{ ...baetamInfoForm, order_index: baetamInfoCards.length + 1 }]);
            if (!error) {
                setBaetamInfoForm({ title: '', description: '' });
                fetchBaetamData();
            }
        }
    };

    const handleDeleteBaetamInfo = async (id) => {
        if (window.confirm('¿Eliminar esta tarjeta?')) {
            const { error } = await supabase.from('baetam_info_cards').delete().eq('id', id);
            if (!error) fetchBaetamData();
        }
    };

    const handleSaveBaetamRequirement = async (e) => {
        e.preventDefault();
        if (!baetamRequirementForm.text) return;
        if (editingBaetamRequirement) {
            const { error } = await supabase
                .from('baetam_requirements')
                .update(baetamRequirementForm)
                .eq('id', editingBaetamRequirement.id);
            if (!error) {
                setEditingBaetamRequirement(null);
                setBaetamRequirementForm({ icon: '', text: '' });
                fetchBaetamData();
            }
        } else {
            const { error } = await supabase
                .from('baetam_requirements')
                .insert([{ ...baetamRequirementForm, order_index: baetamRequirements.length + 1 }]);
            if (!error) {
                setBaetamRequirementForm({ icon: '', text: '' });
                fetchBaetamData();
            }
        }
    };

    const handleDeleteBaetamRequirement = async (id) => {
        if (window.confirm('¿Eliminar este requisito?')) {
            const { error } = await supabase.from('baetam_requirements').delete().eq('id', id);
            if (!error) fetchBaetamData();
        }
    };

    const handleSaveBaetamAdvantage = async (e) => {
        e.preventDefault();
        if (!baetamAdvantageForm.title || !baetamAdvantageForm.description) return;
        if (editingBaetamAdvantage) {
            const { error } = await supabase
                .from('baetam_advantages')
                .update(baetamAdvantageForm)
                .eq('id', editingBaetamAdvantage.id);
            if (!error) {
                setEditingBaetamAdvantage(null);
                setBaetamAdvantageForm({ title: '', description: '' });
                fetchBaetamData();
            }
        } else {
            const { error } = await supabase
                .from('baetam_advantages')
                .insert([{ ...baetamAdvantageForm, order_index: baetamAdvantages.length + 1 }]);
            if (!error) {
                setBaetamAdvantageForm({ title: '', description: '' });
                fetchBaetamData();
            }
        }
    };

    const handleDeleteBaetamAdvantage = async (id) => {
        if (window.confirm('¿Eliminar esta ventaja?')) {
            const { error } = await supabase.from('baetam_advantages').delete().eq('id', id);
            if (!error) fetchBaetamData();
        }
    };

    const handleSaveBaetamContactLine = async (e) => {
        e.preventDefault();
        if (!baetamContactLineForm.line_text) return;
        if (editingBaetamContactLine) {
            const { error } = await supabase
                .from('baetam_contact_lines')
                .update(baetamContactLineForm)
                .eq('id', editingBaetamContactLine.id);
            if (!error) {
                setEditingBaetamContactLine(null);
                setBaetamContactLineForm({ line_text: '' });
                fetchBaetamData();
            }
        } else {
            const { error } = await supabase
                .from('baetam_contact_lines')
                .insert([{ ...baetamContactLineForm, order_index: baetamContactLines.length + 1 }]);
            if (!error) {
                setBaetamContactLineForm({ line_text: '' });
                fetchBaetamData();
            }
        }
    };

    const handleDeleteBaetamContactLine = async (id) => {
        if (window.confirm('¿Eliminar esta línea?')) {
            const { error } = await supabase.from('baetam_contact_lines').delete().eq('id', id);
            if (!error) fetchBaetamData();
        }
    };

    // MAESTROS (PORTAL DOCENTE)
    const fetchTeachersData = async () => {
        const { data: configData } = await supabase
            .from('teachers_config')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        const { data: linksData } = await supabase
            .from('teachers_links')
            .select('*')
            .order('order_index', { ascending: true });

        setTeachersConfig(configData || null);
        setTeachersConfigForm({
            title: configData?.title || '',
            subtitle: configData?.subtitle || '',
            hero_image_url: configData?.hero_image_url || '',
            cta_label: configData?.cta_label || ''
        });
        setTeacherLinks(linksData || []);
    };

    const handleSaveTeachersConfig = async (e) => {
        e.preventDefault();
        const payload = { ...teachersConfigForm };

        if (teachersConfig?.id) {
            const { error } = await supabase
                .from('teachers_config')
                .update(payload)
                .eq('id', teachersConfig.id);
            if (!error) fetchTeachersData();
        } else {
            const { error } = await supabase
                .from('teachers_config')
                .insert([payload]);
            if (!error) fetchTeachersData();
        }
    };

    const handleSaveTeacherLink = async (e) => {
        e.preventDefault();
        if (!teacherLinkForm.name || !teacherLinkForm.url) return;

        const orderIndex = teacherLinkForm.order_index
            ? parseInt(teacherLinkForm.order_index, 10)
            : teacherLinks.length + 1;

        const payload = {
            name: teacherLinkForm.name,
            description: teacherLinkForm.description,
            icon: teacherLinkForm.icon,
            url: teacherLinkForm.url,
            color: teacherLinkForm.color,
            order_index: orderIndex,
            is_active: teacherLinkForm.is_active
        };

        if (editingTeacherLink) {
            const { error } = await supabase
                .from('teachers_links')
                .update(payload)
                .eq('id', editingTeacherLink.id);
            if (!error) {
                setEditingTeacherLink(null);
                setTeacherLinkForm({ name: '', description: '', icon: '', url: '', color: '', order_index: '', is_active: true });
                fetchTeachersData();
            }
        } else {
            const { error } = await supabase
                .from('teachers_links')
                .insert([payload]);
            if (!error) {
                setTeacherLinkForm({ name: '', description: '', icon: '', url: '', color: '', order_index: '', is_active: true });
                fetchTeachersData();
            }
        }
    };

    const handleDeleteTeacherLink = async (id) => {
        if (window.confirm('¿Eliminar este recurso?')) {
            const { error } = await supabase.from('teachers_links').delete().eq('id', id);
            if (!error) fetchTeachersData();
        }
    };

    // CONTACTO CRUD
    const fetchContactData = async () => {
        const { data: mainData } = await supabase
            .from('contact_main')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        const { data: directoryData } = await supabase
            .from('contact_directory')
            .select('*')
            .order('order_index', { ascending: true });

        const { data: socialData } = await supabase
            .from('contact_social')
            .select('*')
            .order('order_index', { ascending: true });

        const { data: locationData } = await supabase
            .from('contact_location')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        const { data: faqData } = await supabase
            .from('contact_faq')
            .select('*')
            .order('order_index', { ascending: true });

        const { data: ctaData } = await supabase
            .from('contact_cta')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        setContactMain(mainData || null);
        setContactDirectory(directoryData || []);
        setContactSocial(socialData || []);
        setContactLocation(locationData || null);
        setContactFaqs(faqData || []);
        setContactCta(ctaData || null);

        if (mainData) {
            setContactMainForm({
                address_line1: mainData.address_line1 || '',
                address_line2: mainData.address_line2 || '',
                address_line3: mainData.address_line3 || '',
                phone: mainData.phone || '',
                email: mainData.email || '',
                website: mainData.website || '',
                rating_text: mainData.rating_text || '',
                status_text: mainData.status_text || '',
                hours_line1: mainData.hours_line1 || '',
                hours_line2: mainData.hours_line2 || ''
            });
        }

        if (locationData) {
            setContactLocationForm({
                address_text: locationData.address_text || '',
                map_embed_url: locationData.map_embed_url || ''
            });
        }

        if (ctaData) {
            setContactCtaForm({
                title: ctaData.title || '',
                description: ctaData.description || '',
                highlight_text: ctaData.highlight_text || ''
            });
        }
    };

    const handleSaveContactMain = async (e) => {
        e.preventDefault();
        if (contactMain?.id) {
            const { error } = await supabase
                .from('contact_main')
                .update(contactMainForm)
                .eq('id', contactMain.id);
            if (!error) fetchContactData();
        } else {
            const { error } = await supabase.from('contact_main').insert([contactMainForm]);
            if (!error) fetchContactData();
        }
    };

    const handleSaveContactDirectory = async (e) => {
        e.preventDefault();
        if (!contactDirectoryForm.title || !contactDirectoryForm.detail) return;
        if (editingContactDirectory) {
            const { error } = await supabase
                .from('contact_directory')
                .update(contactDirectoryForm)
                .eq('id', editingContactDirectory.id);
            if (!error) {
                setEditingContactDirectory(null);
                setContactDirectoryForm({ icon: '', title: '', detail: '' });
                fetchContactData();
            }
        } else {
            const { error } = await supabase
                .from('contact_directory')
                .insert([{ ...contactDirectoryForm, order_index: contactDirectory.length + 1 }]);
            if (!error) {
                setContactDirectoryForm({ icon: '', title: '', detail: '' });
                fetchContactData();
            }
        }
    };

    const handleDeleteContactDirectory = async (id) => {
        if (window.confirm('¿Eliminar este elemento del directorio?')) {
            const { error } = await supabase.from('contact_directory').delete().eq('id', id);
            if (!error) fetchContactData();
        }
    };

    const handleSaveContactSocial = async (e) => {
        e.preventDefault();
        if (!contactSocialForm.name || !contactSocialForm.url) return;
        if (editingContactSocial) {
            const { error } = await supabase
                .from('contact_social')
                .update(contactSocialForm)
                .eq('id', editingContactSocial.id);
            if (!error) {
                setEditingContactSocial(null);
                setContactSocialForm({ icon: '', name: '', url: '', description: '' });
                fetchContactData();
            }
        } else {
            const { error } = await supabase
                .from('contact_social')
                .insert([{ ...contactSocialForm, order_index: contactSocial.length + 1 }]);
            if (!error) {
                setContactSocialForm({ icon: '', name: '', url: '', description: '' });
                fetchContactData();
            }
        }
    };

    const handleDeleteContactSocial = async (id) => {
        if (window.confirm('¿Eliminar esta red social?')) {
            const { error } = await supabase.from('contact_social').delete().eq('id', id);
            if (!error) fetchContactData();
        }
    };

    const handleSaveContactLocation = async (e) => {
        e.preventDefault();
        if (contactLocation?.id) {
            const { error } = await supabase
                .from('contact_location')
                .update(contactLocationForm)
                .eq('id', contactLocation.id);
            if (!error) fetchContactData();
        } else {
            const { error } = await supabase.from('contact_location').insert([contactLocationForm]);
            if (!error) fetchContactData();
        }
    };

    const handleSaveContactFaq = async (e) => {
        e.preventDefault();
        if (!contactFaqForm.question || !contactFaqForm.answer) return;
        if (editingContactFaq) {
            const { error } = await supabase
                .from('contact_faq')
                .update(contactFaqForm)
                .eq('id', editingContactFaq.id);
            if (!error) {
                setEditingContactFaq(null);
                setContactFaqForm({ question: '', answer: '' });
                fetchContactData();
            }
        } else {
            const { error } = await supabase
                .from('contact_faq')
                .insert([{ ...contactFaqForm, order_index: contactFaqs.length + 1 }]);
            if (!error) {
                setContactFaqForm({ question: '', answer: '' });
                fetchContactData();
            }
        }
    };

    const handleDeleteContactFaq = async (id) => {
        if (window.confirm('¿Eliminar esta pregunta?')) {
            const { error } = await supabase.from('contact_faq').delete().eq('id', id);
            if (!error) fetchContactData();
        }
    };

    const handleSaveContactCta = async (e) => {
        e.preventDefault();
        if (contactCta?.id) {
            const { error } = await supabase
                .from('contact_cta')
                .update(contactCtaForm)
                .eq('id', contactCta.id);
            if (!error) fetchContactData();
        } else {
            const { error } = await supabase.from('contact_cta').insert([contactCtaForm]);
            if (!error) fetchContactData();
        }
    };

    // ACERCA DE CBTa CRUD
    const fetchAboutData = async () => {
        const { data: configData } = await supabase
            .from('about_config')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        const { data: valuesData } = await supabase
            .from('about_values')
            .select('*')
            .order('order_index', { ascending: true });

        setAboutConfig(configData || null);
        setAboutValues(valuesData || []);

        if (configData) {
            setAboutConfigForm({
                title: configData.title || '',
                logo_url: configData.logo_url || '',
                croquis_image_url: configData.croquis_image_url || '',
                history_text: configData.history_text || '',
                mission_text: configData.mission_text || '',
                vision_text: configData.vision_text || '',
                lema_text: configData.lema_text || '',
                commitment_text_1: configData.commitment_text_1 || '',
                commitment_text_2: configData.commitment_text_2 || ''
            });
        }
    };

    const handleSaveAboutConfig = async (e) => {
        e.preventDefault();
        if (aboutConfig?.id) {
            const { error } = await supabase
                .from('about_config')
                .update(aboutConfigForm)
                .eq('id', aboutConfig.id);
            if (!error) fetchAboutData();
        } else {
            const { error } = await supabase.from('about_config').insert([aboutConfigForm]);
            if (!error) fetchAboutData();
        }
    };

    const handleUploadCroquis = async () => {
        if (!aboutCroquisFile) return;
        if (!aboutConfig?.id) {
            alert('Primero guarda la información de Acerca para poder asociar el croquis.');
            return;
        }
        setUploadingCroquis(true);
        const fileExt = aboutCroquisFile.name.split('.').pop();
        const fileName = `croquis-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('about_media')
            .upload(fileName, aboutCroquisFile, { upsert: true });

        if (uploadError) {
            alert('Error subiendo croquis: ' + uploadError.message);
            setUploadingCroquis(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('about_media')
            .getPublicUrl(fileName);

        const { error: updateError } = await supabase
            .from('about_config')
            .update({ croquis_image_url: publicUrl })
            .eq('id', aboutConfig.id);

        if (updateError) {
            alert('Error guardando croquis: ' + updateError.message);
            setUploadingCroquis(false);
            return;
        }

        setAboutConfigForm({
            ...aboutConfigForm,
            croquis_image_url: publicUrl
        });
        setAboutConfig({
            ...aboutConfig,
            croquis_image_url: publicUrl
        });
        setAboutCroquisFile(null);
        setUploadingCroquis(false);
    };

    const handleSaveAboutValue = async (e) => {
        e.preventDefault();
        if (!aboutValueForm.title || !aboutValueForm.description) return;
        if (editingAboutValue) {
            const { error } = await supabase
                .from('about_values')
                .update(aboutValueForm)
                .eq('id', editingAboutValue.id);
            if (!error) {
                setEditingAboutValue(null);
                setAboutValueForm({ icon: '', title: '', description: '' });
                fetchAboutData();
            }
        } else {
            const { error } = await supabase
                .from('about_values')
                .insert([{ ...aboutValueForm, order_index: aboutValues.length + 1 }]);
            if (!error) {
                setAboutValueForm({ icon: '', title: '', description: '' });
                fetchAboutData();
            }
        }
    };

    const handleDeleteAboutValue = async (id) => {
        if (window.confirm('¿Eliminar este valor?')) {
            const { error } = await supabase.from('about_values').delete().eq('id', id);
            if (!error) fetchAboutData();
        }
    };

    // GALERÍA CRUD
    const fetchGalleryData = async () => {
        const { data } = await supabase
            .from('gallery_items')
            .select('*')
            .order('order_index', { ascending: true });
        setGalleryItems(data || []);
    };

    const handleUploadGalleryImage = async () => {
        if (!galleryFile) return;
        setUploadingGallery(true);
        const fileExt = galleryFile.name.split('.').pop();
        const fileName = `gallery-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('gallery_media')
            .upload(fileName, galleryFile, { upsert: true });

        if (uploadError) {
            alert('Error subiendo imagen: ' + uploadError.message);
            setUploadingGallery(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('gallery_media')
            .getPublicUrl(fileName);

        setGalleryForm({
            ...galleryForm,
            image_url: publicUrl
        });
        setGalleryFile(null);
        setUploadingGallery(false);
    };

    const handleSaveGalleryItem = async (e) => {
        e.preventDefault();
        if (!galleryForm.title || !galleryForm.image_url) return;

        if (editingGalleryItem) {
            const { error } = await supabase
                .from('gallery_items')
                .update({
                    section: galleryForm.section,
                    title: galleryForm.title,
                    description: galleryForm.description,
                    image_url: galleryForm.image_url
                })
                .eq('id', editingGalleryItem.id);
            if (!error) {
                setEditingGalleryItem(null);
                setGalleryForm({ section: 'instalaciones', title: '', description: '', image_url: '', is_locked: false });
                fetchGalleryData();
            }
        } else {
            const { error } = await supabase
                .from('gallery_items')
                .insert([{
                    section: galleryForm.section,
                    title: galleryForm.title,
                    description: galleryForm.description,
                    image_url: galleryForm.image_url,
                    is_locked: galleryForm.is_locked,
                    order_index: galleryItems.length + 1
                }]);
            if (!error) {
                setGalleryForm({ section: 'instalaciones', title: '', description: '', image_url: '', is_locked: false });
                fetchGalleryData();
            }
        }
    };

    const handleDeleteGalleryItem = async (item) => {
        if (item.is_locked) {
            alert('Esta imagen está bloqueada y no se puede eliminar.');
            return;
        }
        if (window.confirm('¿Eliminar esta imagen?')) {
            const { error } = await supabase.from('gallery_items').delete().eq('id', item.id);
            if (!error) fetchGalleryData();
        }
    };

    // INTERFAZ GENERAL CRUD
    const fetchUiData = async () => {
        const { data: headerData } = await supabase
            .from('ui_header_config')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        const { data: headerLinksData } = await supabase
            .from('ui_header_links')
            .select('*')
            .order('order_index', { ascending: true });

        const { data: footerData } = await supabase
            .from('ui_footer_config')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        const { data: footerLinksData } = await supabase
            .from('ui_footer_links')
            .select('*')
            .order('order_index', { ascending: true });

        const { data: heroData } = await supabase
            .from('hero_slides')
            .select('*')
            .order('order_index', { ascending: true });

        const { data: optionsData } = await supabase
            .from('home_options')
            .select('*')
            .order('order_index', { ascending: true });

        setUiHeaderConfig(headerData || null);
        setUiHeaderLinks(headerLinksData || []);
        setUiFooterConfig(footerData || null);
        setUiFooterLinks(footerLinksData || []);
        setHeroSlides(heroData || []);
        setHomeOptionsAdmin(optionsData || []);

        if (headerData) {
            setUiHeaderForm({
                logo_url: headerData.logo_url || '',
                title_text: headerData.title_text || ''
            });
        }

        if (footerData) {
            setUiFooterForm({
                school_name: footerData.school_name || '',
                location_text: footerData.location_text || '',
                tagline_text: footerData.tagline_text || '',
                copyright_text: footerData.copyright_text || '',
                rights_text: footerData.rights_text || '',
                legal_text_1: footerData.legal_text_1 || '',
                legal_text_2: footerData.legal_text_2 || '',
                legal_text_3: footerData.legal_text_3 || ''
            });
        }
    };

    const handleSaveUiHeader = async (e) => {
        e.preventDefault();
        if (uiHeaderConfig?.id) {
            const { error } = await supabase
                .from('ui_header_config')
                .update(uiHeaderForm)
                .eq('id', uiHeaderConfig.id);
            if (!error) fetchUiData();
        } else {
            const { error } = await supabase.from('ui_header_config').insert([uiHeaderForm]);
            if (!error) fetchUiData();
        }
    };

    const handleSaveHeaderLink = async (e) => {
        e.preventDefault();
        if (!uiHeaderLinkForm.label || !uiHeaderLinkForm.path) return;
        if (editingHeaderLink) {
            const { error } = await supabase
                .from('ui_header_links')
                .update(uiHeaderLinkForm)
                .eq('id', editingHeaderLink.id);
            if (!error) {
                setEditingHeaderLink(null);
                setUiHeaderLinkForm({ label: '', href: '', path: '' });
                fetchUiData();
            }
        } else {
            const { error } = await supabase
                .from('ui_header_links')
                .insert([{ ...uiHeaderLinkForm, order_index: uiHeaderLinks.length + 1 }]);
            if (!error) {
                setUiHeaderLinkForm({ label: '', href: '', path: '' });
                fetchUiData();
            }
        }
    };

    const handleDeleteHeaderLink = async (id) => {
        if (window.confirm('¿Eliminar este link?')) {
            const { error } = await supabase.from('ui_header_links').delete().eq('id', id);
            if (!error) fetchUiData();
        }
    };

    const handleSaveUiFooter = async (e) => {
        e.preventDefault();
        if (uiFooterConfig?.id) {
            const { error } = await supabase
                .from('ui_footer_config')
                .update(uiFooterForm)
                .eq('id', uiFooterConfig.id);
            if (!error) fetchUiData();
        } else {
            const { error } = await supabase.from('ui_footer_config').insert([uiFooterForm]);
            if (!error) fetchUiData();
        }
    };

    const handleSaveFooterLink = async (e) => {
        e.preventDefault();
        if (!uiFooterLinkForm.label || !uiFooterLinkForm.href) return;
        if (editingFooterLink) {
            const { error } = await supabase
                .from('ui_footer_links')
                .update(uiFooterLinkForm)
                .eq('id', editingFooterLink.id);
            if (!error) {
                setEditingFooterLink(null);
                setUiFooterLinkForm({ label: '', href: '', icon_url: '', style_class: '' });
                fetchUiData();
            }
        } else {
            const { error } = await supabase
                .from('ui_footer_links')
                .insert([{ ...uiFooterLinkForm, order_index: uiFooterLinks.length + 1 }]);
            if (!error) {
                setUiFooterLinkForm({ label: '', href: '', icon_url: '', style_class: '' });
                fetchUiData();
            }
        }
    };

    const handleDeleteFooterLink = async (id) => {
        if (window.confirm('¿Eliminar este link?')) {
            const { error } = await supabase.from('ui_footer_links').delete().eq('id', id);
            if (!error) fetchUiData();
        }
    };

    const handleUploadHero = async () => {
        if (!heroFile) return;
        setUploadingHero(true);
        const fileExt = heroFile.name.split('.').pop();
        const fileName = `hero-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('ui_media')
            .upload(fileName, heroFile, { upsert: true });

        if (uploadError) {
            alert('Error subiendo imagen: ' + uploadError.message);
            setUploadingHero(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('ui_media')
            .getPublicUrl(fileName);

        setHeroForm({
            ...heroForm,
            image_url: publicUrl
        });
        setHeroFile(null);
        setUploadingHero(false);
    };

    const handleSaveHero = async (e) => {
        e.preventDefault();
        if (!heroForm.image_url) return;
        if (editingHero) {
            const { error } = await supabase
                .from('hero_slides')
                .update({ image_url: heroForm.image_url })
                .eq('id', editingHero.id);
            if (!error) {
                setEditingHero(null);
                setHeroForm({ image_url: '', is_locked: false });
                fetchUiData();
            }
        } else {
            const { error } = await supabase
                .from('hero_slides')
                .insert([{ image_url: heroForm.image_url, is_locked: heroForm.is_locked, order_index: heroSlides.length + 1 }]);
            if (!error) {
                setHeroForm({ image_url: '', is_locked: false });
                fetchUiData();
            }
        }
    };

    const handleDeleteHero = async (item) => {
        if (item.is_locked) {
            alert('Este slide está bloqueado.');
            return;
        }
        if (window.confirm('¿Eliminar esta imagen?')) {
            const { error } = await supabase.from('hero_slides').delete().eq('id', item.id);
            if (!error) fetchUiData();
        }
    };

    const handleUploadHomeOption = async () => {
        if (!homeOptionFile) return;
        setUploadingHomeOption(true);
        const fileExt = homeOptionFile.name.split('.').pop();
        const fileName = `option-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('ui_media')
            .upload(fileName, homeOptionFile, { upsert: true });

        if (uploadError) {
            alert('Error subiendo imagen: ' + uploadError.message);
            setUploadingHomeOption(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('ui_media')
            .getPublicUrl(fileName);

        setHomeOptionForm({
            ...homeOptionForm,
            image_url: publicUrl
        });
        setHomeOptionFile(null);
        setUploadingHomeOption(false);
    };

    const handleSaveHomeOption = async (e) => {
        e.preventDefault();
        if (!homeOptionForm.title || !homeOptionForm.path || !homeOptionForm.image_url) return;
        if (editingHomeOption) {
            const { error } = await supabase
                .from('home_options')
                .update({
                    title: homeOptionForm.title,
                    description: homeOptionForm.description,
                    path: homeOptionForm.path,
                    image_url: homeOptionForm.image_url
                })
                .eq('id', editingHomeOption.id);
            if (!error) {
                setEditingHomeOption(null);
                setHomeOptionForm({ image_url: '', title: '', description: '', path: '', is_locked: false });
                fetchUiData();
            }
        } else {
            const { error } = await supabase
                .from('home_options')
                .insert([{ ...homeOptionForm, order_index: homeOptionsAdmin.length + 1 }]);
            if (!error) {
                setHomeOptionForm({ image_url: '', title: '', description: '', path: '', is_locked: false });
                fetchUiData();
            }
        }
    };

    const handleDeleteHomeOption = async (item) => {
        if (item.is_locked) {
            alert('Esta opción está bloqueada.');
            return;
        }
        if (window.confirm('¿Eliminar esta opción?')) {
            const { error } = await supabase.from('home_options').delete().eq('id', item.id);
            if (!error) fetchUiData();
        }
    };

    // CRÉDITOS CRUD
    const fetchCreditsData = async () => {
        const { data: configData } = await supabase
            .from('credits_config')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        const { data: authorsData } = await supabase
            .from('credits_authors')
            .select('*')
            .order('order_index', { ascending: true });

        setCreditsConfig(configData || null);
        setCreditsAuthors(authorsData || []);

        if (configData) {
            setCreditsConfigForm({
                title: configData.title || '',
                subtitle: configData.subtitle || '',
                license_title: configData.license_title || '',
                license_text: configData.license_text || ''
            });
        }
    };

    const handleSaveCreditsConfig = async (e) => {
        e.preventDefault();
        if (creditsConfig?.id) {
            const { error } = await supabase
                .from('credits_config')
                .update(creditsConfigForm)
                .eq('id', creditsConfig.id);
            if (!error) fetchCreditsData();
        } else {
            const { error } = await supabase.from('credits_config').insert([creditsConfigForm]);
            if (!error) fetchCreditsData();
        }
    };

    const handleUploadCreditsPhoto = async () => {
        if (!creditsFile) return;
        setUploadingCredits(true);
        const fileExt = creditsFile.name.split('.').pop();
        const fileName = `credits-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('credits_media')
            .upload(fileName, creditsFile, { upsert: true });

        if (uploadError) {
            alert('Error subiendo imagen: ' + uploadError.message);
            setUploadingCredits(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('credits_media')
            .getPublicUrl(fileName);

        setCreditsAuthorForm({
            ...creditsAuthorForm,
            photo_url: publicUrl
        });
        setCreditsFile(null);
        setUploadingCredits(false);
    };

    const handleSaveCreditsAuthor = async (e) => {
        e.preventDefault();
        if (!creditsAuthorForm.full_name || !creditsAuthorForm.career) return;
        if (editingCreditsAuthor) {
            const { error } = await supabase
                .from('credits_authors')
                .update(creditsAuthorForm)
                .eq('id', editingCreditsAuthor.id);
            if (!error) {
                setEditingCreditsAuthor(null);
                setCreditsAuthorForm({ full_name: '', career: '', description: '', photo_url: '' });
                fetchCreditsData();
            }
        } else {
            const { error } = await supabase
                .from('credits_authors')
                .insert([{ ...creditsAuthorForm, order_index: creditsAuthors.length + 1 }]);
            if (!error) {
                setCreditsAuthorForm({ full_name: '', career: '', description: '', photo_url: '' });
                fetchCreditsData();
            }
        }
    };

    const handleDeleteCreditsAuthor = async (id) => {
        if (window.confirm('¿Eliminar este autor?')) {
            const { error } = await supabase.from('credits_authors').delete().eq('id', id);
            if (!error) fetchCreditsData();
        }
    };

    // IA Chatbot
    const fetchChatbotConfig = async () => {
        const { data, error } = await supabase
            .from('chatbot_config')
            .select('*')
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (!error) {
            setChatbotConfig(data || null);
            if (data) {
                setChatbotForm({
                    provider: data.provider || 'groq',
                    base_url: data.base_url || '',
                    api_key: data.api_key || '',
                    groq_api_key: data.groq_api_key || '',
                    gemini_api_key: data.gemini_api_key || '',
                    model: data.model || '',
                    system_prompt: data.system_prompt || '',
                    enable_db_context: data.enable_db_context ?? true,
                    enabled: data.enabled ?? true,
                    fallback_enabled: data.fallback_enabled ?? false,
                    primary_provider: data.primary_provider || data.provider || 'groq'
                });
            }
        }
    };

    const fetchAiModels = async () => {
        const { data, error } = await supabase
            .from('ai_models')
            .select('*')
            .order('order_index', { ascending: true });

        if (!error) {
            setAiModels(data || []);
        }
    };

    const handleAddAiModel = async (e) => {
        e.preventDefault();
        if (!aiModelForm.name.trim()) return;

        const { error } = await supabase
            .from('ai_models')
            .insert([{
                provider: aiModelForm.provider,
                name: aiModelForm.name.trim(),
                order_index: aiModels.length + 1,
                is_active: true
            }]);

        if (!error) {
            setAiModelForm({ provider: aiModelForm.provider, name: '' });
            fetchAiModels();
        }
    };

    const fetchChatbotQuestions = async () => {
        setChatbotQuestionsLoading(true);
        const { data, error } = await supabase
            .from('chatbot_questions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(200);

        if (!error) {
            setChatbotQuestions(data || []);
        }
        setChatbotQuestionsLoading(false);
    };

    const handleDeleteChatbotQuestion = async (id) => {
        const { error } = await supabase.from('chatbot_questions').delete().eq('id', id);
        if (!error) fetchChatbotQuestions();
    };

    const handleClearChatbotQuestions = async () => {
        if (!window.confirm('¿Eliminar todas las preguntas?')) return;
        const { error } = await supabase.from('chatbot_questions').delete().neq('id', 0);
        if (!error) fetchChatbotQuestions();
    };

    const fetchStorageUsage = async () => {
        setStorageLoading(true);
        // Primero refrescar los datos calculando el uso actual
        const { data: refreshed, error: refreshErr } = await supabase.rpc('refresh_storage_usage');
        if (!refreshErr && refreshed) {
            setStorageUsage(refreshed);
        } else {
            // Fallback: leer del cache
            const { data, error } = await supabase.rpc('get_storage_usage_overview');
            if (!error) {
                setStorageUsage(data || null);
            }
        }
        setStorageLoading(false);
    };

    const toggleGmailGrade = (grade) => {
        setGmailForm((prev) => {
            const exists = prev.grados.includes(grade);
            const grados = exists ? prev.grados.filter((g) => g !== grade) : [...prev.grados, grade];
            return { ...prev, grados };
        });
    };

    const toggleGmailGroup = (group) => {
        setGmailForm((prev) => {
            const exists = prev.grupos.includes(group);
            const grupos = exists ? prev.grupos.filter((g) => g !== group) : [...prev.grupos, group];
            return { ...prev, grupos };
        });
    };

    const base64UrlEncode = (str) => {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(str);
        let binary = '';
        bytes.forEach((b) => { binary += String.fromCharCode(b); });
        return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
    };

    const encodeSubject = (subject = '') => {
        if (!subject) return '';
        try {
            const encoder = new TextEncoder();
            const bytes = encoder.encode(subject);
            let binary = '';
            bytes.forEach((b) => { binary += String.fromCharCode(b); });
            return `=?UTF-8?B?${btoa(binary)}?=`;
        } catch {
            return subject;
        }
    };

    const buildRawMessage = ({ from, recipients, subject, html, text }) => {
        const contentType = html ? 'text/html; charset="UTF-8"' : 'text/plain; charset="UTF-8"';
        const body = html || text || '';
        const fromHeader = from ? `"CBTa 134" <${from}>` : 'me';
        
        // Usar el primer destinatario como "To" y el resto como "Bcc"
        const toRecipient = recipients && recipients.length > 0 ? recipients[0] : '';
        const bccRecipients = recipients && recipients.length > 1 ? recipients.slice(1) : [];
        
        const headers = [
            `From: ${fromHeader}`,
            `To: ${toRecipient}`,
            bccRecipients.length > 0 ? `Bcc: ${bccRecipients.join(', ')}` : null,
            `Subject: ${encodeSubject(subject || '')}`,
            'MIME-Version: 1.0',
            `Content-Type: ${contentType}`
        ].filter(Boolean).join('\r\n');
        
        // El mensaje requiere una línea en blanco entre headers y body
        const rawMessage = headers + '\r\n\r\n' + body;
        return base64UrlEncode(rawMessage);
    };

    const getRecipientEmails = (currentUserId, senderEmail) => {
        let filtered = students;

        if (!gmailForm.sendToAll) {
            if (gmailForm.grados.length) {
                filtered = filtered.filter((s) => gmailForm.grados.includes(Number(s.grado)));
            }
            if (gmailForm.grupos.length) {
                const selectedGroups = gmailForm.grupos.map((g) => String(g).toUpperCase());
                filtered = filtered.filter((s) => selectedGroups.includes(String(s.grupo || '').toUpperCase()));
            }
        }

        if (currentUserId) {
            filtered = filtered.filter((s) => s.id !== currentUserId);
        }

        const rawEmails = filtered
            .map((s) => s.email || s.correo || s.email_address)
            .map((email) => (email ? String(email).trim() : ''))
            .filter((email) => !!email);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let validEmails = rawEmails.filter((email) => emailRegex.test(email));

        if (senderEmail) {
            const senderLower = senderEmail.toLowerCase();
            validEmails = validEmails.filter((email) => email.toLowerCase() !== senderLower);
        }
        const invalidEmailsCount = rawEmails.length - validEmails.length;

        return {
            emails: [...new Set(validEmails)],
            filteredCount: filtered.length,
            missingEmailsCount: filtered.length - rawEmails.length,
            invalidEmailsCount
        };
    };

    const chunk = (arr, size) => {
        const out = [];
        for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
        return out;
    };

    const sendGmailNotifications = async () => {
        setGmailStatus(null);
        
        // Verificar que tenemos el token de Gmail
        if (!providerToken) {
            setGmailStatus({ 
                type: 'error', 
                message: 'Gmail no está conectado. Cierra sesión e inicia sesión nuevamente con Google para autorizar Gmail.' 
            });
            return;
        }
        
        if (!gmailForm.subject || (!gmailForm.messageHtml && !gmailForm.messageText)) {
            setGmailStatus({ type: 'error', message: 'Escribe un asunto y contenido.' });
            return;
        }

        setGmailSending(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const senderEmailRaw = (gmailEmail || session?.user?.email || user?.email || localStorage.getItem('gmail_user_email') || '').trim();
            const { emails: recipients, filteredCount, missingEmailsCount, invalidEmailsCount } = getRecipientEmails(session?.user?.id || user?.id, senderEmailRaw);
            const safeRecipients = recipients;

            if (!safeRecipients.length) {
                const hint = filteredCount
                    ? `Se encontraron ${filteredCount} alumnos, ${missingEmailsCount} sin correo y ${invalidEmailsCount} con correo inválido.`
                    : 'No hay alumnos que coincidan con el filtro seleccionado.';
                const extra = senderEmailRaw ? ' El correo del maestro fue excluido.' : '';
                throw new Error(`No hay correos disponibles. ${hint}${extra}`);
            }

            const batches = chunk(safeRecipients, 40);

            for (const recipientBatch of batches) {
                const raw = buildRawMessage({
                    from: senderEmailRaw || undefined,
                    subject: gmailForm.subject,
                    html: gmailForm.messageHtml || undefined,
                    text: gmailForm.messageText || undefined,
                    recipients: recipientBatch
                });

                const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${providerToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ raw })
                });

                if (!res.ok) {
                    const errorText = await res.text().catch(() => '');
                    console.error('Gmail API error:', res.status, errorText);
                    if (res.status === 401 || res.status === 403) {
                        setGmailConnected(false);
                        setProviderToken(null);
                        localStorage.removeItem('gmail_provider_token');
                        localStorage.removeItem('gmail_user_email');
                        throw new Error('El token de Gmail no es válido o no tiene permisos. Cierra sesión e inicia sesión nuevamente con Google.');
                    }
                    let errMessage = 'Error al enviar correos.';
                    try {
                        const errData = JSON.parse(errorText || '{}');
                        errMessage = errData?.error?.message || errMessage;
                    } catch {
                        if (errorText) errMessage = errorText;
                    }
                    throw new Error(errMessage);
                }
            }

            setGmailStatus({ type: 'success', message: `✅ Enviados ${safeRecipients.length} correos en ${batches.length} lote(s).` });
            // Limpiar formulario después de enviar
            setGmailForm({ ...gmailForm, subject: '', messageHtml: '', messageText: '' });
        } catch (err) {
            setGmailStatus({ type: 'error', message: err.message || 'Error al enviar correos.' });
        } finally {
            setGmailSending(false);
        }
    };

    const formatBytes = (bytes = 0) => {
        if (!bytes) return '0 B';
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    };

    const getChatbotBaseUrl = (provider, customBaseUrl) => {
        if (customBaseUrl) return customBaseUrl.replace(/\/$/, '');
        if (provider === 'gemini') return 'https://generativelanguage.googleapis.com/v1beta';
        return 'https://api.groq.com/openai/v1';
    };

    const runChatbotTest = async (e) => {
        e.preventDefault();
        if (!chatbotTestInput.trim()) return;

        setChatbotTestLoading(true);
        setChatbotTestResponse('');

        try {
            const provider = (chatbotForm.provider || 'groq').toLowerCase();
            const primaryProvider = (chatbotForm.primary_provider || provider).toLowerCase();
            const fallbackEnabled = chatbotForm.fallback_enabled === true;
            const secondaryProvider = primaryProvider === 'groq' ? 'gemini' : 'groq';

            const getKey = (prov) => {
                if (prov === 'groq') return chatbotForm.groq_api_key || chatbotForm.api_key || '';
                if (prov === 'gemini') return chatbotForm.gemini_api_key || chatbotForm.api_key || '';
                return chatbotForm.api_key || '';
            };

            const callProvider = async (prov) => {
                const key = getKey(prov);
                if (!key) {
                    throw new Error(`Falta configurar la API key para ${prov}.`);
                }

                const baseUrl = getChatbotBaseUrl(prov, chatbotForm.base_url || '');
                const model = chatbotForm.model || (prov === 'gemini' ? 'gemini-3.0-flash' : 'llama-3.1-8b-instant');

                let contextText = '';
                if (chatbotForm.enable_db_context) {
                    const { data, error } = await supabase.rpc('get_chatbot_context');
                    if (!error) {
                        contextText = JSON.stringify(data || {}, null, 2);
                    }
                }

                const systemPrompt = (chatbotForm.system_prompt || ChatbotPrompt).trim();
                const fullSystemPrompt = contextText
                    ? `${systemPrompt}\n\nContexto de la base de datos (JSON):\n${contextText}`
                    : systemPrompt;

                if (prov === 'gemini') {
                    const apiUrl = `${baseUrl}/models/${model}:generateContent?key=${key}`;
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: `${fullSystemPrompt}\n\nUsuario: ${chatbotTestInput}`
                                }]
                            }]
                        })
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(errorText);
                    }

                    const data = await response.json();
                    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta.';
                }

                const apiUrl = `${baseUrl}/chat/completions`;
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${key}`
                    },
                    body: JSON.stringify({
                        model,
                        messages: [
                            { role: 'system', content: fullSystemPrompt },
                            { role: 'user', content: chatbotTestInput }
                        ],
                        temperature: 0.3
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }

                const data = await response.json();
                return data.choices?.[0]?.message?.content || 'Sin respuesta.';
            };

            let responseText = '';
            try {
                responseText = await callProvider(fallbackEnabled ? primaryProvider : provider);
            } catch (primaryError) {
                if (fallbackEnabled) {
                    responseText = await callProvider(secondaryProvider);
                } else {
                    throw primaryError;
                }
            }

            setChatbotTestResponse(responseText);
        } catch (error) {
            setChatbotTestResponse(`Error: ${error.message}`);
        }

        setChatbotTestLoading(false);
    };

    const handleSaveChatbotConfig = async (e) => {
        e.preventDefault();
        setChatbotSaving(true);

        const payload = {
            provider: chatbotForm.provider,
            base_url: chatbotForm.base_url || null,
            api_key: chatbotForm.api_key,
            groq_api_key: chatbotForm.groq_api_key,
            gemini_api_key: chatbotForm.gemini_api_key,
            model: chatbotForm.model,
            system_prompt: chatbotForm.system_prompt,
            enable_db_context: chatbotForm.enable_db_context,
            enabled: chatbotForm.enabled,
            fallback_enabled: chatbotForm.fallback_enabled,
            primary_provider: chatbotForm.primary_provider,
            updated_at: new Date().toISOString(),
            created_by: chatbotConfig?.created_by || user?.id || null
        };

        if (chatbotConfig?.id) {
            const { error } = await supabase
                .from('chatbot_config')
                .update(payload)
                .eq('id', chatbotConfig.id);
            if (!error) await fetchChatbotConfig();
        } else {
            const { error } = await supabase
                .from('chatbot_config')
                .insert([payload]);
            if (!error) await fetchChatbotConfig();
        }

        setChatbotSaving(false);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const handleLogout = async () => {
        // Limpiar token de Gmail
        localStorage.removeItem('gmail_provider_token');
        localStorage.removeItem('gmail_user_email');
        await supabase.auth.signOut();
        navigate('/maestros');
    };

    const checkGmailStatus = async () => {
        setGmailChecking(true);
        try {
            // Primero intentar obtener token de localStorage (guardado al hacer login)
            let tokenToVerify = localStorage.getItem('gmail_provider_token');
            let emailFromStorage = localStorage.getItem('gmail_user_email');
            
            // Si no hay en localStorage, intentar de la sesión actual
            if (!tokenToVerify) {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.provider_token) {
                    tokenToVerify = session.provider_token;
                    emailFromStorage = session.user?.email || '';
                    // Guardar para uso futuro
                    localStorage.setItem('gmail_provider_token', tokenToVerify);
                    localStorage.setItem('gmail_user_email', emailFromStorage);
                }
            }
            
            if (!tokenToVerify) {
                setGmailConnected(false);
                setProviderToken(null);
                setGmailEmail(null);
                setGmailStatus({ 
                    type: 'error', 
                    message: 'No hay acceso a Gmail. Cierra sesión e inicia sesión nuevamente con Google para autorizar Gmail.' 
                });
                return;
            }
            
            // Validar el token y sus scopes con tokeninfo (no requiere Gmail scope)
            const res = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${encodeURIComponent(tokenToVerify)}`);
            
            if (res.ok) {
                const tokenInfo = await res.json();
                const scopeText = tokenInfo?.scope || '';
                const hasGmailSend = scopeText.includes('https://www.googleapis.com/auth/gmail.send');

                if (!hasGmailSend) {
                    // Token válido pero sin permiso Gmail
                    localStorage.removeItem('gmail_provider_token');
                    localStorage.removeItem('gmail_user_email');
                    setGmailConnected(false);
                    setProviderToken(null);
                    setGmailEmail(null);
                    setGmailStatus({
                        type: 'error',
                        message: 'Tu sesión de Google no tiene permisos de Gmail. Cierra sesión y vuelve a iniciar con Google para autorizar Gmail.'
                    });
                    return;
                }

                const email = tokenInfo?.email || emailFromStorage;
                setGmailConnected(true);
                setProviderToken(tokenToVerify);
                setGmailEmail(email);
                setGmailStatus({ type: 'success', message: `Gmail conectado como ${email || 'tu cuenta'}` });
            } else {
                const reason = 'invalid_token';
                // Token inválido, limpiar localStorage
                localStorage.removeItem('gmail_provider_token');
                localStorage.removeItem('gmail_user_email');
                setGmailConnected(false);
                setProviderToken(null);
                setGmailEmail(null);

                setGmailStatus({ 
                    type: 'error', 
                    message: 'El token de Gmail ha expirado. Cierra sesión e inicia sesión nuevamente.' 
                });
            }
        } catch (err) {
            setGmailConnected(false);
            setProviderToken(null);
            setGmailStatus({ type: 'error', message: 'Error al verificar Gmail: ' + (err.message || 'desconocido') });
        } finally {
            setGmailChecking(false);
        }
    };

    const refreshGmailCredentials = async () => {
        // Para renovar permisos de Gmail, hay que volver a iniciar sesión
        if (window.confirm('Para conectar/reconectar Gmail, necesitas cerrar sesión e iniciar sesión nuevamente con Google. ¿Deseas continuar?')) {
            // Limpiar token guardado
            localStorage.removeItem('gmail_provider_token');
            localStorage.removeItem('gmail_user_email');
            setProviderToken(null);
            setGmailEmail(null);
            setGmailConnected(false);
            await supabase.auth.signOut();
            handleGoogleLogin();
        }
    };



    if (loading) return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
    );

    if (!user) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
                <div className={`p-8 rounded-3xl shadow-xl max-w-md w-full mx-4 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                    <div className="text-center mb-8">
                        <div className="bg-blue-800 p-3 rounded-2xl inline-block mb-4">
                            <span className="material-symbols-outlined text-white text-3xl">school</span>
                        </div>
                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Acceso Administrativo</h2>
                        <p className={`mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Inicia sesión para gestionar alumnos y publicaciones.</p>
                    </div>
                    <button 
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-6 h-6" />
                        <span className="font-semibold text-slate-700">Entrar como Maestro</span>
                    </button>
                    <button 
                        onClick={() => navigate('/maestros')}
                        className="w-full mt-4 py-3 text-slate-500 hover:text-slate-700 transition-colors font-medium"
                    >
                        ← Regresar
                    </button>
                </div>
            </div>
        );
    }

    // Pantalla de cuenta no permitida
    if (user && accountNotAllowed) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
                <div className={`p-8 rounded-3xl shadow-xl max-w-md w-full mx-4 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                    <div className="text-center mb-6">
                        <div className="bg-red-500 p-3 rounded-2xl inline-block mb-4">
                            <span className="material-symbols-outlined text-white text-3xl">block</span>
                        </div>
                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Acceso Denegado</h2>
                        <p className={`mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Tu cuenta no tiene permiso para acceder al EduPanel.
                        </p>
                        <div className={`mt-4 p-3 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                            <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                Cuenta: <strong>{user.email}</strong>
                            </p>
                        </div>
                        <p className={`mt-4 text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            Contacta al administrador para solicitar acceso.
                        </p>
                    </div>
                    
                    <div className="flex gap-2">
                        <button 
                            onClick={async () => {
                                await supabase.auth.signOut();
                                setAccountNotAllowed(false);
                            }}
                            className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                        <button 
                            onClick={() => navigate('/maestros')}
                            className="flex-1 py-3 text-slate-500 hover:text-slate-700 transition-colors font-medium border rounded-xl"
                        >
                            ← Regresar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Pantalla de verificación de código de seguridad
    if (user && !securityVerified) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
                <div className={`p-8 rounded-3xl shadow-xl max-w-md w-full mx-4 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                    <div className="text-center mb-6">
                        <div className="bg-orange-500 p-3 rounded-2xl inline-block mb-4">
                            <span className="material-symbols-outlined text-white text-3xl">lock</span>
                        </div>
                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Verificación de Seguridad</h2>
                        <p className={`mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Ingresa el código de acceso para maestros.
                        </p>
                        <p className={`mt-1 text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            Sesión iniciada como: <strong>{user.email}</strong>
                        </p>
                    </div>
                    
                    <form onSubmit={verifySecurityCode} className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                Usuario
                            </label>
                            <input
                                type="text"
                                value={securityForm.user}
                                onChange={(e) => setSecurityForm({ ...securityForm, user: e.target.value })}
                                className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`}
                                placeholder="Usuario de seguridad"
                                required
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                Contraseña
                            </label>
                            <input
                                type="password"
                                value={securityForm.password}
                                onChange={(e) => setSecurityForm({ ...securityForm, password: e.target.value })}
                                className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`}
                                placeholder="Contraseña de seguridad"
                                required
                            />
                        </div>
                        
                        {securityError && (
                            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {securityError}
                            </div>
                        )}
                        
                        <button
                            type="submit"
                            disabled={securityLoading}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {securityLoading ? 'Verificando...' : 'Verificar Acceso'}
                        </button>
                    </form>
                    
                    <div className="mt-4 flex gap-2">
                        <button 
                            onClick={async () => {
                                sessionStorage.removeItem('maestro_security_verified');
                                await supabase.auth.signOut();
                            }}
                            className="flex-1 py-3 text-slate-500 hover:text-slate-700 transition-colors font-medium text-sm"
                        >
                            Cerrar Sesión
                        </button>
                        <button 
                            onClick={() => navigate('/maestros')}
                            className="flex-1 py-3 text-slate-500 hover:text-slate-700 transition-colors font-medium text-sm"
                        >
                            ← Regresar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
            {/* Mobile Header */}
            <header className={`lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-b`}>
                <div className="flex items-center gap-2">
                    <div className="bg-blue-800 p-1.5 rounded-lg">
                        <span className="material-symbols-outlined text-white text-xl">school</span>
                    </div>
                    <h1 className={`text-lg font-bold tracking-tight ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>EduPanel</h1>
                </div>
                <button 
                    className={`p-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </header>

            {/* Overlay para móvil cuando sidebar está abierto */}
            {sidebarOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-64 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-r transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col overflow-hidden`}>
                <div className="p-6 hidden lg:block flex-shrink-0">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-blue-800 p-2 rounded-lg">
                            <span className="material-symbols-outlined text-white">school</span>
                        </div>
                        <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>EduPanel</h1>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4 lg:mt-0 overflow-y-auto overscroll-contain pb-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <button
                        onClick={() => { setActiveNav('dashboard'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeNav === 'dashboard' 
                            ? (darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-800') 
                            : (darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}
                    >
                        <span className="material-symbols-outlined">dashboard</span> Panel Principal
                    </button>
                    <button
                        onClick={() => { setActiveNav('alumnos'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeNav === 'alumnos' 
                            ? (darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-800') 
                            : (darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}
                    >
                        <span className="material-symbols-outlined">group</span> Alumnos
                    </button>
                    <button
                        onClick={() => { setActiveNav('avisos'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeNav === 'avisos' 
                            ? (darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-800') 
                            : (darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}
                    >
                        <span className="material-symbols-outlined">campaign</span> Avisos
                    </button>
                    <button
                        onClick={() => { setActiveNav('clubes'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeNav === 'clubes' 
                            ? (darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-800') 
                            : (darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}
                    >
                        <span className="material-symbols-outlined">sports_esports</span> Clubes
                    </button>
                    <button
                        onClick={() => { setActiveNav('carreras'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeNav === 'carreras' 
                            ? (darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-800') 
                            : (darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}
                    >
                        <span className="material-symbols-outlined">engineering</span> Carreras
                    </button>
                    <button
                        onClick={() => { setActiveNav('maestros'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeNav === 'maestros' 
                            ? (darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-800') 
                            : (darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}
                    >
                        <span className="material-symbols-outlined">co_present</span> Maestros
                    </button>
                    <button
                        onClick={() => { setActiveNav('admission'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeNav === 'admission' 
                            ? (darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-800') 
                            : (darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}
                    >
                        <span className="material-symbols-outlined">assignment</span> Admisión
                    </button>
                    <button
                        onClick={() => { setActiveNav('baetam'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeNav === 'baetam' 
                            ? (darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-800') 
                            : (darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}
                    >
                        <span className="material-symbols-outlined">school</span> BAETAM
                    </button>
                    <button
                        onClick={() => { setActiveNav('contacto'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeNav === 'contacto' 
                            ? (darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-800') 
                            : (darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}
                    >
                        <span className="material-symbols-outlined">contact_mail</span> Contacto
                    </button>
                    <button
                        onClick={() => { setActiveNav('about'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeNav === 'about' 
                            ? (darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-800') 
                            : (darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}
                    >
                        <span className="material-symbols-outlined">info</span> Acerca
                    </button>
                    <button
                        onClick={() => { setActiveNav('gallery'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeNav === 'gallery' 
                            ? (darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-800') 
                            : (darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}
                    >
                        <span className="material-symbols-outlined">photo_library</span> Galería
                    </button>
                    <button
                        onClick={() => { setActiveNav('ui'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeNav === 'ui' 
                            ? (darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-800') 
                            : (darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}
                    >
                        <span className="material-symbols-outlined">dashboard_customize</span> Interfaz
                    </button>
                    <button
                        onClick={() => { setActiveNav('creditos'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeNav === 'creditos' 
                            ? (darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-800') 
                            : (darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}
                    >
                        <span className="material-symbols-outlined">badge</span> Créditos
                    </button>
                    <button
                        onClick={() => { setActiveNav('chatbot'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeNav === 'chatbot' 
                            ? (darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-800') 
                            : (darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}
                    >
                        <span className="material-symbols-outlined">smart_toy</span> IA Chatbot
                    </button>
                    <button
                        onClick={() => { setActiveNav('gmail'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeNav === 'gmail' 
                            ? (darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-800') 
                            : (darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}
                    >
                        <span className="material-symbols-outlined">mail</span> Notificaciones Gmail
                    </button>
                    <button
                        onClick={() => { setActiveNav('storage'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeNav === 'storage' 
                            ? (darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-800') 
                            : (darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}
                    >
                        <span className="material-symbols-outlined">storage</span> Almacenamiento
                    </button>
                    <button
                        onClick={() => { setActiveNav('access'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeNav === 'access' 
                            ? (darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-800') 
                            : (darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}
                    >
                        <span className="material-symbols-outlined">security</span> Acceso a la Página
                    </button>
                </nav>

                <div className={`p-4 border-t flex-shrink-0 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <button 
                        onClick={toggleDarkMode}
                        className={`w-full flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                    >
                        <span className="text-sm font-medium">Modo Oscuro</span>
                        <span className="material-symbols-outlined">dark_mode</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className={`w-full mt-2 flex items-center justify-center gap-2 p-3 rounded-xl ${darkMode ? 'bg-red-900/30 text-red-300 hover:bg-red-900/40' : 'bg-red-50 text-red-600 hover:bg-red-100'} transition-colors`}
                    >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        <span className="text-sm font-medium">Cerrar sesión</span>
                    </button>
                    <button 
                        onClick={() => navigate('/maestros')}
                        className={`w-full mt-2 flex items-center justify-center gap-2 p-3 rounded-xl ${darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'} transition-colors`}
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        <span className="text-sm font-medium">Regresar</span>
                    </button>
                </div>
            </aside>

            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="lg:ml-64 p-4 md:p-8 lg:p-10 min-h-screen">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h2 className={`text-2xl md:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Panel Docente</h2>
                        <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>
                            Bienvenido, <span className={`font-bold ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>{profile?.nombre || 'Maestro'}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 md:flex-none">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input 
                                type="text"
                                placeholder="Buscar..."
                                className={`w-full md:w-64 pl-10 pr-4 py-2.5 border-none rounded-2xl shadow-sm ring-1 ${darkMode ? 'bg-slate-800 ring-slate-700 text-white' : 'bg-white ring-slate-200'} focus:ring-2 focus:ring-blue-800 transition-all`}
                            />
                        </div>
                        <button className="bg-blue-800 text-white p-2.5 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none hover:opacity-90 transition-opacity">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                    </div>
                </div>

                {activeNav === 'admission' && (
                    <div className="max-w-6xl mx-auto space-y-10">
                        <section>
                            <div className={`rounded-[2rem] p-6 md:p-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-800">assignment</span> Configuración de Admisión
                                </h3>
                                <form onSubmit={handleSaveAdmissionConfig} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="date"
                                        value={admissionConfigForm.target_date}
                                        onChange={(e) => setAdmissionConfigForm({ ...admissionConfigForm, target_date: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Mensaje del contador"
                                        value={admissionConfigForm.countdown_message}
                                        onChange={(e) => setAdmissionConfigForm({ ...admissionConfigForm, countdown_message: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Título de cabecera"
                                        value={admissionConfigForm.header_title}
                                        onChange={(e) => setAdmissionConfigForm({ ...admissionConfigForm, header_title: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Subtítulo de cabecera"
                                        value={admissionConfigForm.header_subtitle}
                                        onChange={(e) => setAdmissionConfigForm({ ...admissionConfigForm, header_subtitle: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <div className="md:col-span-2">
                                        <button type="submit" className="px-6 py-3 bg-blue-800 text-white font-bold rounded-xl">Guardar Configuración</button>
                                    </div>
                                </form>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className={`rounded-[2rem] p-6 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                                <h3 className="text-lg font-bold mb-4">Fechas Importantes</h3>
                                <form onSubmit={handleSaveAdmissionDate} className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Título"
                                        value={admissionDateForm.title}
                                        onChange={(e) => setAdmissionDateForm({ ...admissionDateForm, title: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Rango de fecha"
                                        value={admissionDateForm.date_range}
                                        onChange={(e) => setAdmissionDateForm({ ...admissionDateForm, date_range: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Subtítulo"
                                        value={admissionDateForm.subtitle}
                                        onChange={(e) => setAdmissionDateForm({ ...admissionDateForm, subtitle: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <button type="submit" className="px-5 py-2.5 bg-blue-800 text-white font-semibold rounded-xl">
                                        {editingAdmissionDate ? 'Actualizar' : 'Agregar'}
                                    </button>
                                </form>
                                <div className="mt-4 space-y-2">
                                    {admissionDates.map((item) => (
                                        <div key={item.id} className={`p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                            <div>
                                                <div className="font-semibold">{item.title}</div>
                                                <div className="text-xs text-slate-500">{item.date_range} • {item.subtitle}</div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => { setEditingAdmissionDate(item); setAdmissionDateForm({ title: item.title, date_range: item.date_range, subtitle: item.subtitle }); }} className="text-blue-500">Editar</button>
                                                <button onClick={() => handleDeleteAdmissionDate(item.id)} className="text-red-500">Eliminar</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={`rounded-[2rem] p-6 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                                <h3 className="text-lg font-bold mb-4">Requisitos</h3>
                                <form onSubmit={handleSaveAdmissionRequirement} className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Requisito"
                                        value={admissionRequirementForm.requirement}
                                        onChange={(e) => setAdmissionRequirementForm({ requirement: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <button type="submit" className="px-5 py-2.5 bg-blue-800 text-white font-semibold rounded-xl">
                                        {editingAdmissionRequirement ? 'Actualizar' : 'Agregar'}
                                    </button>
                                </form>
                                <div className="mt-4 space-y-2">
                                    {admissionRequirements.map((item) => (
                                        <div key={item.id} className={`p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                            <div className="font-semibold">{item.requirement}</div>
                                            <div className="flex gap-2">
                                                <button onClick={() => { setEditingAdmissionRequirement(item); setAdmissionRequirementForm({ requirement: item.requirement }); }} className="text-blue-500">Editar</button>
                                                <button onClick={() => handleDeleteAdmissionRequirement(item.id)} className="text-red-500">Eliminar</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className={`rounded-[2rem] p-6 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                            <h3 className="text-lg font-bold mb-4">Especialidades</h3>
                            <form onSubmit={handleSaveAdmissionSpecialty} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <input
                                    type="text"
                                    placeholder="Emoji"
                                    value={admissionSpecialtyForm.emoji}
                                    onChange={(e) => setAdmissionSpecialtyForm({ ...admissionSpecialtyForm, emoji: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={admissionSpecialtyForm.name}
                                    onChange={(e) => setAdmissionSpecialtyForm({ ...admissionSpecialtyForm, name: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Descripción"
                                    value={admissionSpecialtyForm.description}
                                    onChange={(e) => setAdmissionSpecialtyForm({ ...admissionSpecialtyForm, description: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <div className="md:col-span-3">
                                    <button type="submit" className="px-5 py-2.5 bg-blue-800 text-white font-semibold rounded-xl">
                                        {editingAdmissionSpecialty ? 'Actualizar' : 'Agregar'}
                                    </button>
                                </div>
                            </form>
                            <div className="mt-4 space-y-2">
                                {admissionSpecialties.map((item) => (
                                    <div key={item.id} className={`p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                        <div>
                                            <div className="font-semibold">{item.emoji} {item.name}</div>
                                            <div className="text-xs text-slate-500">{item.description}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingAdmissionSpecialty(item); setAdmissionSpecialtyForm({ emoji: item.emoji, name: item.name, description: item.description }); }} className="text-blue-500">Editar</button>
                                            <button onClick={() => handleDeleteAdmissionSpecialty(item.id)} className="text-red-500">Eliminar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className={`rounded-[2rem] p-6 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                            <h3 className="text-lg font-bold mb-4">Contacto</h3>
                            <form onSubmit={handleSaveAdmissionContact} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Dirección"
                                    value={admissionContactForm.address}
                                    onChange={(e) => setAdmissionContactForm({ ...admissionContactForm, address: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Etiqueta Teléfono"
                                    value={admissionContactForm.phone_label}
                                    onChange={(e) => setAdmissionContactForm({ ...admissionContactForm, phone_label: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Teléfono"
                                    value={admissionContactForm.phone_value}
                                    onChange={(e) => setAdmissionContactForm({ ...admissionContactForm, phone_value: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Etiqueta Correo"
                                    value={admissionContactForm.email_label}
                                    onChange={(e) => setAdmissionContactForm({ ...admissionContactForm, email_label: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Correo"
                                    value={admissionContactForm.email_value}
                                    onChange={(e) => setAdmissionContactForm({ ...admissionContactForm, email_value: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Etiqueta Sitio Web"
                                    value={admissionContactForm.website_label}
                                    onChange={(e) => setAdmissionContactForm({ ...admissionContactForm, website_label: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Sitio Web"
                                    value={admissionContactForm.website_value}
                                    onChange={(e) => setAdmissionContactForm({ ...admissionContactForm, website_value: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Horario"
                                    value={admissionContactForm.schedule}
                                    onChange={(e) => setAdmissionContactForm({ ...admissionContactForm, schedule: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <div className="md:col-span-2">
                                    <button type="submit" className="px-6 py-3 bg-blue-800 text-white font-bold rounded-xl">Guardar Contacto</button>
                                </div>
                            </form>
                        </section>
                    </div>
                )}

                {activeNav === 'baetam' && (
                    <div className="max-w-6xl mx-auto space-y-10">
                        <section>
                            <div className={`rounded-[2rem] p-6 md:p-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-800">school</span> Configuración BAETAM
                                </h3>
                                <form onSubmit={handleSaveBaetamConfig} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="URL imagen principal"
                                        value={baetamConfigForm.hero_image_url}
                                        onChange={(e) => setBaetamConfigForm({ ...baetamConfigForm, hero_image_url: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Título"
                                        value={baetamConfigForm.title}
                                        onChange={(e) => setBaetamConfigForm({ ...baetamConfigForm, title: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Subtítulo"
                                        value={baetamConfigForm.subtitle}
                                        onChange={(e) => setBaetamConfigForm({ ...baetamConfigForm, subtitle: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="date"
                                        value={baetamConfigForm.target_date}
                                        onChange={(e) => setBaetamConfigForm({ ...baetamConfigForm, target_date: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Texto contador"
                                        value={baetamConfigForm.countdown_label}
                                        onChange={(e) => setBaetamConfigForm({ ...baetamConfigForm, countdown_label: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Texto fecha contador"
                                        value={baetamConfigForm.countdown_date_text}
                                        onChange={(e) => setBaetamConfigForm({ ...baetamConfigForm, countdown_date_text: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Título inscripciones"
                                        value={baetamConfigForm.inscriptions_title}
                                        onChange={(e) => setBaetamConfigForm({ ...baetamConfigForm, inscriptions_title: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Título periodo inscripciones"
                                        value={baetamConfigForm.inscriptions_period_title}
                                        onChange={(e) => setBaetamConfigForm({ ...baetamConfigForm, inscriptions_period_title: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Descripción periodo inscripciones"
                                        value={baetamConfigForm.inscriptions_period_description}
                                        onChange={(e) => setBaetamConfigForm({ ...baetamConfigForm, inscriptions_period_description: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Título requisitos"
                                        value={baetamConfigForm.requirements_title}
                                        onChange={(e) => setBaetamConfigForm({ ...baetamConfigForm, requirements_title: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Título ventajas"
                                        value={baetamConfigForm.advantages_title}
                                        onChange={(e) => setBaetamConfigForm({ ...baetamConfigForm, advantages_title: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Título contacto"
                                        value={baetamConfigForm.contact_title}
                                        onChange={(e) => setBaetamConfigForm({ ...baetamConfigForm, contact_title: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Descripción contacto"
                                        value={baetamConfigForm.contact_description}
                                        onChange={(e) => setBaetamConfigForm({ ...baetamConfigForm, contact_description: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <div className="md:col-span-2">
                                        <button type="submit" className="px-6 py-3 bg-blue-800 text-white font-bold rounded-xl">Guardar BAETAM</button>
                                    </div>
                                </form>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className={`rounded-[2rem] p-6 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                                <h3 className="text-lg font-bold mb-4">Tarjetas Informativas</h3>
                                <form onSubmit={handleSaveBaetamInfo} className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Título"
                                        value={baetamInfoForm.title}
                                        onChange={(e) => setBaetamInfoForm({ ...baetamInfoForm, title: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Descripción"
                                        value={baetamInfoForm.description}
                                        onChange={(e) => setBaetamInfoForm({ ...baetamInfoForm, description: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <button type="submit" className="px-5 py-2.5 bg-blue-800 text-white font-semibold rounded-xl">
                                        {editingBaetamInfo ? 'Actualizar' : 'Agregar'}
                                    </button>
                                </form>
                                <div className="mt-4 space-y-2">
                                    {baetamInfoCards.map((item) => (
                                        <div key={item.id} className={`p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                            <div>
                                                <div className="font-semibold">{item.title}</div>
                                                <div className="text-xs text-slate-500">{item.description}</div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => { setEditingBaetamInfo(item); setBaetamInfoForm({ title: item.title, description: item.description }); }} className="text-blue-500">Editar</button>
                                                <button onClick={() => handleDeleteBaetamInfo(item.id)} className="text-red-500">Eliminar</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={`rounded-[2rem] p-6 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                                <h3 className="text-lg font-bold mb-4">Requisitos</h3>
                                <form onSubmit={handleSaveBaetamRequirement} className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Icono (emoji)"
                                        value={baetamRequirementForm.icon}
                                        onChange={(e) => setBaetamRequirementForm({ ...baetamRequirementForm, icon: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Texto"
                                        value={baetamRequirementForm.text}
                                        onChange={(e) => setBaetamRequirementForm({ ...baetamRequirementForm, text: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <button type="submit" className="px-5 py-2.5 bg-blue-800 text-white font-semibold rounded-xl">
                                        {editingBaetamRequirement ? 'Actualizar' : 'Agregar'}
                                    </button>
                                </form>
                                <div className="mt-4 space-y-2">
                                    {baetamRequirements.map((item) => (
                                        <div key={item.id} className={`p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                            <div className="font-semibold">{item.icon} {item.text}</div>
                                            <div className="flex gap-2">
                                                <button onClick={() => { setEditingBaetamRequirement(item); setBaetamRequirementForm({ icon: item.icon, text: item.text }); }} className="text-blue-500">Editar</button>
                                                <button onClick={() => handleDeleteBaetamRequirement(item.id)} className="text-red-500">Eliminar</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className={`rounded-[2rem] p-6 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                                <h3 className="text-lg font-bold mb-4">Ventajas</h3>
                                <form onSubmit={handleSaveBaetamAdvantage} className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Título"
                                        value={baetamAdvantageForm.title}
                                        onChange={(e) => setBaetamAdvantageForm({ ...baetamAdvantageForm, title: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Descripción"
                                        value={baetamAdvantageForm.description}
                                        onChange={(e) => setBaetamAdvantageForm({ ...baetamAdvantageForm, description: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <button type="submit" className="px-5 py-2.5 bg-blue-800 text-white font-semibold rounded-xl">
                                        {editingBaetamAdvantage ? 'Actualizar' : 'Agregar'}
                                    </button>
                                </form>
                                <div className="mt-4 space-y-2">
                                    {baetamAdvantages.map((item) => (
                                        <div key={item.id} className={`p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                            <div>
                                                <div className="font-semibold">{item.title}</div>
                                                <div className="text-xs text-slate-500">{item.description}</div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => { setEditingBaetamAdvantage(item); setBaetamAdvantageForm({ title: item.title, description: item.description }); }} className="text-blue-500">Editar</button>
                                                <button onClick={() => handleDeleteBaetamAdvantage(item.id)} className="text-red-500">Eliminar</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={`rounded-[2rem] p-6 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                                <h3 className="text-lg font-bold mb-4">Contacto</h3>
                                <form onSubmit={handleSaveBaetamContactLine} className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Línea de contacto"
                                        value={baetamContactLineForm.line_text}
                                        onChange={(e) => setBaetamContactLineForm({ line_text: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <button type="submit" className="px-5 py-2.5 bg-blue-800 text-white font-semibold rounded-xl">
                                        {editingBaetamContactLine ? 'Actualizar' : 'Agregar'}
                                    </button>
                                </form>
                                <div className="mt-4 space-y-2">
                                    {baetamContactLines.map((item) => (
                                        <div key={item.id} className={`p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                            <div className="font-semibold">{item.line_text}</div>
                                            <div className="flex gap-2">
                                                <button onClick={() => { setEditingBaetamContactLine(item); setBaetamContactLineForm({ line_text: item.line_text }); }} className="text-blue-500">Editar</button>
                                                <button onClick={() => handleDeleteBaetamContactLine(item.id)} className="text-red-500">Eliminar</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeNav === 'contacto' && (
                    <div className="max-w-6xl mx-auto space-y-10">
                        <section>
                            <div className={`rounded-[2rem] p-6 md:p-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-800">contact_mail</span> Información Principal
                                </h3>
                                <form onSubmit={handleSaveContactMain} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Dirección línea 1"
                                        value={contactMainForm.address_line1}
                                        onChange={(e) => setContactMainForm({ ...contactMainForm, address_line1: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Dirección línea 2"
                                        value={contactMainForm.address_line2}
                                        onChange={(e) => setContactMainForm({ ...contactMainForm, address_line2: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Dirección línea 3"
                                        value={contactMainForm.address_line3}
                                        onChange={(e) => setContactMainForm({ ...contactMainForm, address_line3: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Teléfono"
                                        value={contactMainForm.phone}
                                        onChange={(e) => setContactMainForm({ ...contactMainForm, phone: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Correo"
                                        value={contactMainForm.email}
                                        onChange={(e) => setContactMainForm({ ...contactMainForm, email: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Sitio web"
                                        value={contactMainForm.website}
                                        onChange={(e) => setContactMainForm({ ...contactMainForm, website: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Texto calificación"
                                        value={contactMainForm.rating_text}
                                        onChange={(e) => setContactMainForm({ ...contactMainForm, rating_text: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Estado"
                                        value={contactMainForm.status_text}
                                        onChange={(e) => setContactMainForm({ ...contactMainForm, status_text: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Horario línea 1"
                                        value={contactMainForm.hours_line1}
                                        onChange={(e) => setContactMainForm({ ...contactMainForm, hours_line1: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Horario línea 2"
                                        value={contactMainForm.hours_line2}
                                        onChange={(e) => setContactMainForm({ ...contactMainForm, hours_line2: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <div className="md:col-span-2">
                                        <button type="submit" className="px-6 py-3 bg-blue-800 text-white font-bold rounded-xl">Guardar Información</button>
                                    </div>
                                </form>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className={`rounded-[2rem] p-6 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                                <h3 className="text-lg font-bold mb-4">Directorio</h3>
                                <form onSubmit={handleSaveContactDirectory} className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Icono"
                                        value={contactDirectoryForm.icon}
                                        onChange={(e) => setContactDirectoryForm({ ...contactDirectoryForm, icon: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Título"
                                        value={contactDirectoryForm.title}
                                        onChange={(e) => setContactDirectoryForm({ ...contactDirectoryForm, title: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Detalle"
                                        value={contactDirectoryForm.detail}
                                        onChange={(e) => setContactDirectoryForm({ ...contactDirectoryForm, detail: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <button type="submit" className="px-5 py-2.5 bg-blue-800 text-white font-semibold rounded-xl">
                                        {editingContactDirectory ? 'Actualizar' : 'Agregar'}
                                    </button>
                                </form>
                                <div className="mt-4 space-y-2">
                                    {contactDirectory.map((item) => (
                                        <div key={item.id} className={`p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                            <div>
                                                <div className="font-semibold">{item.icon} {item.title}</div>
                                                <div className="text-xs text-slate-500">{item.detail}</div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => { setEditingContactDirectory(item); setContactDirectoryForm({ icon: item.icon || '', title: item.title, detail: item.detail }); }} className="text-blue-500">Editar</button>
                                                <button onClick={() => handleDeleteContactDirectory(item.id)} className="text-red-500">Eliminar</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={`rounded-[2rem] p-6 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                                <h3 className="text-lg font-bold mb-4">Redes Sociales</h3>
                                <form onSubmit={handleSaveContactSocial} className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Icono"
                                        value={contactSocialForm.icon}
                                        onChange={(e) => setContactSocialForm({ ...contactSocialForm, icon: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        value={contactSocialForm.name}
                                        onChange={(e) => setContactSocialForm({ ...contactSocialForm, name: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="URL"
                                        value={contactSocialForm.url}
                                        onChange={(e) => setContactSocialForm({ ...contactSocialForm, url: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Descripción"
                                        value={contactSocialForm.description}
                                        onChange={(e) => setContactSocialForm({ ...contactSocialForm, description: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <button type="submit" className="px-5 py-2.5 bg-blue-800 text-white font-semibold rounded-xl">
                                        {editingContactSocial ? 'Actualizar' : 'Agregar'}
                                    </button>
                                </form>
                                <div className="mt-4 space-y-2">
                                    {contactSocial.map((item) => (
                                        <div key={item.id} className={`p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                            <div>
                                                <div className="font-semibold">{item.icon} {item.name}</div>
                                                <div className="text-xs text-slate-500">{item.url}</div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => { setEditingContactSocial(item); setContactSocialForm({ icon: item.icon || '', name: item.name, url: item.url, description: item.description }); }} className="text-blue-500">Editar</button>
                                                <button onClick={() => handleDeleteContactSocial(item.id)} className="text-red-500">Eliminar</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className={`rounded-[2rem] p-6 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                                <h3 className="text-lg font-bold mb-4">Ubicación</h3>
                                <form onSubmit={handleSaveContactLocation} className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Texto de dirección"
                                        value={contactLocationForm.address_text}
                                        onChange={(e) => setContactLocationForm({ ...contactLocationForm, address_text: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="URL iframe mapa"
                                        value={contactLocationForm.map_embed_url}
                                        onChange={(e) => setContactLocationForm({ ...contactLocationForm, map_embed_url: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <button type="submit" className="px-5 py-2.5 bg-blue-800 text-white font-semibold rounded-xl">Guardar Ubicación</button>
                                </form>
                            </div>

                            <div className={`rounded-[2rem] p-6 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                                <h3 className="text-lg font-bold mb-4">CTA Final</h3>
                                <form onSubmit={handleSaveContactCta} className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Título"
                                        value={contactCtaForm.title}
                                        onChange={(e) => setContactCtaForm({ ...contactCtaForm, title: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Descripción"
                                        value={contactCtaForm.description}
                                        onChange={(e) => setContactCtaForm({ ...contactCtaForm, description: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Texto destacado"
                                        value={contactCtaForm.highlight_text}
                                        onChange={(e) => setContactCtaForm({ ...contactCtaForm, highlight_text: e.target.value })}
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <button type="submit" className="px-5 py-2.5 bg-blue-800 text-white font-semibold rounded-xl">Guardar CTA</button>
                                </form>
                            </div>
                        </section>

                        <section className={`rounded-[2rem] p-6 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                            <h3 className="text-lg font-bold mb-4">Preguntas Frecuentes</h3>
                            <form onSubmit={handleSaveContactFaq} className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Pregunta"
                                    value={contactFaqForm.question}
                                    onChange={(e) => setContactFaqForm({ ...contactFaqForm, question: e.target.value })}
                                    className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Respuesta"
                                    value={contactFaqForm.answer}
                                    onChange={(e) => setContactFaqForm({ ...contactFaqForm, answer: e.target.value })}
                                    className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <button type="submit" className="px-5 py-2.5 bg-blue-800 text-white font-semibold rounded-xl">
                                    {editingContactFaq ? 'Actualizar' : 'Agregar'}
                                </button>
                            </form>
                            <div className="mt-4 space-y-2">
                                {contactFaqs.map((item) => (
                                    <div key={item.id} className={`p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                        <div>
                                            <div className="font-semibold">{item.question}</div>
                                            <div className="text-xs text-slate-500">{item.answer}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingContactFaq(item); setContactFaqForm({ question: item.question, answer: item.answer }); }} className="text-blue-500">Editar</button>
                                            <button onClick={() => handleDeleteContactFaq(item.id)} className="text-red-500">Eliminar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {activeNav === 'about' && (
                    <div className="max-w-6xl mx-auto space-y-10">
                        <section>
                            <div className={`rounded-[2rem] p-6 md:p-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-800">info</span> Acerca de CBTa
                                </h3>
                                <form onSubmit={handleSaveAboutConfig} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Título"
                                        value={aboutConfigForm.title}
                                        onChange={(e) => setAboutConfigForm({ ...aboutConfigForm, title: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="URL Logo"
                                        value={aboutConfigForm.logo_url}
                                        onChange={(e) => setAboutConfigForm({ ...aboutConfigForm, logo_url: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="URL Croquis"
                                        value={aboutConfigForm.croquis_image_url}
                                        onChange={(e) => setAboutConfigForm({ ...aboutConfigForm, croquis_image_url: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setAboutCroquisFile(e.target.files?.[0] || null)}
                                            className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleUploadCroquis}
                                            disabled={uploadingCroquis || !aboutCroquisFile}
                                            className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-xl disabled:opacity-50"
                                        >
                                            {uploadingCroquis ? 'Subiendo...' : 'Subir croquis'}
                                        </button>
                                        {aboutConfigForm.croquis_image_url && (
                                            <a
                                                href={aboutConfigForm.croquis_image_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-500"
                                            >
                                                Ver imagen
                                            </a>
                                        )}
                                    </div>
                                    <textarea
                                        placeholder="Historia"
                                        value={aboutConfigForm.history_text}
                                        onChange={(e) => setAboutConfigForm({ ...aboutConfigForm, history_text: e.target.value })}
                                        className={`p-3 rounded-xl border min-h-[120px] ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <textarea
                                        placeholder="Misión"
                                        value={aboutConfigForm.mission_text}
                                        onChange={(e) => setAboutConfigForm({ ...aboutConfigForm, mission_text: e.target.value })}
                                        className={`p-3 rounded-xl border min-h-[120px] ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <textarea
                                        placeholder="Visión"
                                        value={aboutConfigForm.vision_text}
                                        onChange={(e) => setAboutConfigForm({ ...aboutConfigForm, vision_text: e.target.value })}
                                        className={`p-3 rounded-xl border min-h-[120px] ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Lema"
                                        value={aboutConfigForm.lema_text}
                                        onChange={(e) => setAboutConfigForm({ ...aboutConfigForm, lema_text: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <textarea
                                        placeholder="Compromiso texto 1"
                                        value={aboutConfigForm.commitment_text_1}
                                        onChange={(e) => setAboutConfigForm({ ...aboutConfigForm, commitment_text_1: e.target.value })}
                                        className={`p-3 rounded-xl border min-h-[120px] ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <textarea
                                        placeholder="Compromiso texto 2"
                                        value={aboutConfigForm.commitment_text_2}
                                        onChange={(e) => setAboutConfigForm({ ...aboutConfigForm, commitment_text_2: e.target.value })}
                                        className={`p-3 rounded-xl border min-h-[120px] ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <div className="md:col-span-2">
                                        <button type="submit" className="px-6 py-3 bg-blue-800 text-white font-bold rounded-xl">Guardar Acerca</button>
                                    </div>
                                </form>
                            </div>
                        </section>

                        <section className={`rounded-[2rem] p-6 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                            <h3 className="text-lg font-bold mb-4">Valores</h3>
                            <form onSubmit={handleSaveAboutValue} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <input
                                    type="text"
                                    placeholder="Icono"
                                    value={aboutValueForm.icon}
                                    onChange={(e) => setAboutValueForm({ ...aboutValueForm, icon: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Título"
                                    value={aboutValueForm.title}
                                    onChange={(e) => setAboutValueForm({ ...aboutValueForm, title: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Descripción"
                                    value={aboutValueForm.description}
                                    onChange={(e) => setAboutValueForm({ ...aboutValueForm, description: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <div className="md:col-span-3">
                                    <button type="submit" className="px-5 py-2.5 bg-blue-800 text-white font-semibold rounded-xl">
                                        {editingAboutValue ? 'Actualizar' : 'Agregar'}
                                    </button>
                                </div>
                            </form>
                            <div className="mt-4 space-y-2">
                                {aboutValues.map((item) => (
                                    <div key={item.id} className={`p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                        <div>
                                            <div className="font-semibold">{item.icon} {item.title}</div>
                                            <div className="text-xs text-slate-500">{item.description}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingAboutValue(item); setAboutValueForm({ icon: item.icon || '', title: item.title, description: item.description }); }} className="text-blue-500">Editar</button>
                                            <button onClick={() => handleDeleteAboutValue(item.id)} className="text-red-500">Eliminar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {activeNav === 'gallery' && (
                    <div className="max-w-6xl mx-auto space-y-10">
                        <section>
                            <div className={`rounded-[2rem] p-6 md:p-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-800">photo_library</span> Galería
                                </h3>
                                <form onSubmit={handleSaveGalleryItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <select
                                        value={galleryForm.section}
                                        onChange={(e) => setGalleryForm({ ...galleryForm, section: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    >
                                        <option value="instalaciones">Instalaciones</option>
                                        <option value="actividades">Actividades</option>
                                        <option value="clubs">Clubs</option>
                                        <option value="cbta">CBTa 134</option>
                                        <option value="galeria">Galería General</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Título"
                                        value={galleryForm.title}
                                        onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Descripción"
                                        value={galleryForm.description}
                                        onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="URL de imagen"
                                        value={galleryForm.image_url}
                                        onChange={(e) => setGalleryForm({ ...galleryForm, image_url: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setGalleryFile(e.target.files?.[0] || null)}
                                            className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleUploadGalleryImage}
                                            disabled={uploadingGallery || !galleryFile}
                                            className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-xl disabled:opacity-50"
                                        >
                                            {uploadingGallery ? 'Subiendo...' : 'Subir imagen'}
                                        </button>
                                        {galleryForm.image_url && (
                                            <a
                                                href={galleryForm.image_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-500"
                                            >
                                                Ver imagen
                                            </a>
                                        )}
                                    </div>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={galleryForm.is_locked}
                                            onChange={(e) => setGalleryForm({ ...galleryForm, is_locked: e.target.checked })}
                                        />
                                        Bloquear (no se puede eliminar)
                                    </label>
                                    <div className="md:col-span-2">
                                        <button type="submit" className="px-6 py-3 bg-blue-800 text-white font-bold rounded-xl">
                                            {editingGalleryItem ? 'Actualizar' : 'Agregar'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </section>

                        <section className={`rounded-[2rem] p-6 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                            <h3 className="text-lg font-bold mb-4">Imágenes</h3>
                            <div className="space-y-3">
                                {galleryItems.map((item) => (
                                    <div key={item.id} className={`p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                        <div className="flex items-center gap-3">
                                            <img src={item.image_url} alt={item.title} className="w-14 h-14 rounded-lg object-cover" />
                                            <div>
                                                <div className="font-semibold">{item.title}</div>
                                                <div className="text-xs text-slate-500">{item.section} • {item.description}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingGalleryItem(item);
                                                    setGalleryForm({
                                                        section: item.section,
                                                        title: item.title,
                                                        description: item.description || '',
                                                        image_url: item.image_url,
                                                        is_locked: item.is_locked
                                                    });
                                                }}
                                                className="text-blue-500"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDeleteGalleryItem(item)}
                                                className={`text-red-500 ${item.is_locked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={item.is_locked}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {activeNav === 'ui' && (
                    <div className="max-w-6xl mx-auto space-y-10">
                        <section className={`rounded-[2rem] p-6 md:p-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                            <h3 className="text-xl font-bold mb-6">Header</h3>
                            <form onSubmit={handleSaveUiHeader} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="URL Logo"
                                    value={uiHeaderForm.logo_url}
                                    onChange={(e) => setUiHeaderForm({ ...uiHeaderForm, logo_url: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Título"
                                    value={uiHeaderForm.title_text}
                                    onChange={(e) => setUiHeaderForm({ ...uiHeaderForm, title_text: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <div className="md:col-span-2">
                                    <button type="submit" className="px-6 py-3 bg-blue-800 text-white font-bold rounded-xl">Guardar Header</button>
                                </div>
                            </form>

                            <div className="mt-6">
                                <h4 className="font-bold mb-3">Links Header</h4>
                                <form onSubmit={handleSaveHeaderLink} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Label"
                                        value={uiHeaderLinkForm.label}
                                        onChange={(e) => setUiHeaderLinkForm({ ...uiHeaderLinkForm, label: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Path (ej: noticias)"
                                        value={uiHeaderLinkForm.path}
                                        onChange={(e) => setUiHeaderLinkForm({ ...uiHeaderLinkForm, path: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Href (ej: /noticias)"
                                        value={uiHeaderLinkForm.href}
                                        onChange={(e) => setUiHeaderLinkForm({ ...uiHeaderLinkForm, href: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <div className="md:col-span-3">
                                        <button type="submit" className="px-5 py-2.5 bg-blue-800 text-white font-semibold rounded-xl">
                                            {editingHeaderLink ? 'Actualizar' : 'Agregar'}
                                        </button>
                                    </div>
                                </form>
                                <div className="mt-4 space-y-2">
                                    {uiHeaderLinks.map((item) => (
                                        <div key={item.id} className={`p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                            <div className="font-semibold">{item.label} • {item.path}</div>
                                            <div className="flex gap-2">
                                                <button onClick={() => { setEditingHeaderLink(item); setUiHeaderLinkForm({ label: item.label, path: item.path, href: item.href || '' }); }} className="text-blue-500">Editar</button>
                                                <button onClick={() => handleDeleteHeaderLink(item.id)} className="text-red-500">Eliminar</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className={`rounded-[2rem] p-6 md:p-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                            <h3 className="text-xl font-bold mb-6">Carrusel (Hero)</h3>
                            <form onSubmit={handleSaveHero} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="URL de imagen"
                                    value={heroForm.image_url}
                                    onChange={(e) => setHeroForm({ ...heroForm, image_url: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center md:col-span-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleUploadHero}
                                        disabled={uploadingHero || !heroFile}
                                        className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-xl disabled:opacity-50"
                                    >
                                        {uploadingHero ? 'Subiendo...' : 'Subir imagen'}
                                    </button>
                                    {heroForm.image_url && (
                                        <a href={heroForm.image_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500">Ver imagen</a>
                                    )}
                                </div>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={heroForm.is_locked}
                                        onChange={(e) => setHeroForm({ ...heroForm, is_locked: e.target.checked })}
                                    />
                                    Bloquear
                                </label>
                                <div className="md:col-span-2">
                                    <button type="submit" className="px-6 py-3 bg-blue-800 text-white font-bold rounded-xl">
                                        {editingHero ? 'Actualizar' : 'Agregar'}
                                    </button>
                                </div>
                            </form>
                            <div className="mt-4 space-y-2">
                                {heroSlides.map((item) => (
                                    <div key={item.id} className={`p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                        <div className="flex items-center gap-3">
                                            <img src={item.image_url} alt="slide" className="w-14 h-14 rounded-lg object-cover" />
                                            <span className="text-xs">{item.image_url}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingHero(item); setHeroForm({ image_url: item.image_url, is_locked: item.is_locked }); }} className="text-blue-500">Editar</button>
                                            <button onClick={() => handleDeleteHero(item)} className={`text-red-500 ${item.is_locked ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={item.is_locked}>Eliminar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className={`rounded-[2rem] p-6 md:p-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                            <h3 className="text-xl font-bold mb-6">Opciones de Inicio</h3>
                            <form onSubmit={handleSaveHomeOption} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Título"
                                    value={homeOptionForm.title}
                                    onChange={(e) => setHomeOptionForm({ ...homeOptionForm, title: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Descripción"
                                    value={homeOptionForm.description}
                                    onChange={(e) => setHomeOptionForm({ ...homeOptionForm, description: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Path (ej: noticias)"
                                    value={homeOptionForm.path}
                                    onChange={(e) => setHomeOptionForm({ ...homeOptionForm, path: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="URL de imagen"
                                    value={homeOptionForm.image_url}
                                    onChange={(e) => setHomeOptionForm({ ...homeOptionForm, image_url: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setHomeOptionFile(e.target.files?.[0] || null)}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleUploadHomeOption}
                                        disabled={uploadingHomeOption || !homeOptionFile}
                                        className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-xl disabled:opacity-50"
                                    >
                                        {uploadingHomeOption ? 'Subiendo...' : 'Subir imagen'}
                                    </button>
                                    {homeOptionForm.image_url && (
                                        <a href={homeOptionForm.image_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500">Ver imagen</a>
                                    )}
                                </div>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={homeOptionForm.is_locked}
                                        onChange={(e) => setHomeOptionForm({ ...homeOptionForm, is_locked: e.target.checked })}
                                    />
                                    Bloquear
                                </label>
                                <div className="md:col-span-2">
                                    <button type="submit" className="px-6 py-3 bg-blue-800 text-white font-bold rounded-xl">
                                        {editingHomeOption ? 'Actualizar' : 'Agregar'}
                                    </button>
                                </div>
                            </form>
                            <div className="mt-4 space-y-2">
                                {homeOptionsAdmin.map((item) => (
                                    <div key={item.id} className={`p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                        <div className="flex items-center gap-3">
                                            <img src={item.image_url} alt={item.title} className="w-14 h-14 rounded-lg object-cover" />
                                            <div>
                                                <div className="font-semibold">{item.title}</div>
                                                <div className="text-xs text-slate-500">{item.path}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingHomeOption(item); setHomeOptionForm({ image_url: item.image_url, title: item.title, description: item.description || '', path: item.path, is_locked: item.is_locked }); }} className="text-blue-500">Editar</button>
                                            <button onClick={() => handleDeleteHomeOption(item)} className={`text-red-500 ${item.is_locked ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={item.is_locked}>Eliminar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className={`rounded-[2rem] p-6 md:p-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                            <h3 className="text-xl font-bold mb-6">Footer</h3>
                            <form onSubmit={handleSaveUiFooter} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={uiFooterForm.school_name}
                                    onChange={(e) => setUiFooterForm({ ...uiFooterForm, school_name: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Ubicación"
                                    value={uiFooterForm.location_text}
                                    onChange={(e) => setUiFooterForm({ ...uiFooterForm, location_text: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Tagline"
                                    value={uiFooterForm.tagline_text}
                                    onChange={(e) => setUiFooterForm({ ...uiFooterForm, tagline_text: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Copyright"
                                    value={uiFooterForm.copyright_text}
                                    onChange={(e) => setUiFooterForm({ ...uiFooterForm, copyright_text: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Derechos"
                                    value={uiFooterForm.rights_text}
                                    onChange={(e) => setUiFooterForm({ ...uiFooterForm, rights_text: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <textarea
                                    placeholder="Legal 1"
                                    value={uiFooterForm.legal_text_1}
                                    onChange={(e) => setUiFooterForm({ ...uiFooterForm, legal_text_1: e.target.value })}
                                    className={`p-3 rounded-xl border min-h-[100px] ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <textarea
                                    placeholder="Legal 2"
                                    value={uiFooterForm.legal_text_2}
                                    onChange={(e) => setUiFooterForm({ ...uiFooterForm, legal_text_2: e.target.value })}
                                    className={`p-3 rounded-xl border min-h-[100px] ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <textarea
                                    placeholder="Legal 3"
                                    value={uiFooterForm.legal_text_3}
                                    onChange={(e) => setUiFooterForm({ ...uiFooterForm, legal_text_3: e.target.value })}
                                    className={`p-3 rounded-xl border min-h-[100px] ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <div className="md:col-span-2">
                                    <button type="submit" className="px-6 py-3 bg-blue-800 text-white font-bold rounded-xl">Guardar Footer</button>
                                </div>
                            </form>

                            <div className="mt-6">
                                <h4 className="font-bold mb-3">Links Footer</h4>
                                <form onSubmit={handleSaveFooterLink} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Label"
                                        value={uiFooterLinkForm.label}
                                        onChange={(e) => setUiFooterLinkForm({ ...uiFooterLinkForm, label: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="URL"
                                        value={uiFooterLinkForm.href}
                                        onChange={(e) => setUiFooterLinkForm({ ...uiFooterLinkForm, href: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Icon URL"
                                        value={uiFooterLinkForm.icon_url}
                                        onChange={(e) => setUiFooterLinkForm({ ...uiFooterLinkForm, icon_url: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Clase (facebook/maps)"
                                        value={uiFooterLinkForm.style_class}
                                        onChange={(e) => setUiFooterLinkForm({ ...uiFooterLinkForm, style_class: e.target.value })}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <div className="md:col-span-4">
                                        <button type="submit" className="px-5 py-2.5 bg-blue-800 text-white font-semibold rounded-xl">
                                            {editingFooterLink ? 'Actualizar' : 'Agregar'}
                                        </button>
                                    </div>
                                </form>
                                <div className="mt-4 space-y-2">
                                    {uiFooterLinks.map((item) => (
                                        <div key={item.id} className={`p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                            <div className="font-semibold">{item.label} • {item.href}</div>
                                            <div className="flex gap-2">
                                                <button onClick={() => { setEditingFooterLink(item); setUiFooterLinkForm({ label: item.label, href: item.href, icon_url: item.icon_url || '', style_class: item.style_class || '' }); }} className="text-blue-500">Editar</button>
                                                <button onClick={() => handleDeleteFooterLink(item.id)} className="text-red-500">Eliminar</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeNav === 'creditos' && (
                    <div className="max-w-6xl mx-auto space-y-10">
                        <section className={`rounded-[2rem] p-6 md:p-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                            <h3 className="text-xl font-bold mb-6">Configuración Créditos</h3>
                            <form onSubmit={handleSaveCreditsConfig} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Título"
                                    value={creditsConfigForm.title}
                                    onChange={(e) => setCreditsConfigForm({ ...creditsConfigForm, title: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Subtítulo"
                                    value={creditsConfigForm.subtitle}
                                    onChange={(e) => setCreditsConfigForm({ ...creditsConfigForm, subtitle: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Título licencia (opcional)"
                                    value={creditsConfigForm.license_title}
                                    onChange={(e) => setCreditsConfigForm({ ...creditsConfigForm, license_title: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <textarea
                                    placeholder="Texto licencia (opcional)"
                                    value={creditsConfigForm.license_text}
                                    onChange={(e) => setCreditsConfigForm({ ...creditsConfigForm, license_text: e.target.value })}
                                    className={`p-3 rounded-xl border min-h-[120px] ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <div className="md:col-span-2">
                                    <button type="submit" className="px-6 py-3 bg-blue-800 text-white font-bold rounded-xl">Guardar Créditos</button>
                                </div>
                            </form>
                        </section>

                        <section className={`rounded-[2rem] p-6 md:p-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                            <h3 className="text-xl font-bold mb-6">Autores</h3>
                            <form onSubmit={handleSaveCreditsAuthor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Nombre completo"
                                    value={creditsAuthorForm.full_name}
                                    onChange={(e) => setCreditsAuthorForm({ ...creditsAuthorForm, full_name: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Carrera"
                                    value={creditsAuthorForm.career}
                                    onChange={(e) => setCreditsAuthorForm({ ...creditsAuthorForm, career: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Descripción"
                                    value={creditsAuthorForm.description}
                                    onChange={(e) => setCreditsAuthorForm({ ...creditsAuthorForm, description: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="URL foto"
                                    value={creditsAuthorForm.photo_url}
                                    onChange={(e) => setCreditsAuthorForm({ ...creditsAuthorForm, photo_url: e.target.value })}
                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setCreditsFile(e.target.files?.[0] || null)}
                                        className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleUploadCreditsPhoto}
                                        disabled={uploadingCredits || !creditsFile}
                                        className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-xl disabled:opacity-50"
                                    >
                                        {uploadingCredits ? 'Subiendo...' : 'Subir foto'}
                                    </button>
                                    {creditsAuthorForm.photo_url && (
                                        <a href={creditsAuthorForm.photo_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500">Ver foto</a>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <button type="submit" className="px-6 py-3 bg-blue-800 text-white font-bold rounded-xl">
                                        {editingCreditsAuthor ? 'Actualizar' : 'Agregar'}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-4 space-y-2">
                                {creditsAuthors.map((item) => (
                                    <div key={item.id} className={`p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                        <div className="flex items-center gap-3">
                                            <img src={item.photo_url} alt={item.full_name} className="w-14 h-14 rounded-lg object-cover" />
                                            <div>
                                                <div className="font-semibold">{item.full_name}</div>
                                                <div className="text-xs text-slate-500">{item.career}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingCreditsAuthor(item); setCreditsAuthorForm({ full_name: item.full_name, career: item.career, description: item.description || '', photo_url: item.photo_url || '' }); }} className="text-blue-500">Editar</button>
                                            <button onClick={() => handleDeleteCreditsAuthor(item.id)} className="text-red-500">Eliminar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {(activeNav === 'dashboard' || activeNav === 'alumnos' || activeNav === 'avisos' || activeNav === 'clubes' || activeNav === 'carreras' || activeNav === 'maestros' || activeNav === 'chatbot' || activeNav === 'gmail' || activeNav === 'storage' || activeNav === 'access') && (
                <div className="max-w-6xl mx-auto space-y-10">
                    {activeNav === 'dashboard' && (
                        <section className={`rounded-[2rem] p-6 md:p-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                            <h3 className="text-xl font-bold mb-4">Panel principal</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { key: 'avisos', label: 'Avisos', icon: 'campaign' },
                                    { key: 'clubes', label: 'Clubes', icon: 'sports_esports' },
                                    { key: 'carreras', label: 'Carreras', icon: 'engineering' },
                                    { key: 'maestros', label: 'Maestros', icon: 'co_present' },
                                    { key: 'alumnos', label: 'Alumnos', icon: 'group' },
                                    { key: 'chatbot', label: 'IA Chatbot', icon: 'smart_toy' },
                                    { key: 'gmail', label: 'Notificaciones Gmail', icon: 'mail' },
                                    { key: 'storage', label: 'Almacenamiento', icon: 'storage' }
                                ].map((item) => (
                                    <button
                                        key={item.key}
                                        onClick={() => setActiveNav(item.key)}
                                        className={`p-6 rounded-3xl text-left border ${darkMode ? 'bg-slate-900 border-slate-700 hover:border-blue-400' : 'bg-white border-slate-100 hover:border-blue-800'} transition-all`}
                                    >
                                        <span className="material-symbols-outlined text-blue-800 text-2xl">{item.icon}</span>
                                        <div className="mt-2 font-bold">{item.label}</div>
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'alumnos' && (
                        <>
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <span className="material-symbols-outlined text-blue-800">layers</span> Gestión por Semestre
                                    </h3>
                                </div>
                                <div className="flex overflow-x-auto lg:grid lg:grid-cols-6 gap-4 pb-4 lg:pb-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                    {[1, 2, 3, 4, 5, 6].map(sem => (
                                        <div 
                                            key={sem}
                                            onClick={() => { 
                                                setSelectedSemesterFilter(sem); 
                                                setViewLevel('groups');
                                            }}
                                            className={`flex-shrink-0 w-32 lg:w-full group p-6 rounded-3xl shadow-sm border cursor-pointer transition-all text-center ${
                                                darkMode 
                                                    ? 'bg-slate-800 border-slate-700 hover:border-blue-400' 
                                                    : 'bg-white border-slate-100 hover:border-blue-800'
                                            } ${selectedSemesterFilter === sem ? (darkMode ? 'border-blue-400' : 'border-blue-800') : ''}`}
                                        >
                                            <div className={`text-3xl font-black mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>{sem}°</div>
                                            <div className={`text-[10px] uppercase font-bold tracking-wider ${darkMode ? 'text-slate-400 group-hover:text-blue-400' : 'text-slate-400 group-hover:text-blue-800'}`}>Semestre</div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {viewLevel === 'students' && selectedGroupFilter && (
                                <section>
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-lg font-bold">Alumnos - {selectedSemesterFilter}° Semestre, Grupo {selectedGroupFilter}</h3>
                                            <button 
                                                onClick={() => { setViewLevel('groups'); setSelectedGroupFilter(null); }}
                                                className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-800'} hover:underline`}
                                            >
                                                ← Volver a grupos
                                            </button>
                                        </div>
                                    </div>
                                    <div className={`rounded-3xl overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
                                        <table className="w-full">
                                            <thead>
                                                <tr className={darkMode ? 'bg-slate-900' : 'bg-slate-50'}>
                                                    <th className={`p-4 text-left font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Nombre Completo</th>
                                                    <th className={`p-4 text-left font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>No. Control</th>
                                                    <th className={`p-4 text-left font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>CURP</th>
                                                    <th className={`p-4 text-left font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getFilteredStudents().length > 0 ? (
                                                    getFilteredStudents().map(student => (
                                                        <tr key={student.id} className={`border-t ${darkMode ? 'border-slate-700 hover:bg-slate-700/50' : 'border-slate-100 hover:bg-slate-50'}`}>
                                                            <td className="p-4">
                                                                <strong>{student.apellidos}</strong>, {student.nombre || ''}
                                                            </td>
                                                            <td className={`p-4 ${!student.numero_control ? 'text-slate-400' : ''}`}>
                                                                {student.numero_control || '--'}
                                                            </td>
                                                            <td className="p-4">{student.curp}</td>
                                                            <td className="p-4">
                                                                <div className="flex gap-2">
                                                                    <button 
                                                                        onClick={() => openGradesModal(student)}
                                                                        className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                                                        title="Calificaciones"
                                                                    >
                                                                        📝
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleUpdate(student)}
                                                                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                                                        title="Editar Datos"
                                                                    >
                                                                        ✏️
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleDelete(student.id)}
                                                                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                                                        title="Eliminar"
                                                                    >
                                                                        🗑️
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="p-8 text-center text-slate-500">No hay alumnos en este grupo.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            )}

                            {viewLevel === 'groups' && selectedSemesterFilter && (
                                <section>
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-lg font-bold">Grupos - {selectedSemesterFilter}° Semestre</h3>
                                            <button 
                                                onClick={() => { setViewLevel('semesters'); setSelectedSemesterFilter(null); }}
                                                className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-800'} hover:underline`}
                                            >
                                                ← Volver a semestres
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {getAvailableGroups(selectedSemesterFilter).length > 0 ? (
                                            getAvailableGroups(selectedSemesterFilter).map(grupo => (
                                                <div 
                                                    key={grupo}
                                                    onClick={() => { setSelectedGroupFilter(grupo); setViewLevel('students'); }}
                                                    className={`p-6 rounded-3xl border-l-4 border-l-green-500 cursor-pointer transition-all text-center ${
                                                        darkMode 
                                                            ? 'bg-slate-800 border border-slate-700 hover:border-green-400' 
                                                            : 'bg-white border border-slate-100 hover:border-green-500 shadow-sm'
                                                    }`}
                                                >
                                                    <div className="text-4xl font-black text-green-500 mb-1">{grupo}</div>
                                                    <div className="text-xs uppercase font-bold tracking-wider text-slate-400">Grupo</div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="col-span-full text-center text-slate-500 py-8">No hay grupos registrados en este semestre aún.</p>
                                        )}
                                    </div>
                                </section>
                            )}
                        </>
                    )}

                    {activeNav === 'avisos' && (
                        <>
                            <section>
                                <div className={`rounded-[2rem] p-6 md:p-8 shadow-xl border ${darkMode ? 'bg-slate-800 border-slate-700 shadow-none' : 'bg-white border-white shadow-slate-200/50'}`}>
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-blue-800">add_circle</span> Nuevo Aviso Global
                                    </h3>
                                    <form onSubmit={handlePostAnnouncement} className="space-y-4">
                                        <input 
                                            type="text"
                                            value={announcement.titulo}
                                            onChange={(e) => setAnnouncement({ ...announcement, titulo: e.target.value })}
                                            placeholder="¿Qué quieres anunciar hoy?"
                                            className={`w-full text-lg border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-800/20 transition-all ${darkMode ? 'bg-slate-900 text-white placeholder-slate-500' : 'bg-slate-50'}`}
                                            required
                                        />
                                        <textarea 
                                            value={announcement.contenido}
                                            onChange={(e) => setAnnouncement({ ...announcement, contenido: e.target.value })}
                                            placeholder="Describe el aviso detalladamente..."
                                            rows="3"
                                            className={`w-full border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-800/20 transition-all ${darkMode ? 'bg-slate-900 text-white placeholder-slate-500' : 'bg-slate-50'}`}
                                            required
                                        />
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                                <label className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-colors w-full sm:w-auto ${darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                                    <span className="material-symbols-outlined text-xl">image</span>
                                                    <span className="text-sm font-semibold">Imagen/Video</span>
                                                    <input 
                                                        type="file"
                                                        accept="image/*,video/*"
                                                        onChange={(e) => setMediaFile(e.target.files[0])}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                            <button 
                                                type="submit"
                                                disabled={uploading}
                                                className="w-full sm:w-auto px-8 py-3 bg-blue-800 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                            >
                                                {uploading ? 'Subiendo...' : (editingPost ? 'Actualizar' : 'Publicar Ahora')}
                                            </button>
                                        </div>
                                        {mediaFile && (
                                            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                📎 {mediaFile.name}
                                            </p>
                                        )}
                                    </form>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold">Avisos Activos</h3>
                                </div>
                                <div className="space-y-4">
                                    {posts.length === 0 ? (
                                        <div className={`p-8 rounded-3xl text-center ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} border`}>
                                            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">notifications_off</span>
                                            <p className="text-slate-500">No hay avisos publicados.</p>
                                        </div>
                                    ) : (
                                        posts.map(post => (
                                            <div key={post.id} className={`p-5 rounded-3xl border shadow-sm flex flex-col md:flex-row gap-5 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                                                {post.media_url && (
                                                    <div className={`w-full md:w-48 h-32 flex-shrink-0 rounded-2xl overflow-hidden ${darkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
                                                        {post.media_type === 'video' ? (
                                                            <video src={post.media_url} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <img src={post.media_url} alt="Announcement" className="w-full h-full object-cover" />
                                                        )}
                                                    </div>
                                                )}
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="font-bold text-lg leading-tight">{post.titulo}</h4>
                                                            <div className="flex gap-1">
                                                                <button 
                                                                    onClick={() => handleEditPost(post)}
                                                                    className={`p-1.5 transition-colors ${darkMode ? 'text-slate-400 hover:text-blue-400' : 'text-slate-400 hover:text-blue-800'}`}
                                                                >
                                                                    <span className="material-symbols-outlined text-xl">edit</span>
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeletePost(post.id)}
                                                                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                                                >
                                                                    <span className="material-symbols-outlined text-xl">delete</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <p className={`text-sm line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{post.contenido}</p>
                                                    </div>
                                                    <div className="mt-4 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-sm">schedule</span> 
                                                            {new Date(post.created_at).toLocaleDateString()}
                                                        </span>
                                                        <span className={`px-2.5 py-1 rounded-lg ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-800'}`}>Académico</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </>
                    )}

                    {activeNav === 'maestros' && (
                        <>
                            <section>
                                <div className={`rounded-[2rem] p-6 md:p-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-blue-800">co_present</span> Configuración Portal Docente
                                    </h3>
                                    <form onSubmit={handleSaveTeachersConfig} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Título"
                                            value={teachersConfigForm.title}
                                            onChange={(e) => setTeachersConfigForm({ ...teachersConfigForm, title: e.target.value })}
                                            className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Subtítulo"
                                            value={teachersConfigForm.subtitle}
                                            onChange={(e) => setTeachersConfigForm({ ...teachersConfigForm, subtitle: e.target.value })}
                                            className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                        />
                                        <input
                                            type="text"
                                            placeholder="URL de imagen principal"
                                            value={teachersConfigForm.hero_image_url}
                                            onChange={(e) => setTeachersConfigForm({ ...teachersConfigForm, hero_image_url: e.target.value })}
                                            className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Texto del botón"
                                            value={teachersConfigForm.cta_label}
                                            onChange={(e) => setTeachersConfigForm({ ...teachersConfigForm, cta_label: e.target.value })}
                                            className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                        />
                                        <div className="md:col-span-2">
                                            <button type="submit" className="px-6 py-3 bg-blue-800 text-white font-bold rounded-xl">Guardar Configuración</button>
                                        </div>
                                    </form>
                                </div>
                            </section>

                            <section>
                                <div className={`rounded-[2rem] p-6 md:p-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`}>
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-blue-800">link</span> Recursos Docentes
                                    </h3>
                                    <form onSubmit={handleSaveTeacherLink} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Nombre"
                                            value={teacherLinkForm.name}
                                            onChange={(e) => setTeacherLinkForm({ ...teacherLinkForm, name: e.target.value })}
                                            className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                        />
                                        <input
                                            type="url"
                                            placeholder="URL"
                                            value={teacherLinkForm.url}
                                            onChange={(e) => setTeacherLinkForm({ ...teacherLinkForm, url: e.target.value })}
                                            className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Descripción"
                                            value={teacherLinkForm.description}
                                            onChange={(e) => setTeacherLinkForm({ ...teacherLinkForm, description: e.target.value })}
                                            className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Icono (emoji)"
                                            value={teacherLinkForm.icon}
                                            onChange={(e) => setTeacherLinkForm({ ...teacherLinkForm, icon: e.target.value })}
                                            className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Color (hex o nombre)"
                                            value={teacherLinkForm.color}
                                            onChange={(e) => setTeacherLinkForm({ ...teacherLinkForm, color: e.target.value })}
                                            className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Orden (opcional)"
                                            value={teacherLinkForm.order_index}
                                            onChange={(e) => setTeacherLinkForm({ ...teacherLinkForm, order_index: e.target.value })}
                                            className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                        />
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={teacherLinkForm.is_active}
                                                onChange={(e) => setTeacherLinkForm({ ...teacherLinkForm, is_active: e.target.checked })}
                                            />
                                            Visible en el portal
                                        </label>
                                        <div className="md:col-span-2">
                                            <button type="submit" className="px-6 py-3 bg-blue-800 text-white font-bold rounded-xl">
                                                {editingTeacherLink ? 'Actualizar' : 'Agregar'}
                                            </button>
                                        </div>
                                    </form>

                                    <div className="mt-6 space-y-3">
                                        {teacherLinks.map((item) => (
                                            <div key={item.id} className={`p-4 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                                <div>
                                                    <div className="font-semibold flex items-center gap-2">
                                                        <span>{item.icon || '🔗'}</span>
                                                        <span>{item.name}</span>
                                                        {!item.is_active && <span className="text-xs text-slate-500">(oculto)</span>}
                                                    </div>
                                                    <div className="text-sm text-slate-500">{item.description}</div>
                                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500">{item.url}</a>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => {
                                                            setEditingTeacherLink(item);
                                                            setTeacherLinkForm({
                                                                name: item.name || '',
                                                                description: item.description || '',
                                                                icon: item.icon || '',
                                                                url: item.url || '',
                                                                color: item.color || '',
                                                                order_index: item.order_index || '',
                                                                is_active: item.is_active !== false
                                                            });
                                                        }}
                                                        className="text-blue-500"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button onClick={() => handleDeleteTeacherLink(item.id)} className="text-red-500">Eliminar</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </>
                    )}

                    {activeNav === 'clubes' && (
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold">Clubes Escolares</h3>
                                <button 
                                    onClick={() => { setClubToEdit(null); setShowClubModal(true); }}
                                    className={`p-1.5 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}
                                >
                                    <span className="material-symbols-outlined text-sm">add</span>
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {clubs.length === 0 ? (
                                    <p className="text-center text-slate-500 py-4">No hay clubes registrados.</p>
                                ) : (
                                    clubs.map(club => (
                                        <div 
                                            key={club.id} 
                                            className={`flex items-center gap-4 p-4 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
                                        >
                                            <div className={`w-12 h-12 flex-shrink-0 text-2xl flex items-center justify-center rounded-xl ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                                                {club.icono || '🎯'}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-sm">{club.nombre}</h4>
                                                <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{club.categoria}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <button 
                                                    onClick={() => handleEditClub(club)}
                                                    className="p-1 text-slate-400 hover:text-blue-500"
                                                >
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClub(club.id)}
                                                    className="p-1 text-slate-400 hover:text-red-500"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    )}

                    {activeNav === 'carreras' && (
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold">Carreras Técnicas</h3>
                                <button 
                                    onClick={() => { setCareerToEdit(null); setShowCareerModal(true); }}
                                    className={`p-1.5 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}
                                >
                                    <span className="material-symbols-outlined text-sm">add</span>
                                </button>
                            </div>
                            <div className="space-y-3">
                                {careers.length === 0 ? (
                                    <p className="text-center text-slate-500 py-4">No hay carreras registradas.</p>
                                ) : (
                                    careers.map(career => (
                                        <div 
                                            key={career.id}
                                            className={`p-5 rounded-3xl border shadow-sm group cursor-pointer transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-blue-400' : 'bg-white border-slate-100 hover:border-blue-800'}`}
                                        >
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center overflow-hidden">
                                                    {career.imagen_url ? (
                                                        <img src={career.imagen_url} alt={career.nombre} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-white text-2xl">📚</span>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold">{career.nombre}</h4>
                                                    <p className={`text-xs uppercase font-bold tracking-tighter ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                        {career.descripcion?.substring(0, 30) || 'Sin descripción'}
                                                    </p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleEditCareer(career); }}
                                                        className="p-1 text-slate-400 hover:text-blue-500"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteCareer(career.id); }}
                                                        className="p-1 text-slate-400 hover:text-red-500"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                            {career.plan_estudios_url && (
                                                <div className={`flex items-center justify-between pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-50'}`}>
                                                    <a 
                                                        href={career.plan_estudios_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className={`text-xs font-bold ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}
                                                    >
                                                        Ver Plan de Estudios
                                                    </a>
                                                    <span className="material-symbols-outlined text-blue-800 text-lg">arrow_forward</span>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    )}

                    {activeNav === 'chatbot' && (
                        <section className={`rounded-[2rem] p-6 md:p-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-800">smart_toy</span> IA Chatbot
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                    {chatbotForm.enabled ? 'Activo' : 'Desactivado'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
                                    <p className="text-sm font-semibold">Estado</p>
                                    <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {chatbotConfig ? 'Configurado' : 'Sin configurar'}
                                    </p>
                                </div>
                                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
                                    <p className="text-sm font-semibold">Proveedor</p>
                                    <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {(chatbotForm.provider || 'grok').toUpperCase()}
                                    </p>
                                </div>
                                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
                                    <p className="text-sm font-semibold">Modelo</p>
                                    <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {chatbotForm.model || 'No definido'}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSaveChatbotConfig} className="mt-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold">Proveedor</label>
                                        <select
                                            value={chatbotForm.provider}
                                            onChange={(e) => setChatbotForm({ ...chatbotForm, provider: e.target.value })}
                                            className={`w-full mt-2 p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                        >
                                            <option value="groq">Groq</option>
                                            <option value="gemini">Gemini</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold">API Key</label>
                                        <input
                                            type="password"
                                            value={chatbotForm.api_key}
                                            onChange={(e) => setChatbotForm({ ...chatbotForm, api_key: e.target.value })}
                                            placeholder="Ingresa tu API Key"
                                            className={`w-full mt-2 p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold">Modelo</label>
                                        <select
                                            value={chatbotForm.model}
                                            onChange={(e) => setChatbotForm({ ...chatbotForm, model: e.target.value })}
                                            className={`w-full mt-2 p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                        >
                                            <option value="">Selecciona un modelo</option>
                                            {aiModels
                                                .filter((model) => model.provider === chatbotForm.provider && model.is_active !== false)
                                                .map((model) => (
                                                    <option key={model.id} value={model.name}>{model.name}</option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold">Prompt de sistema</label>
                                    <textarea
                                        value={chatbotForm.system_prompt}
                                        onChange={(e) => setChatbotForm({ ...chatbotForm, system_prompt: e.target.value })}
                                        rows="6"
                                        placeholder="Instrucciones del sistema para el chatbot"
                                        className={`w-full mt-2 p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <label className={`flex items-center gap-2 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                        <input
                                            type="checkbox"
                                            checked={chatbotForm.enable_db_context}
                                            onChange={(e) => setChatbotForm({ ...chatbotForm, enable_db_context: e.target.checked })}
                                        />
                                        Permitir contexto de la base de datos
                                    </label>
                                    <label className={`flex items-center gap-2 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                        <input
                                            type="checkbox"
                                            checked={chatbotForm.enabled}
                                            onChange={(e) => setChatbotForm({ ...chatbotForm, enabled: e.target.checked })}
                                        />
                                        Activar chatbot en el sitio
                                    </label>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        type="submit"
                                        disabled={chatbotSaving}
                                        className="px-5 py-3 rounded-2xl bg-blue-800 text-white font-bold shadow hover:scale-[1.01] transition-all disabled:opacity-60"
                                    >
                                        {chatbotSaving ? 'Guardando...' : 'Guardar configuración'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => window.open('/', '_blank')}
                                        className={`px-5 py-3 rounded-2xl font-semibold ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                                    >
                                        Ver en sitio
                                    </button>
                                </div>

                                <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    La información de la base de datos se agrega como contexto al prompt. Evita incluir datos sensibles.
                                </p>
                            </form>

                            <div className="mt-8">
                                <h4 className="text-md font-bold mb-3">Probar chatbot</h4>
                                <form onSubmit={runChatbotTest} className="space-y-3">
                                    <textarea
                                        value={chatbotTestInput}
                                        onChange={(e) => setChatbotTestInput(e.target.value)}
                                        rows="3"
                                        placeholder="Escribe un mensaje de prueba..."
                                        className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                    <button
                                        type="submit"
                                        disabled={chatbotTestLoading}
                                        className="px-5 py-3 rounded-2xl bg-blue-800 text-white font-bold shadow disabled:opacity-60"
                                    >
                                        {chatbotTestLoading ? 'Probando...' : 'Probar ahora'}
                                    </button>
                                </form>
                                {chatbotTestResponse && (
                                    <div className={`mt-4 p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-100 text-slate-600'}`}>
                                        <p className="text-sm whitespace-pre-wrap">{chatbotTestResponse}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const next = !chatbotQuestionsOpen;
                                        setChatbotQuestionsOpen(next);
                                        if (next) fetchChatbotQuestions();
                                    }}
                                    className={`px-5 py-3 rounded-2xl text-sm font-semibold ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                                >
                                    {chatbotQuestionsOpen ? 'Ocultar preguntas realizadas' : 'Preguntas realizadas por usuarios'}
                                </button>

                                {chatbotQuestionsOpen && (
                                    <div className="mt-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-md font-bold">Preguntas recientes</h4>
                                            <button
                                                type="button"
                                                onClick={handleClearChatbotQuestions}
                                                className="text-sm text-red-500"
                                            >
                                                Eliminar todas
                                            </button>
                                        </div>
                                        {chatbotQuestionsLoading ? (
                                            <p className="text-sm text-slate-500">Cargando...</p>
                                        ) : chatbotQuestions.length === 0 ? (
                                            <p className="text-sm text-slate-500">No hay preguntas registradas.</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {chatbotQuestions.map((q) => (
                                                    <div
                                                        key={q.id}
                                                        className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}
                                                    >
                                                        <div>
                                                            <p className={`text-sm ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{q.question_text}</p>
                                                            <p className="text-xs text-slate-400 mt-1">
                                                                {new Date(q.created_at).toLocaleString()} · Ruta: {q.source_page || 'N/D'}
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteChatbotQuestion(q.id)}
                                                            className="text-sm text-red-500"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="mt-8">
                                <button
                                    type="button"
                                    onClick={() => setShowAdvancedChatbotConfig(!showAdvancedChatbotConfig)}
                                    className={`px-5 py-3 rounded-2xl text-sm font-semibold ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                                >
                                    {showAdvancedChatbotConfig ? 'Ocultar más configuraciones' : 'Más configuraciones'}
                                </button>

                                {showAdvancedChatbotConfig && (
                                    <div className="mt-4 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-semibold">Base URL (opcional)</label>
                                                <input
                                                    type="text"
                                                    value={chatbotForm.base_url}
                                                    onChange={(e) => setChatbotForm({ ...chatbotForm, base_url: e.target.value })}
                                                    placeholder="https://api.groq.com/openai/v1"
                                                    className={`w-full mt-2 p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                                />
                                            </div>
                                        </div>

                                        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                            <p className="text-sm font-semibold mb-3">Configuración híbrida</p>
                                            <label className={`flex items-center gap-2 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={chatbotForm.fallback_enabled}
                                                    onChange={(e) => setChatbotForm({ ...chatbotForm, fallback_enabled: e.target.checked })}
                                                />
                                                Usar segunda API si la principal falla
                                            </label>
                                            <div className="mt-3">
                                                <label className="text-sm font-semibold">Proveedor principal</label>
                                                <select
                                                    value={chatbotForm.primary_provider}
                                                    onChange={(e) => setChatbotForm({ ...chatbotForm, primary_provider: e.target.value })}
                                                    className={`w-full mt-2 p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                                                >
                                                    <option value="groq">Groq</option>
                                                    <option value="gemini">Gemini</option>
                                                </select>
                                                <p className={`text-xs mt-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    La secundaria será la otra API.
                                                </p>
                                            </div>
                                        </div>

                                        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                            <p className="text-sm font-semibold mb-3">Agregar modelo</p>
                                            <form onSubmit={handleAddAiModel} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <select
                                                    value={aiModelForm.provider}
                                                    onChange={(e) => setAiModelForm({ ...aiModelForm, provider: e.target.value })}
                                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                                                >
                                                    <option value="groq">Groq</option>
                                                    <option value="gemini">Gemini</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    value={aiModelForm.name}
                                                    onChange={(e) => setAiModelForm({ ...aiModelForm, name: e.target.value })}
                                                    placeholder="llama-3.1-70b, gemini-3.0-flash"
                                                    className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                                                />
                                                <button
                                                    type="submit"
                                                    className="px-4 py-3 rounded-xl bg-blue-800 text-white font-bold"
                                                >
                                                    Agregar modelo
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </section>
                    )}

                    {activeNav === 'gmail' && (
                        <section className={`rounded-[2rem] p-6 md:p-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-800">mail</span> Notificaciones Gmail
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    gmailConnected 
                                        ? (darkMode ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-700')
                                        : (darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700')
                                }`}>
                                    {gmailChecking ? 'Verificando...' : (gmailConnected ? `✓ ${gmailEmail || 'Conectado'}` : 'No conectado')}
                                </span>
                            </div>

                            {/* Info box */}
                            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                                <p className="text-sm font-semibold mb-2">📧 Envía correos usando tu cuenta de Google</p>
                                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {gmailConnected 
                                        ? 'Gmail está conectado. Puedes enviar correos a los alumnos por grado/grupo.'
                                        : 'Para usar Gmail, cierra sesión e inicia sesión nuevamente con Google. El sistema pedirá permiso para enviar correos en tu nombre.'}
                                </p>
                            </div>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold">Asunto</label>
                                    <input
                                        type="text"
                                        value={gmailForm.subject}
                                        onChange={(e) => setGmailForm({ ...gmailForm, subject: e.target.value })}
                                        placeholder="Aviso importante"
                                        className={`w-full mt-2 p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold">Enviar a todos</label>
                                    <div className={`mt-2 p-3 rounded-xl border flex items-center gap-3 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                        <input
                                            type="checkbox"
                                            checked={gmailForm.sendToAll}
                                            onChange={(e) => setGmailForm({ ...gmailForm, sendToAll: e.target.checked })}
                                        />
                                        <span className="text-sm">Ignorar filtros por grado/grupo</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold">Contenido (HTML)</label>
                                    <textarea
                                        value={gmailForm.messageHtml}
                                        onChange={(e) => setGmailForm({ ...gmailForm, messageHtml: e.target.value })}
                                        rows="6"
                                        placeholder="<b>Hola</b> estudiantes..."
                                        className={`w-full mt-2 p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold">Contenido (texto plano)</label>
                                    <textarea
                                        value={gmailForm.messageText}
                                        onChange={(e) => setGmailForm({ ...gmailForm, messageText: e.target.value })}
                                        rows="6"
                                        placeholder="Hola estudiantes..."
                                        className={`w-full mt-2 p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
                                    <p className="text-sm font-semibold mb-3">Grados</p>
                                    <div className="flex flex-wrap gap-2">
                                        {[1, 2, 3, 4, 5, 6].map((grade) => (
                                            <button
                                                key={grade}
                                                type="button"
                                                onClick={() => toggleGmailGrade(grade)}
                                                className={`px-3 py-2 rounded-xl text-sm font-semibold border ${gmailForm.grados.includes(grade)
                                                    ? (darkMode ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-800 text-white border-blue-800')
                                                    : (darkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-50 text-slate-600 border-slate-200')
                                                }`}
                                            >
                                                {grade}°
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
                                    <p className="text-sm font-semibold mb-3">Grupos</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(() => {
                                            const defaults = ['A', 'B', 'C', 'D', 'F'];
                                            const fromStudents = Array.from(new Set(students.map((s) => s.grupo).filter(Boolean))).sort();
                                            const groups = fromStudents.length ? fromStudents : defaults;
                                            return groups.map((group) => (
                                                <button
                                                    key={group}
                                                    type="button"
                                                    onClick={() => toggleGmailGroup(group)}
                                                    className={`px-3 py-2 rounded-xl text-sm font-semibold border ${gmailForm.grupos.includes(group)
                                                        ? (darkMode ? 'bg-green-600 text-white border-green-600' : 'bg-green-600 text-white border-green-600')
                                                        : (darkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-50 text-slate-600 border-slate-200')
                                                    }`}
                                                >
                                                    {group}
                                                </button>
                                            ));
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {gmailStatus && (
                                <div className={`mt-4 p-4 rounded-2xl border ${gmailStatus.type === 'success'
                                    ? (darkMode ? 'bg-emerald-900/30 border-emerald-700 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-800')
                                    : (darkMode ? 'bg-red-900/30 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-700')
                                }`}>
                                    {gmailStatus.message}
                                </div>
                            )}

                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                {!gmailConnected && (
                                    <button
                                        type="button"
                                        onClick={refreshGmailCredentials}
                                        className="px-5 py-3 rounded-2xl bg-blue-800 text-white font-bold shadow hover:scale-[1.01] transition-all"
                                    >
                                        🔐 Conectar Gmail
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={checkGmailStatus}
                                    disabled={gmailChecking}
                                    className={`px-5 py-3 rounded-2xl font-semibold ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                                >
                                    {gmailChecking ? 'Verificando...' : '🔄 Verificar conexión'}
                                </button>
                                <button
                                    type="button"
                                    onClick={sendGmailNotifications}
                                    disabled={gmailSending || !gmailConnected}
                                    className={`px-5 py-3 rounded-2xl font-bold ${gmailSending || !gmailConnected
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:scale-[1.01]'
                                    } ${gmailConnected ? 'bg-green-600 text-white' : (darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500')}`}
                                >
                                    {gmailSending ? '📨 Enviando...' : '📧 Enviar correo'}
                                </button>
                            </div>
                        </section>
                    )}

                    {activeNav === 'storage' && (
                        <section className={`rounded-[2rem] p-6 md:p-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-800">storage</span> Almacenamiento
                                </h3>
                                <button
                                    type="button"
                                    onClick={fetchStorageUsage}
                                    className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}
                                >
                                    Actualizar
                                </button>
                            </div>

                            {storageLoading ? (
                                <p className="text-sm text-slate-500">Cargando...</p>
                            ) : storageUsage ? (
                                <>
                                    <div className={`w-full h-5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                                        {(() => {
                                            const total = storageUsage.total_bytes || 0;
                                            const db = storageUsage.db_bytes || 0;
                                            const storage = storageUsage.storage_bytes || 0;
                                            const dbPct = total ? Math.round((db / total) * 100) : 0;
                                            const storagePct = total ? 100 - dbPct : 0;
                                            return (
                                                <div className="w-full h-full flex">
                                                    <div style={{ width: `${dbPct}%` }} className="h-full bg-blue-600" />
                                                    <div style={{ width: `${storagePct}%` }} className="h-full bg-green-500" />
                                                </div>
                                            );
                                        })()}
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm mt-4">
                                        <span className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-blue-600" />
                                            BD: {formatBytes(storageUsage.db_bytes)}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-green-500" />
                                            Storage: {formatBytes(storageUsage.storage_bytes)}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            Total: {formatBytes(storageUsage.total_bytes)}
                                        </span>
                                    </div>

                                    {storageUsage.buckets?.length > 0 && (
                                        <div className="space-y-2 mt-4">
                                            <h5 className="text-sm font-semibold">Buckets</h5>
                                            {storageUsage.buckets.map((bucket) => (
                                                <div key={bucket.bucket_id} className={`p-3 rounded-xl border ${darkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-100 bg-white'}`}>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span>{bucket.bucket_id}</span>
                                                        <span>{formatBytes(bucket.size_bytes)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-sm text-slate-500">Sin datos de almacenamiento.</p>
                            )}
                        </section>
                    )}

                    {activeNav === 'access' && (
                        <section className={`rounded-[2rem] p-6 md:p-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-orange-500">security</span> Acceso a la Página
                                </h3>
                                <button
                                    type="button"
                                    onClick={fetchAccessConfig}
                                    className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}
                                >
                                    Actualizar
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Configuración Alumnos */}
                                <div className={`p-5 rounded-2xl border ${darkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-slate-50'}`}>
                                    <h4 className="font-semibold flex items-center gap-2 mb-4">
                                        <span className="material-symbols-outlined text-green-500">school</span>
                                        Acceso de Alumnos
                                    </h4>
                                    <p className={`text-sm mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        Solo los correos con este dominio podrán acceder al portal de alumnos.
                                    </p>
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            Dominio de correo permitido
                                        </label>
                                        <input
                                            type="text"
                                            value={accessConfig.alumno_domain}
                                            onChange={(e) => setAccessConfig({ ...accessConfig, alumno_domain: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                                            placeholder="@cbta134.edu.mx"
                                        />
                                        <p className={`text-xs mt-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                            Ejemplo: @cbta134.edu.mx (incluir el @)
                                        </p>
                                    </div>
                                </div>

                                {/* Configuración Maestros */}
                                <div className={`p-5 rounded-2xl border ${darkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-slate-50'}`}>
                                    <h4 className="font-semibold flex items-center gap-2 mb-4">
                                        <span className="material-symbols-outlined text-blue-500">admin_panel_settings</span>
                                        Acceso de Maestros
                                    </h4>
                                    <p className={`text-sm mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        Código de seguridad requerido después de iniciar sesión con Google.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                Usuario de seguridad
                                            </label>
                                            <input
                                                type="text"
                                                value={accessConfig.maestro_user}
                                                onChange={(e) => setAccessConfig({ ...accessConfig, maestro_user: e.target.value })}
                                                className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                                                placeholder="cbta"
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                Contraseña de seguridad
                                            </label>
                                            <input
                                                type="text"
                                                value={accessConfig.maestro_password}
                                                onChange={(e) => setAccessConfig({ ...accessConfig, maestro_password: e.target.value })}
                                                className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                                                placeholder="cbta134#pagina"
                                            />
                                        </div>
                                    </div>
                                    <p className={`text-xs mt-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                        Los maestros deberán ingresar estas credenciales después de iniciar sesión con Google.
                                    </p>
                                </div>

                                {/* Botón Guardar */}
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={saveAccessConfig}
                                        disabled={accessConfigLoading}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {accessConfigLoading ? 'Guardando...' : 'Guardar Configuración'}
                                    </button>
                                    {accessConfigSaved && (
                                        <span className="text-green-500 font-medium flex items-center gap-1">
                                            <span className="material-symbols-outlined">check_circle</span>
                                            Guardado correctamente
                                        </span>
                                    )}
                                </div>

                                {/* Cuentas Permitidas del EduPanel - Solo visible para cuenta maestra */}
                                {isMasterAccount && (
                                    <div className={`p-5 rounded-2xl border ${darkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-slate-50'}`}>
                                        <h4 className="font-semibold flex items-center gap-2 mb-4">
                                            <span className="material-symbols-outlined text-purple-500">group_add</span>
                                            Cuentas Permitidas del EduPanel
                                        </h4>
                                        <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            Solo las cuentas en esta lista pueden acceder al panel administrativo.
                                        </p>
                                        
                                        {/* Agregar nueva cuenta */}
                                        <div className="flex gap-2 mb-4">
                                            <input
                                                type="email"
                                                value={newAllowedEmail}
                                                onChange={(e) => setNewAllowedEmail(e.target.value)}
                                                className={`flex-1 px-4 py-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                                                placeholder="correo@ejemplo.com"
                                            />
                                            <button
                                                onClick={addAllowedAccount}
                                                disabled={addingAccount || !newAllowedEmail.trim()}
                                                className="px-4 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
                                            >
                                                {addingAccount ? '...' : 'Agregar'}
                                            </button>
                                        </div>
                                        
                                        {/* Lista de cuentas */}
                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                            {allowedAccounts.map((account) => (
                                                <div 
                                                    key={account.id} 
                                                    className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-slate-400">
                                                            {account.is_master ? 'verified_user' : 'person'}
                                                        </span>
                                                        <div>
                                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                                                {account.email}
                                                            </p>
                                                            {account.is_master && (
                                                                <span className="text-xs text-purple-500 font-medium">Cuenta Maestra</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => toggleMasterStatus(account.id, account.email, account.is_master)}
                                                            className={`p-2 rounded-lg transition-colors ${
                                                                account.is_master 
                                                                    ? 'text-amber-500 hover:bg-amber-50' 
                                                                    : 'text-purple-500 hover:bg-purple-50'
                                                            }`}
                                                            title={account.is_master ? 'Quitar rol de maestra' : 'Hacer cuenta maestra'}
                                                        >
                                                            <span className="material-symbols-outlined text-sm">
                                                                {account.is_master ? 'remove_moderator' : 'add_moderator'}
                                                            </span>
                                                        </button>
                                                        <button
                                                            onClick={() => removeAllowedAccount(account.id, account.email, account.is_master)}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Eliminar cuenta"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {allowedAccounts.length === 0 && (
                                                <p className={`text-sm text-center py-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    No hay cuentas configuradas.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>
                )}
            </main>

            {/* FAB Button Mobile */}
            <button 
                onClick={() => setShowClubModal(true)}
                className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-800 text-white rounded-full shadow-2xl z-50 flex items-center justify-center active:scale-90 transition-transform"
            >
                <span className="material-symbols-outlined">add</span>
            </button>

            {/* Modal Edición de Alumno */}
            {editingProfile && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className={`w-full max-w-md rounded-3xl shadow-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                        <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                            <h2 className="text-xl font-bold">Editar Alumno</h2>
                            <button 
                                onClick={() => setEditingProfile(null)}
                                className={`p-2 rounded-xl ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
                            <div>
                                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Nombre(s):</label>
                                <input
                                    value={editingProfile.nombre}
                                    onChange={e => setEditingProfile({ ...editingProfile, nombre: e.target.value })}
                                    className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Apellidos:</label>
                                <input
                                    value={editingProfile.apellidos}
                                    onChange={e => setEditingProfile({ ...editingProfile, apellidos: e.target.value })}
                                    className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Correo:</label>
                                <input
                                    type="email"
                                    value={editingProfile.email || ''}
                                    onChange={e => setEditingProfile({ ...editingProfile, email: e.target.value })}
                                    className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>No. Control (14 dígitos):</label>
                                <input
                                    value={editingProfile.numero_control || ''}
                                    maxLength={14}
                                    onChange={e => {
                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                        setEditingProfile({ ...editingProfile, numero_control: val });
                                    }}
                                    className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>CURP:</label>
                                <input
                                    value={editingProfile.curp}
                                    onChange={e => setEditingProfile({ ...editingProfile, curp: e.target.value })}
                                    className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                            </div>
                            <button 
                                type="submit"
                                className="w-full py-3 bg-blue-800 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                            >
                                💾 Guardar Cambios
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Calificaciones */}
            {editingStudent && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                        <div className={`flex items-center justify-between p-6 border-b sticky top-0 ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-white'}`}>
                            <h2 className="text-xl font-bold">Calificaciones: {editingStudent.nombre}</h2>
                            <button 
                                onClick={() => setEditingStudent(null)}
                                className={`p-2 rounded-xl ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <label className="font-semibold">Semestre:</label>
                                <select
                                    value={selectedSemester}
                                    onChange={(e) => {
                                        const sem = parseInt(e.target.value);
                                        setSelectedSemester(sem);
                                        fetchGrades(editingStudent.id, sem);
                                    }}
                                    className={`px-4 py-2 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                >
                                    {[1, 2, 3, 4, 5, 6].map(s => <option key={s} value={s}>{s}° Semestre</option>)}
                                </select>
                            </div>

                            <div className={`rounded-2xl overflow-hidden mb-6 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                <table className="w-full">
                                    <thead>
                                        <tr className={darkMode ? 'bg-slate-800' : 'bg-slate-100'}>
                                            <th className="p-4 text-left font-semibold">Materia</th>
                                            <th className="p-4 text-left font-semibold">Tipo</th>
                                            <th className="p-4 text-center font-semibold">P1</th>
                                            <th className="p-4 text-center font-semibold">P2</th>
                                            <th className="p-4 text-center font-semibold">P3</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {grades.map(grade => (
                                            <tr key={grade.id} className={`border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                                <td className="p-4">{grade.materia}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-lg text-xs font-bold text-white ${grade.tipo_materia === 'especialidad' ? 'bg-purple-500' : 'bg-blue-500'}`}>
                                                        {grade.tipo_materia === 'especialidad' ? 'Especialidad' : 'Básica'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <input 
                                                        type="number" 
                                                        defaultValue={grade.parcial1} 
                                                        onBlur={(e) => handleSaveGrade(grade.id, 'parcial1', e.target.value)}
                                                        className={`w-16 p-2 text-center rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-200'}`}
                                                    />
                                                </td>
                                                <td className="p-4 text-center">
                                                    <input 
                                                        type="number" 
                                                        defaultValue={grade.parcial2} 
                                                        onBlur={(e) => handleSaveGrade(grade.id, 'parcial2', e.target.value)}
                                                        className={`w-16 p-2 text-center rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-200'}`}
                                                    />
                                                </td>
                                                <td className="p-4 text-center">
                                                    <input 
                                                        type="number" 
                                                        defaultValue={grade.parcial3} 
                                                        onBlur={(e) => handleSaveGrade(grade.id, 'parcial3', e.target.value)}
                                                        className={`w-16 p-2 text-center rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-200'}`}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Add New Subject */}
                            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-slate-900' : 'bg-green-50'}`}>
                                <h4 className={`font-bold mb-4 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Agregar Nueva Materia</h4>
                                <div className="space-y-4">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <input
                                            placeholder="Nombre de la Materia"
                                            value={newSubject.materia}
                                            onChange={e => setNewSubject({ ...newSubject, materia: e.target.value })}
                                            className={`flex-1 p-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                                        />
                                        <select
                                            value={newSubject.tipo}
                                            onChange={e => setNewSubject({ ...newSubject, tipo: e.target.value })}
                                            className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                                        >
                                            <option value="basica">Tronco Común</option>
                                            <option value="especialidad">Especialidad</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-wrap gap-4 items-center">
                                        <input 
                                            type="number" 
                                            placeholder="P1" 
                                            value={newSubject.parcial1} 
                                            onChange={e => setNewSubject({ ...newSubject, parcial1: e.target.value })}
                                            className={`w-20 p-3 text-center rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                                        />
                                        <input 
                                            type="number" 
                                            placeholder="P2" 
                                            value={newSubject.parcial2} 
                                            onChange={e => setNewSubject({ ...newSubject, parcial2: e.target.value })}
                                            className={`w-20 p-3 text-center rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                                        />
                                        <input 
                                            type="number" 
                                            placeholder="P3" 
                                            value={newSubject.parcial3} 
                                            onChange={e => setNewSubject({ ...newSubject, parcial3: e.target.value })}
                                            className={`w-20 p-3 text-center rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                                        />
                                        <button 
                                            onClick={handleAddSubject}
                                            className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors"
                                        >
                                            + Agregar Materia
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className={`flex justify-end pt-6 border-t mt-6 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                <button 
                                    onClick={() => setEditingStudent(null)}
                                    className="px-8 py-3 bg-blue-800 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                                >
                                    💾 Guardar y Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <AddClubModal
                isOpen={showClubModal}
                onClose={() => {
                    setShowClubModal(false);
                    setClubToEdit(null);
                }}
                onClubAdded={fetchClubs}
                clubToEdit={clubToEdit}
            />

            <AddCareerModal
                isOpen={showCareerModal}
                onClose={() => {
                    setShowCareerModal(false);
                    setCareerToEdit(null);
                }}
                onCareerAdded={fetchCareers}
                careerToEdit={careerToEdit}
            />
        </div>
    );
};

export default MaestrosAdmin;
