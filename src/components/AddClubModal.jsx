import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AddClubModal = ({ isOpen, onClose, onClubAdded, clubToEdit = null }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        categoria: 'Deportivo',
        descripcion: '',
        beneficios: '',
        tipoVisual: 'emoji', // 'emoji' or 'foto'
        icono: '⚽',
        color: '#4a90e2',
        foto: null,
        link: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Effect to populate form when editing
    useEffect(() => {
        if (clubToEdit) {
            setFormData({
                nombre: clubToEdit.nombre || '',
                categoria: clubToEdit.categoria || 'Deportivo',
                descripcion: clubToEdit.descripcion || '',
                beneficios: clubToEdit.beneficios || '',
                tipoVisual: clubToEdit.foto_url ? 'foto' : 'emoji',
                icono: clubToEdit.icono || '⚽',
                color: clubToEdit.color || '#4a90e2',
                foto: null, // New file upload is handled separately
                link: clubToEdit.link || '',
                existingFotoUrl: clubToEdit.foto_url // Keep track of existing URL
            });
        } else {
            // Reset defaults for new club
            setFormData({
                nombre: '',
                categoria: 'Deportivo',
                descripcion: '',
                beneficios: '',
                tipoVisual: 'emoji',
                icono: '⚽',
                color: '#4a90e2',
                foto: null,
                link: ''
            });
        }
    }, [clubToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, foto: e.target.files[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let foto_url = formData.existingFotoUrl;

            // 1. Upload Photo if selected (replaces existing if any)
            if (formData.tipoVisual === 'foto' && formData.foto) {
                const fileExt = formData.foto.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('clubs_media')
                    .upload(filePath, formData.foto);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from('clubs_media')
                    .getPublicUrl(filePath);

                foto_url = publicUrlData.publicUrl;
            } else if (formData.tipoVisual === 'emoji') {
                foto_url = null; // Clear photo if switching to emoji
            }

            // Prepare payload
            const payload = {
                nombre: formData.nombre,
                categoria: formData.categoria,
                descripcion: formData.descripcion,
                beneficios: formData.beneficios,
                foto_url: foto_url,
                icono: formData.tipoVisual === 'emoji' ? formData.icono : null,
                color: formData.tipoVisual === 'emoji' ? formData.color : null,
                link: formData.link || null
            };

            let query;
            if (clubToEdit) {
                // UPDATE existing club
                query = supabase
                    .from('clubs')
                    .update(payload)
                    .eq('id', clubToEdit.id);
            } else {
                // INSERT new club
                query = supabase
                    .from('clubs')
                    .insert([payload]);
            }

            const { error: dbError } = await query;
            if (dbError) throw dbError;

            onClubAdded();
            onClose();

        } catch (err) {
            console.error('Error saving club:', err);
            setError(err.message || 'Error al guardar el club');
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
        maxWidth: '500px',
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

    const colorPresets = [
        '#4a90e2', // Blue
        '#e74c3c', // Red
        '#2ecc71', // Green
        '#f1c40f', // Yellow
        '#9b59b6', // Purple
        '#e67e22', // Orange
        '#1abc9c', // Teal
        '#34495e', // Dark Blue
    ];

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, color: '#2c3e50' }}>{clubToEdit ? 'Editar Club' : 'Agregar Nuevo Club'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999' }}>×</button>
                </div>

                {error && <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Nombre del Club</label>
                        <input
                            required
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            style={inputStyle}
                            placeholder="Ej. Fútbol Varonil"
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Categoría</label>
                        <select
                            name="categoria"
                            value={formData.categoria}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            <option value="Deportivo">Deportivo</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Academico">Académico</option>
                        </select>
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Descripción</label>
                        <textarea
                            required
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            style={{ ...inputStyle, minHeight: '80px', fontFamily: 'inherit' }}
                            placeholder="Breve descripción de las actividades..."
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Beneficios (separados por •)</label>
                        <input
                            type="text"
                            name="beneficios"
                            value={formData.beneficios}
                            onChange={handleChange}
                            style={inputStyle}
                            placeholder="Ej. Salud • Disciplina • Diversión"
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Link de Redirección (Opcional)</label>
                        <input
                            type="url"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            style={inputStyle}
                            placeholder="https://pagina-externa.com"
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Apariencia</label>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, tipoVisual: 'emoji' }))}
                                style={{
                                    ...buttonStyle,
                                    backgroundColor: formData.tipoVisual === 'emoji' ? '#3498db' : '#f0f2f5',
                                    color: formData.tipoVisual === 'emoji' ? 'white' : '#7f8c8d',
                                    marginTop: 0,
                                    flex: 1
                                }}
                            >
                                Emoji + Color
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, tipoVisual: 'foto' }))}
                                style={{
                                    ...buttonStyle,
                                    backgroundColor: formData.tipoVisual === 'foto' ? '#3498db' : '#f0f2f5',
                                    color: formData.tipoVisual === 'foto' ? 'white' : '#7f8c8d',
                                    marginTop: 0,
                                    flex: 1
                                }}
                            >
                                Foto Personalizada
                            </button>
                        </div>

                        {formData.tipoVisual === 'emoji' ? (
                            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ ...labelStyle, fontSize: '13px' }}>Emoji:</label>
                                    <input
                                        type="text"
                                        name="icono"
                                        value={formData.icono}
                                        onChange={handleChange}
                                        style={{ ...inputStyle, fontSize: '24px', textAlign: 'center', width: '60px' }}
                                        placeholder="🏆"
                                    />
                                </div>
                                <div>
                                    <label style={{ ...labelStyle, fontSize: '13px' }}>Color de Fondo:</label>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                        {colorPresets.map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, color }))}
                                                style={{
                                                    width: '30px',
                                                    height: '30px',
                                                    borderRadius: '50%',
                                                    backgroundColor: color,
                                                    border: formData.color === color ? '2px solid #333' : '2px solid transparent',
                                                    cursor: 'pointer',
                                                    padding: 0
                                                }}
                                            />
                                        ))}
                                        <input
                                            type="color"
                                            name="color"
                                            value={formData.color}
                                            onChange={handleChange}
                                            style={{ width: '32px', height: '32px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
                                        />
                                    </div>
                                </div>
                                {/* Preview */}
                                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                    <label style={{ ...labelStyle, fontSize: '12px', marginBottom: '5px' }}>Vista Previa:</label>
                                    <div style={{
                                        width: '100%',
                                        height: '80px',
                                        backgroundColor: formData.color,
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '32px',
                                        color: 'white',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                    }}>
                                        {formData.icono}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px', border: '2px dashed #ddd', borderRadius: '8px' }}>
                                {formData.existingFotoUrl && (
                                    <div style={{ marginBottom: '10px' }}>
                                        <img src={formData.existingFotoUrl} alt="Preview" style={{ height: '60px', borderRadius: '5px' }} />
                                        <p style={{ fontSize: '11px', margin: '2px 0 10px 0' }}>Imagen actual (subir otra para cambiar)</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ ...inputStyle, border: 'none' }}
                                />
                                <p style={{ fontSize: '12px', color: '#999', margin: '5px 0 0 0' }}>Formatos: JPG, PNG, WEBP</p>
                            </div>
                        )}
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
                            {loading ? 'Guardando...' : (clubToEdit ? 'Actualizar Club' : 'Crear Club')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClubModal;
