import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const AlumnosAdmin = ({ darkMode }) => {
    // Estados de navegación y filtros
    const [viewLevel, setViewLevel] = useState('semesters'); // semesters, groups, students
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Estados de datos
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    // Estados de edición de perfil
    const [editingStudent, setEditingStudent] = useState(null);
    const [profileForm, setProfileForm] = useState({
        nombre: '',
        apellidos: '',
        numero_control: '',
        curp: '',
        semestre: '',
        grupo: '',
        carrera_tecnica: '',
        estatus: 'Regular'
    });
    const [savingProfile, setSavingProfile] = useState(false);

    // Estados de calificaciones
    const [viewingGrades, setViewingGrades] = useState(null);
    const [currentGrades, setCurrentGrades] = useState([]);
    const [loadingGrades, setLoadingGrades] = useState(false);
    const [newGrade, setNewGrade] = useState({ materia: '', calificacion: '' });

    // ── Carga de datos ──────────────────────────────────────────────────────
    const fetchStudents = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('alumnos_perfiles')
            .select('*')
            .order('apellidos', { ascending: true });

        if (!error && data) setStudents(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // ── Lógica de filtrado ──────────────────────────────────────────────────
    const getAvailableGroups = (semester) => {
        const groups = students
            .filter(s => s.semestre === semester && s.grupo)
            .map(s => s.grupo);
        return [...new Set(groups)].sort();
    };

    const getFilteredStudents = () => {
        return students.filter(student => {
            const matchesSemester = selectedSemester ? student.semestre === selectedSemester : true;
            const matchesGroup = selectedGroup ? student.grupo === selectedGroup : true;
            const fullName = `${student.nombre} ${student.apellidos}`.toLowerCase();
            const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                student.curp?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.numero_control?.toLowerCase().includes(searchQuery.toLowerCase());

            // Si estamos en nivel 'students', obligamos a que coincida semestre y grupo
            if (viewLevel === 'students') {
                return matchesSemester && matchesGroup && matchesSearch;
            }
            return matchesSearch;
        });
    };

    // ── Gestión de Perfiles ─────────────────────────────────────────────────
    const handleEditProfile = (student) => {
        setEditingStudent(student);
        setProfileForm({
            nombre: student.nombre || '',
            apellidos: student.apellidos || '',
            numero_control: student.numero_control || '',
            curp: student.curp || '',
            semestre: student.semestre || '',
            grupo: student.grupo || '',
            carrera_tecnica: student.carrera_tecnica || '',
            estatus: student.estatus || 'Regular'
        });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        const { error } = await supabase
            .from('alumnos_perfiles')
            .update(profileForm)
            .eq('id', editingStudent.id);

        if (error) {
            alert('Error al actualizar perfil: ' + error.message);
        } else {
            setEditingStudent(null);
            fetchStudents();
        }
        setSavingProfile(false);
    };

    const handleDeleteStudent = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar a este alumno? Esta acción no se puede deshacer.')) return;

        const { error } = await supabase
            .from('alumnos_perfiles')
            .delete()
            .eq('id', id);

        if (error) alert('Error: ' + error.message);
        else fetchStudents();
    };

    // ── Gestión de Calificaciones ───────────────────────────────────────────
    const openGradesModal = async (student) => {
        setViewingGrades(student);
        fetchGrades(student.id, student.semestre);
    };

    const fetchGrades = async (studentId, semestre) => {
        setLoadingGrades(true);
        const { data, error } = await supabase
            .from('calificaciones')
            .select('*')
            .eq('student_id', studentId)
            .eq('semestre', semestre);

        if (!error && data) setCurrentGrades(data);
        setLoadingGrades(false);
    };

    const handleSaveGrade = async (gradeId, field, value) => {
        const { error } = await supabase
            .from('calificaciones')
            .update({ [field]: value })
            .eq('id', gradeId);

        if (error) alert('Error al guardar calificación: ' + error.message);
    };

    const handleAddSubject = async () => {
        if (!newGrade.materia) return;
        const { error } = await supabase
            .from('calificaciones')
            .insert([{
                student_id: viewingGrades.id,
                semestre: viewingGrades.semestre,
                materia: newGrade.materia,
                calificacion: newGrade.calificacion || null
            }]);

        if (error) alert('Error al agregar materia: ' + error.message);
        else {
            setNewGrade({ materia: '', calificacion: '' });
            fetchGrades(viewingGrades.id, viewingGrades.semestre);
        }
    };

    // ── Renderizado ─────────────────────────────────────────────────────────
    const inputClass = `w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200'} focus:ring-2 focus:ring-blue-500 outline-none transition-all`;

    return (
        <div className="space-y-8">
            {/* Buscador Global para Alumnos */}
            <div className={`p-4 rounded-3xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, CURP o No. Control..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            if (e.target.value) setViewLevel('students');
                        }}
                        className={`w-full pl-12 pr-4 py-3 rounded-2xl border-none ring-1 ${darkMode ? 'bg-slate-900 ring-slate-700 text-white' : 'bg-slate-50 ring-slate-200'} focus:ring-2 focus:ring-blue-500 transition-all`}
                    />
                </div>
            </div>

            {/* Navegación por Semestres */}
            {viewLevel === 'semesters' && (
                <section animate-in="fade">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600">layers</span> Gestión por Semestre
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(sem => (
                            <div
                                key={sem}
                                onClick={() => { setSelectedSemester(sem); setViewLevel('groups'); }}
                                className={`group p-6 rounded-3xl shadow-sm border cursor-pointer transition-all text-center ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-blue-400' : 'bg-white border-slate-100 hover:border-blue-800 shadow-xl shadow-slate-200/50'
                                    }`}
                            >
                                <div className={`text-4xl font-black mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>{sem}°</div>
                                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Semestre</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Vista de Grupos */}
            {viewLevel === 'groups' && selectedSemester && (
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold">Grupos - {selectedSemester}° Semestre</h3>
                            <button onClick={() => { setViewLevel('semesters'); setSelectedSemester(null); }} className="text-sm text-blue-500 hover:underline">← Volver a semestres</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {getAvailableGroups(selectedSemester).map(grupo => (
                            <div
                                key={grupo}
                                onClick={() => { setSelectedGroup(grupo); setViewLevel('students'); }}
                                className={`p-6 rounded-3xl border-l-4 border-l-green-500 cursor-pointer transition-all text-center ${darkMode ? 'bg-slate-800 border border-slate-700 hover:border-green-400' : 'bg-white border border-slate-100 hover:border-green-500 shadow-sm'
                                    }`}
                            >
                                <div className="text-4xl font-black text-green-500 mb-1">{grupo}</div>
                                <div className="text-xs uppercase font-bold tracking-wider text-slate-400">Grupo</div>
                            </div>
                        ))}
                        {getAvailableGroups(selectedSemester).length === 0 && (
                            <p className="col-span-full py-12 text-center text-slate-400 italic">No hay grupos registrados en este semestre.</p>
                        )}
                    </div>
                </section>
            )}

            {/* Vista de Alumnos / Resultados de Búsqueda */}
            {(viewLevel === 'students' || searchQuery) && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold">
                                {searchQuery ? 'Resultados de búsqueda' : `Alumnos - ${selectedSemester}° ${selectedGroup}`}
                            </h3>
                            {!searchQuery && (
                                <button onClick={() => { setViewLevel('groups'); setSelectedGroup(null); }} className="text-sm text-blue-500 hover:underline">← Volver a grupos</button>
                            )}
                        </div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {getFilteredStudents().length} alumnos
                        </div>
                    </div>

                    <div className={`rounded-3xl overflow-hidden border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className={darkMode ? 'bg-slate-900/50' : 'bg-slate-50'}>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre del Alumno</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Control / CURP</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estatus</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getFilteredStudents().map(student => (
                                        <tr key={student.id} className={`border-t ${darkMode ? 'border-slate-700 hover:bg-slate-700/30' : 'border-slate-50 hover:bg-slate-50/50'} transition-colors`}>
                                            <td className="p-4">
                                                <div className="font-bold">{student.apellidos} {student.nombre}</div>
                                                <div className="text-xs text-slate-400">{student.carrera_tecnica || 'Carrera no asignada'}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm font-mono">{student.numero_control || 'S/N'}</div>
                                                <div className="text-[10px] text-slate-400">{student.curp}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${student.estatus === 'Baja' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                                    }`}>
                                                    {student.estatus || 'Regular'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => openGradesModal(student)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors" title="Calificaciones">📝</button>
                                                    <button onClick={() => handleEditProfile(student)} className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors" title="Editar Perfil">✏️</button>
                                                    <button onClick={() => handleDeleteStudent(student.id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors" title="Eliminar">🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {getFilteredStudents().length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="p-12 text-center text-slate-400 italic">No se encontraron alumnos con los criterios actuales.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}

            {/* MODAL: Calificaciones */}
            {viewingGrades && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm shadow-2xl" onClick={() => setViewingGrades(null)}></div>
                    <div className={`relative w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                        <div className="p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h4 className="text-2xl font-black">Calificaciones</h4>
                                    <p className="text-slate-500">{viewingGrades.nombre} {viewingGrades.apellidos} • {viewingGrades.semestre}° {viewingGrades.grupo}</p>
                                </div>
                                <button onClick={() => setViewingGrades(null)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400">✕</button>
                            </div>

                            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                {loadingGrades ? (
                                    <div className="py-8 text-center text-slate-400 animate-pulse">Cargando materias...</div>
                                ) : currentGrades.map(grade => (
                                    <div key={grade.id} className={`p-4 rounded-2xl border flex items-center justify-between ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                                        <span className="font-bold text-sm truncate pr-4">{grade.materia}</span>
                                        <input
                                            type="number"
                                            defaultValue={grade.calificacion}
                                            onBlur={(e) => handleSaveGrade(grade.id, 'calificacion', e.target.value)}
                                            className={`w-20 p-2 text-center font-bold rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                                            placeholder="0.0"
                                            step="0.1"
                                            min="0"
                                            max="10"
                                        />
                                    </div>
                                ))}
                                {!loadingGrades && currentGrades.length === 0 && (
                                    <p className="py-8 text-center text-slate-400 italic text-sm">No hay materias registradas para este semestre.</p>
                                )}
                            </div>

                            <div className={`mt-8 p-6 rounded-3xl border-2 border-dashed ${darkMode ? 'border-slate-700 bg-slate-900/40' : 'border-blue-100 bg-blue-50/30'}`}>
                                <p className="text-xs font-bold text-blue-600 uppercase mb-3 px-1">Nueva materia</p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Ej: Matemáticas"
                                        value={newGrade.materia}
                                        onChange={e => setNewGrade({ ...newGrade, materia: e.target.value })}
                                        className={inputClass}
                                    />
                                    <button onClick={handleAddSubject} className="px-6 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors">Añadir</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: Editar Perfil */}
            {editingStudent && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingStudent(null)}></div>
                    <div className={`relative w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                        <div className="p-8 max-h-[90vh] overflow-y-auto">
                            <h4 className="text-2xl font-black mb-6">✏️ Editar Perfil del Alumno</h4>
                            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Nombre(s)</label>
                                    <input type="text" value={profileForm.nombre} onChange={e => setProfileForm({ ...profileForm, nombre: e.target.value })} className={inputClass} required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Apellidos</label>
                                    <input type="text" value={profileForm.apellidos} onChange={e => setProfileForm({ ...profileForm, apellidos: e.target.value })} className={inputClass} required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">No. de Control</label>
                                    <input type="text" value={profileForm.numero_control} onChange={e => setProfileForm({ ...profileForm, numero_control: e.target.value })} className={inputClass} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">CURP</label>
                                    <input type="text" value={profileForm.curp} onChange={e => setProfileForm({ ...profileForm, curp: e.target.value })} className={inputClass} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Semestre</label>
                                    <select value={profileForm.semestre} onChange={e => setProfileForm({ ...profileForm, semestre: parseInt(e.target.value) })} className={inputClass}>
                                        {[1, 2, 3, 4, 5, 6].map(num => <option key={num} value={num}>{num}° Semestre</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Grupo</label>
                                    <input type="text" value={profileForm.grupo} onChange={e => setProfileForm({ ...profileForm, grupo: e.target.value.toUpperCase() })} className={inputClass} placeholder="A, B, C..." />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Carrera Técnica</label>
                                    <input type="text" value={profileForm.carrera_tecnica} onChange={e => setProfileForm({ ...profileForm, carrera_tecnica: e.target.value })} className={inputClass} />
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                                    <button type="button" onClick={() => setEditingStudent(null)} className={`px-6 py-3 rounded-2xl font-bold transition-all ${darkMode ? 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Cancelar</button>
                                    <button type="submit" disabled={savingProfile} className="px-8 py-3 bg-blue-800 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none hover:scale-105 transition-all disabled:opacity-50">
                                        {savingProfile ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlumnosAdmin;
