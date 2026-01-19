import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AddCareerModal = ({ isOpen, onClose, onCareerAdded, careerToEdit = null }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        programa_competencia: '',
        justificacion: '',
        perfil_egreso: '',
        area_especializacion: '',
        habilidades_socioemocionales: '',
        oportunidades_profesionales: '',
        imagenFile: null,
        pdfFile: null,
        pdf_start_page: 1
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (careerToEdit) {
            setFormData({
                nombre: careerToEdit.nombre || '',
                descripcion: careerToEdit.descripcion || '',
                programa_competencia: careerToEdit.programa_competencia || '',
                justificacion: careerToEdit.justificacion || '',
                perfil_egreso: careerToEdit.perfil_egreso || '',
                area_especializacion: careerToEdit.area_especializacion || '',
                habilidades_socioemocionales: careerToEdit.habilidades_socioemocionales || '',
                oportunidades_profesionales: careerToEdit.oportunidades_profesionales || '',
                imagenFile: null,
                pdfFile: null,
                pdf_start_page: careerToEdit.pdf_start_page || 1,
                existingImagenUrl: careerToEdit.imagen_url,
                existingPdfUrl: careerToEdit.plan_estudios_url
            });
        } else {
            setFormData({
                nombre: '',
                descripcion: '',
                programa_competencia: '',
                justificacion: '',
                perfil_egreso: '',
                area_especializacion: '',
                habilidades_socioemocionales: '',
                oportunidades_profesionales: '',
                imagenFile: null,
                pdfFile: null,
                pdf_start_page: 1
            });
        }
    }, [careerToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, type) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, [type]: e.target.files[0] }));
        }
    };

    const uploadFile = async (file, folder) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
            .from('carreras_media')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
            .from('carreras_media')
            .getPublicUrl(fileName);

        return publicUrlData.publicUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let imagen_url = formData.existingImagenUrl;
            let plan_estudios_url = formData.existingPdfUrl;

            // Upload new image if selected
            if (formData.imagenFile) {
                imagen_url = await uploadFile(formData.imagenFile, 'images');
            }

            // Upload new PDF if selected
            if (formData.pdfFile) {
                plan_estudios_url = await uploadFile(formData.pdfFile, 'pdfs');
            }

            // Validate required image
            if (!imagen_url) {
                throw new Error('La imagen es obligatoria');
            }

            const payload = {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                imagen_url,
                programa_competencia: formData.programa_competencia,
                justificacion: formData.justificacion,
                perfil_egreso: formData.perfil_egreso,
                area_especializacion: formData.area_especializacion,
                habilidades_socioemocionales: formData.habilidades_socioemocionales,
                oportunidades_profesionales: formData.oportunidades_profesionales,
                plan_estudios_url: plan_estudios_url || null,
                pdf_start_page: parseInt(formData.pdf_start_page) || 1
            };

            let query;
            if (careerToEdit) {
                query = supabase
                    .from('carreras_tecnicas')
                    .update(payload)
                    .eq('id', careerToEdit.id);
            } else {
                query = supabase
                    .from('carreras_tecnicas')
                    .insert([payload]);
            }

            const { error: dbError } = await query;
            if (dbError) throw dbError;

            onCareerAdded();
            onClose();

        } catch (err) {
            console.error('Error saving career:', err);
            setError(err.message || 'Error al guardar la carrera técnica');
        } finally {
            setLoading(false);
        }
    };

    // Styles
    const modalOverlayStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000
    };

    const modalContentStyle = {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '15px',
        width: '90%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        color: '#333'
    };

    const inputGroupStyle = { marginBottom: '15px' };
    const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#555' };
    const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px' };
    const buttonStyle = {
        padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer',
        fontWeight: 'bold', marginTop: '10px'
    };

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, color: '#2c3e50' }}>{careerToEdit ? 'Editar Carrera Técnica' : 'Agregar Nueva Carrera Técnica'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999' }}>×</button>
                </div>

                {error && <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Nombre de la Carrera*</label>
                        <input
                            required
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            style={inputStyle}
                            placeholder="Ej. Técnico en Programación"
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Descripción</label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            style={{ ...inputStyle, minHeight: '80px', fontFamily: 'inherit' }}
                            placeholder="Descripción general de la carrera..."
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Imagen de la Carrera*</label>
                        {formData.existingImagenUrl && (
                            <div style={{ marginBottom: '10px' }}>
                                <img src={formData.existingImagenUrl} alt="Preview" style={{ height: '60px', borderRadius: '5px' }} />
                                <p style={{ fontSize: '11px', margin: '2px 0 10px 0' }}>Imagen actual (subir otra para cambiar)</p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'imagenFile')}
                            style={{ ...inputStyle, border: 'none' }}
                            required={!formData.existingImagenUrl}
                        />
                        <p style={{ fontSize: '12px', color: '#999', margin: '5px 0 0 0' }}>Formatos: JPG, PNG, WEBP</p>
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Programa de Competencias</label>
                        <textarea
                            name="programa_competencia"
                            value={formData.programa_competencia}
                            onChange={handleChange}
                            style={{ ...inputStyle, minHeight: '100px', fontFamily: 'inherit' }}
                            placeholder="Descripción del programa de competencias..."
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Justificación</label>
                        <textarea
                            name="justificacion"
                            value={formData.justificacion}
                            onChange={handleChange}
                            style={{ ...inputStyle, minHeight: '100px', fontFamily: 'inherit' }}
                            placeholder="Justificación de la carrera..."
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Perfil de Egreso</label>
                        <textarea
                            name="perfil_egreso"
                            value={formData.perfil_egreso}
                            onChange={handleChange}
                            style={{ ...inputStyle, minHeight: '100px', fontFamily: 'inherit' }}
                            placeholder="Perfil del egresado..."
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Área de Especialización</label>
                        <input
                            type="text"
                            name="area_especializacion"
                            value={formData.area_especializacion}
                            onChange={handleChange}
                            style={inputStyle}
                            placeholder="Ej. Tecnologías de la Información"
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Habilidades Socioemocionales</label>
                        <textarea
                            name="habilidades_socioemocionales"
                            value={formData.habilidades_socioemocionales}
                            onChange={handleChange}
                            style={{ ...inputStyle, minHeight: '80px', fontFamily: 'inherit' }}
                            placeholder="Habilidades socioemocionales desarrolladas..."
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Oportunidades Profesionales</label>
                        <textarea
                            name="oportunidades_profesionales"
                            value={formData.oportunidades_profesionales}
                            onChange={handleChange}
                            style={{ ...inputStyle, minHeight: '80px', fontFamily: 'inherit' }}
                            placeholder="Campo laboral y oportunidades..."
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Plan de Estudios (PDF)</label>
                        {formData.existingPdfUrl && (
                            <div style={{ marginBottom: '10px' }}>
                                <a href={formData.existingPdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3498db', fontSize: '12px' }}>
                                    📄 Ver PDF actual
                                </a>
                                <p style={{ fontSize: '11px', margin: '2px 0 10px 0' }}>Subir otro para reemplazar</p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => handleFileChange(e, 'pdfFile')}
                            style={{ ...inputStyle, border: 'none' }}
                        />
                        <p style={{ fontSize: '12px', color: '#999', margin: '5px 0 0 0' }}>Formato: PDF</p>
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Página Inicial del PDF (opcional)</label>
                        <input
                            type="number"
                            name="pdf_start_page"
                            min="1"
                            value={formData.pdf_start_page}
                            onChange={handleChange}
                            style={{ ...inputStyle, maxWidth: '150px' }}
                            placeholder="1"
                        />
                        <p style={{ fontSize: '12px', color: '#999', margin: '5px 0 0 0' }}>Especifica qué página se mostrará primero en la vista pública (ej: 2, 8, 12)</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ ...buttonStyle, backgroundColor: '#eceff1', color: '#546e7a' }}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            style={{ ...buttonStyle, backgroundColor: '#28a745', color: 'white' }}
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : (careerToEdit ? 'Actualizar Carrera' : 'Crear Carrera')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCareerModal;
