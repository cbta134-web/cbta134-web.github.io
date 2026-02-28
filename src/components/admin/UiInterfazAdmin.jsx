import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

// ─────────────────────────────────────────────────────────────────────────────
// DATOS INICIALES (fallback si la BD está vacía)
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_CARDS = [
    { image_url: '/images/valores.png', title: 'Acerca de CBTa 134', description: 'Conoce nuestra historia, misión, visión y valores que nos definen como institución.', path: 'acerca', button_text: 'Ver más', is_locked: true, is_visible: true, order_index: 1 },
    { image_url: '/images/programacion.jpg', title: 'Carreras Técnicas', description: 'Descubre nuestras especialidades técnicas y elige tu futuro profesional.', path: 'carreras', button_text: 'Ver carreras', is_locked: true, is_visible: true, order_index: 2 },
    { image_url: '/images/galeria.png', title: 'Galería', description: 'Explora nuestra colección de fotos y eventos destacados.', path: 'galeria', button_text: 'Ver galería', is_locked: false, is_visible: true, order_index: 3 },
    { image_url: '/images/proceso de admincion.jpg', title: 'Proceso de Admisión', description: 'Información sobre requisitos y pasos para formar parte de nuestra institución.', path: 'admission', button_text: 'Saber más', is_locked: false, is_visible: true, order_index: 4 },
    { image_url: '/images/campus.png', title: 'Clubs Estudiantiles', description: 'Únete a nuestros clubs deportivos, culturales y académicos.', path: 'clubs', button_text: 'Ver clubs', is_locked: false, is_visible: true, order_index: 5 },
    { image_url: '/images/ofimatica.jpg', title: 'Contacto', description: 'Información de contacto y ubicación de nuestra institución.', path: 'contacto', button_text: 'Contactarnos', is_locked: false, is_visible: true, order_index: 6 },
    { image_url: '/images/baetam.jpg', title: 'BAETAM', description: 'Bachillerato Autoplaneado - Educación flexible para adultos.', path: 'baetam', button_text: 'Conocer BAETAM', is_locked: false, is_visible: true, order_index: 7 },
    { image_url: '/images/maestros-hero.png', title: 'Maestros', description: 'Recursos y enlaces útiles para el personal docente.', path: 'maestros', button_text: 'Portal Maestros', is_locked: false, is_visible: true, order_index: 8 },
    { image_url: '/images/alumnos-hero.png', title: 'Alumnos', description: 'Portal de alumnos para acceso a calificaciones y servicios.', path: 'alumnos', button_text: 'Portal Alumnos', is_locked: false, is_visible: true, order_index: 9 },
    { image_url: '/images/proceso de admincion.jpg', title: 'Pre-Registro', description: 'Realiza tu pre-registro como aspirante de nuevo ingreso y obtén tu ficha.', path: 'preregistro', button_text: 'Pre-Registrarme', is_locked: false, is_visible: true, order_index: 10 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componente: Tarjeta editable inline
// ─────────────────────────────────────────────────────────────────────────────
function TarjetaEditable({ card, idx, total, darkMode, onSave, onToggleVisibility, onDelete, onMove, onDuplicate, onCreatePost }) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        title: card.title,
        description: card.description || '',
        path: card.path,
        button_text: card.button_text || 'Ver más',
        image_url: card.image_url,
        is_locked: card.is_locked,
        is_visible: card.is_visible !== false,
        external_url: card.external_url || '',
        post_id: card.post_id || ''
    });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const input = `px-3 py-2 rounded-xl border text-sm ${darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200'} w-full focus:ring-2 focus:ring-blue-500 outline-none transition`;

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `option-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('ui_media').upload(fileName, file, { upsert: true });

        if (uploadError) {
            alert('Error subiendo: ' + uploadError.message);
            setUploading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage.from('ui_media').getPublicUrl(fileName);

        // Actualizar el estado local
        const updatedForm = { ...form, image_url: publicUrl };
        setForm(updatedForm);

        // Guardar automáticamente en la base de datos para evitar confusiones
        await onSave(card.id, updatedForm);

        setUploading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        await onSave(card.id, form);
        setSaving(false);
        setEditing(false);
    };

    return (
        <div className={`rounded-2xl border overflow-hidden transition-all duration-200 ${card.is_visible === false ? 'opacity-60' : ''} ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            {/* Modo vista */}
            {!editing ? (
                <div className="flex gap-0">
                    {/* Imagen */}
                    <div className="relative w-28 md:w-36 flex-shrink-0">
                        <img
                            src={card.image_url}
                            alt={card.title}
                            className="w-full h-full object-cover"
                            style={{ minHeight: '90px' }}
                            onError={(e) => { e.target.src = 'https://placehold.co/200x120?text=Sin+imagen'; }}
                        />
                        {card.is_visible === false && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">OCULTA</span>
                            </div>
                        )}
                        {card.is_locked && (
                            <span className="absolute top-1 right-1 bg-orange-500 text-white text-xs rounded px-1 py-0.5">🔒</span>
                        )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 p-3 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <p className="font-bold text-sm truncate">{card.title}</p>
                                <p className={`text-xs mt-0.5 line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{card.description}</p>
                                <div className="flex flex-wrap gap-2 mt-1.5">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                        /{card.path}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                        Btn: "{card.button_text || 'Ver más'}"
                                    </span>
                                    {card.is_visible === false && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-semibold">Oculta</span>
                                    )}
                                </div>
                            </div>
                            {/* Acciones */}
                            <div className="flex flex-col gap-1 flex-shrink-0">
                                <div className="flex gap-1 mb-1">
                                    <button
                                        onClick={() => onMove(card, -1)}
                                        disabled={idx === 0}
                                        title="Mover arriba"
                                        className={`p-1.5 rounded-lg transition ${idx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                                        <span className="material-symbols-outlined text-sm">arrow_upward</span>
                                    </button>
                                    <button
                                        onClick={() => onMove(card, 1)}
                                        disabled={idx === total - 1}
                                        title="Mover abajo"
                                        className={`p-1.5 rounded-lg transition ${idx === total - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                                        <span className="material-symbols-outlined text-sm">arrow_downward</span>
                                    </button>
                                    <button
                                        onClick={() => onDuplicate(card)}
                                        title="Duplicar tarjeta"
                                        className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                                        <span className="material-symbols-outlined text-sm">content_copy</span>
                                    </button>
                                </div>
                                <button
                                    onClick={() => setEditing(true)}
                                    className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition whitespace-nowrap">
                                    ✏️ Editar
                                </button>
                                <button
                                    onClick={() => onToggleVisibility(card)}
                                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${card.is_visible === false
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}>
                                    {card.is_visible === false ? '👁️' : '🙈'}
                                </button>
                                {!card.is_locked && (
                                    <button
                                        onClick={() => onDelete(card)}
                                        className="text-xs px-3 py-1.5 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition">
                                        🗑️
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Modo edición */
                <div className={`p-4 space-y-3 ${darkMode ? 'bg-slate-800' : 'bg-blue-50/40'}`}>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-500">✏️ Editando: {card.title}</p>

                    {/* Preview de imagen */}
                    <div className="flex gap-3 items-start">
                        <div className="relative w-24 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 border-blue-300">
                            <img src={form.image_url} alt="preview" className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = 'https://placehold.co/200x120?text=Sin+imagen'; }} />
                            {uploading && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <span className="text-white text-xs">Subiendo...</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Reemplazar imagen</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading}
                                className={`${input} cursor-pointer text-xs`} />
                            <input type="text" placeholder="O pega URL de imagen" value={form.image_url}
                                onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                                className={`${input} text-xs`} />
                        </div>
                    </div>

                    {/* Campos de texto */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Título</label>
                            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={input} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Texto del botón</label>
                            <input type="text" placeholder="Ver más" value={form.button_text} onChange={e => setForm(f => ({ ...f, button_text: e.target.value }))} className={input} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Descripción</label>
                            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className={input} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Ruta interna (Path)</label>
                            <input type="text" placeholder="maestros" value={form.path} onChange={e => setForm(f => ({ ...f, path: e.target.value }))} className={input} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">URL Externa (Opcional)</label>
                            <input type="text" placeholder="https://..." value={form.external_url} onChange={e => setForm(f => ({ ...f, external_url: e.target.value }))} className={input} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">ID de Publicación (Post ID)</label>
                            <div className="flex gap-2">
                                <input type="number" placeholder="Ej: 42" value={form.post_id} onChange={e => setForm(f => ({ ...f, post_id: e.target.value }))} className={input} />
                                <button type="button" onClick={async () => {
                                    const id = await onCreatePost(form.title);
                                    if (id) setForm({ ...form, post_id: id });
                                }} className="px-3 py-2 bg-purple-100 text-purple-700 rounded-xl text-xs font-bold hover:bg-purple-200 transition whitespace-nowrap">
                                    + Crear Post
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 justify-end">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="checkbox" checked={form.is_visible} onChange={e => setForm(f => ({ ...f, is_visible: e.target.checked }))} className="w-4 h-4 rounded" />
                                <span>👁️ Visible en el inicio</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="checkbox" checked={form.is_locked} onChange={e => setForm(f => ({ ...f, is_locked: e.target.checked }))} className="w-4 h-4 rounded" />
                                <span>🔒 Proteger tarjeta</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                        <button onClick={handleSave} disabled={saving || uploading}
                            className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-sm disabled:opacity-60 transition">
                            {saving ? '💾 Guardando...' : '💾 Guardar cambios'}
                        </button>
                        <button onClick={() => { setEditing(false); setForm({ title: card.title, description: card.description || '', path: card.path, button_text: card.button_text || 'Ver más', image_url: card.image_url, is_locked: card.is_locked, is_visible: card.is_visible !== false }); }}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componente: Slide individual editable
// ─────────────────────────────────────────────────────────────────────────────
function SlideEditable({ slide, idx, darkMode, onUpdate, onDelete }) {
    const [replacingImage, setReplacingImage] = useState(false);
    const [editingDetails, setEditingDetails] = useState(false);
    const [newUrl, setNewUrl] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Estado para campos de texto
    const [form, setForm] = useState({
        title: slide.title || '',
        subtitle: slide.subtitle || '',
        button_text: slide.button_text || '',
        button_link: slide.button_link || '',
        overlay_opacity: slide.overlay_opacity || 0.4
    });

    const input = `p-2.5 rounded-xl border text-sm ${darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200'} w-full focus:ring-2 focus:ring-blue-500 outline-none transition`;

    const handleUploadAndReplace = async () => {
        if (!file) return;
        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `hero-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('ui_media').upload(fileName, file, { upsert: true });

        if (uploadError) {
            alert('Error subiendo: ' + uploadError.message);
            setUploading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage.from('ui_media').getPublicUrl(fileName);

        // Guardar automáticamente en la base de datos
        const { error: dbError } = await supabase
            .from('hero_slides')
            .update({ image_url: publicUrl })
            .eq('id', slide.id);

        if (dbError) {
            alert('Error al actualizar base de datos: ' + dbError.message);
        } else {
            await onUpdate();
            setReplacingImage(false);
            setFile(null);
        }
        setUploading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        const { error } = await supabase.from('hero_slides')
            .update({
                image_url: newUrl.trim() || slide.image_url,
                ...form
            })
            .eq('id', slide.id);

        if (error) alert('Error: ' + error.message);
        else {
            await onUpdate();
            setReplacingImage(false);
            setEditingDetails(false);
            setNewUrl('');
        }
        setSaving(false);
    };

    const handleDelete = async () => {
        if (slide.is_locked) { alert('Este slide está protegido. Desprotégelo primero.'); return; }
        if (!window.confirm(`¿Eliminar el slide #${idx + 1}?`)) return;
        const { error } = await supabase.from('hero_slides').delete().eq('id', slide.id);
        if (error) alert('Error: ' + error.message);
        else await onUpdate();
    };

    const handleToggleLock = async () => {
        const { error } = await supabase.from('hero_slides').update({ is_locked: !slide.is_locked }).eq('id', slide.id);
        if (error) alert('Error: ' + error.message);
        else await onUpdate();
    };

    return (
        <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            {/* Fila principal */}
            <div className="flex gap-0">
                {/* Imagen */}
                <div className="relative flex-shrink-0 w-40 md:w-52" style={{ minHeight: '110px' }}>
                    <img
                        src={slide.image_url}
                        alt={`Slide ${idx + 1}`}
                        className="w-full h-full object-cover"
                        style={{ minHeight: '110px' }}
                        onError={(e) => { e.target.src = 'https://placehold.co/300x110?text=Sin+imagen'; }}
                    />
                    <span className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold rounded-full px-2 py-0.5">
                        #{idx + 1}
                    </span>
                    {slide.is_locked && (
                        <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5">🔒</span>
                    )}
                </div>

                {/* Info + acciones */}
                <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                    <div>
                        <p className="font-bold text-sm truncate">{slide.title || `Slide #${idx + 1}`}</p>
                        <p className={`text-xs truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {slide.subtitle || slide.image_url}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <button
                            onClick={() => { setEditingDetails(e => !e); setReplacingImage(false); }}
                            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${editingDetails ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                            {editingDetails ? '✕ Cerrar' : '📝 Editar contenido'}
                        </button>
                        <button
                            onClick={() => { setReplacingImage(r => !r); setEditingDetails(false); setNewUrl(''); setFile(null); }}
                            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${replacingImage
                                ? (darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700')
                                : (darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}`}>
                            {replacingImage ? '✕ Cancelar' : '🖼️ Cambiar imagen'}
                        </button>
                        <button
                            onClick={handleToggleLock}
                            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${slide.is_locked
                                ? 'bg-orange-100 text-orange-700'
                                : (darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500')}`}>
                            {slide.is_locked ? '🔓' : '🔒'}
                        </button>
                        {!slide.is_locked && (
                            <button
                                onClick={handleDelete}
                                className="text-xs px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
                                🗑️
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Panel de edición de detalles */}
            {editingDetails && (
                <div className={`border-t p-4 space-y-4 ${darkMode ? 'border-slate-700 bg-slate-800/30' : 'border-slate-100 bg-slate-50'}`}>
                    <p className="text-xs font-bold text-blue-600 uppercase">📝 Contenido del Slide</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Título principal</label>
                            <input type="text" placeholder="Ej: ¡Bienvenidos al CBTa!"
                                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={input} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Subtítulo / Descripción</label>
                            <textarea placeholder="Breve mensaje sobre la imagen..." rows={1}
                                value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} className={input} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Texto del botón (Opcional)</label>
                            <input type="text" placeholder="Ej: Ver noticias"
                                value={form.button_text} onChange={e => setForm({ ...form, button_text: e.target.value })} className={input} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Enlace del botón</label>
                            <input type="text" placeholder="Ej: /noticias o https://..."
                                value={form.button_link} onChange={e => setForm({ ...form, button_link: e.target.value })} className={input} />
                        </div>
                        <div className="md:col-span-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Opacidad de fondo (legibilidad)</label>
                                <span className="text-xs font-bold text-blue-600">{(form.overlay_opacity * 100).toFixed(0)}%</span>
                            </div>
                            <input type="range" min="0" max="1" step="0.1"
                                value={form.overlay_opacity} onChange={e => setForm({ ...form, overlay_opacity: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                        </div>
                    </div>
                    <button onClick={handleSave} disabled={saving}
                        className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition shadow-lg shadow-blue-700/20">
                        {saving ? '⏳ Guardando...' : '💾 Guardar Contenido'}
                    </button>
                </div>
            )}

            {/* Panel de reemplazo (expandible) */}
            {replacingImage && (
                <div className={`border-t p-4 space-y-3 ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-blue-50/40'}`}>
                    <p className="text-xs font-bold text-blue-500 uppercase">🔄 Reemplazar imagen del slide #{idx + 1}</p>

                    {/* Preview nueva */}
                    {newUrl && (
                        <div className="flex gap-3 items-center">
                            <div className="w-24 h-14 rounded-xl overflow-hidden border-2 border-blue-400 flex-shrink-0">
                                <img src={newUrl} alt="nueva" className="w-full h-full object-cover"
                                    onError={e => e.target.src = 'https://placehold.co/200?text=Error'} />
                            </div>
                            <p className="text-xs text-green-600 font-semibold">✅ Nueva imagen lista para guardar</p>
                        </div>
                    )}

                    {/* Subir archivo */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Subir archivo</label>
                            <input type="file" accept="image/*"
                                onChange={e => setFile(e.target.files?.[0] || null)}
                                className={`${input} cursor-pointer`} />
                        </div>
                        <button
                            type="button"
                            onClick={handleUploadAndReplace}
                            disabled={uploading || !file}
                            className="py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition">
                            {uploading ? '⏳ Subiendo...' : '⬆️ Subir'}
                        </button>
                    </div>

                    {/* O pegar URL */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">O pegar URL directamente</label>
                        <input type="text" placeholder="https://ejemplo.com/imagen.jpg"
                            value={newUrl}
                            onChange={e => setNewUrl(e.target.value)}
                            className={input} />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving || !newUrl}
                        className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-sm disabled:opacity-60 transition">
                        {saving ? '💾 Guardando...' : '💾 Guardar nueva imagen'}
                    </button>
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componente: Sección Carrusel Hero (autónoma, fetch propio)
// ─────────────────────────────────────────────────────────────────────────────
function CarruselSection({ darkMode }) {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addSlideForm, setAddSlideForm] = useState({
        image_url: '',
        title: '',
        subtitle: '',
        button_text: '',
        button_link: '',
        is_locked: false
    });
    const [addFile, setAddFile] = useState(null);
    const [uploadingAdd, setUploadingAdd] = useState(false);
    const [savingAdd, setSavingAdd] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    const card = `rounded-[2rem] p-6 md:p-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`;
    const input = `p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200'} w-full focus:ring-2 focus:ring-blue-500 outline-none transition`;

    const fetchSlides = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('hero_slides')
            .select('*')
            .order('order_index', { ascending: true });
        if (!error && data) setSlides(data);
        setLoading(false);
    };

    useEffect(() => { fetchSlides(); }, []);

    const handleUploadForAdd = async () => {
        if (!addFile) return;
        setUploadingAdd(true);
        const fileExt = addFile.name.split('.').pop();
        const fileName = `hero-${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage.from('ui_media').upload(fileName, addFile, { upsert: true });
        if (error) { alert('Error subiendo: ' + error.message); setUploadingAdd(false); return; }
        const { data: { publicUrl } } = supabase.storage.from('ui_media').getPublicUrl(fileName);
        setAddSlideForm(f => ({ ...f, image_url: publicUrl })); // Correctly update addSlideForm
        setAddFile(null);
        setUploadingAdd(false);
    };

    const handleAddSlide = async (e) => {
        e.preventDefault();
        if (!addSlideForm.image_url.trim()) { alert('Ingresa o sube una imagen primero.'); return; }
        setSavingAdd(true);
        const { error } = await supabase.from('hero_slides').insert([{
            ...addSlideForm,
            order_index: slides.length,
        }]);
        if (error) alert('Error: ' + error.message);
        else {
            setAddSlideForm({ image_url: '', title: '', subtitle: '', button_text: '', button_link: '', is_locked: false });
            setAddFile(null);
            setShowAddForm(false);
            await fetchSlides();
        }
        setSavingAdd(false);
    };

    return (
        <section className={card}>
            <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-600">slideshow</span>
                Carrusel Hero
                {slides.length > 0 && (
                    <span className="ml-1 text-sm font-normal bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        {slides.length} imagen{slides.length !== 1 ? 'es' : ''}
                    </span>
                )}
            </h3>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <p className="text-sm text-slate-400">
                    Controla la portada del sitio. Puedes añadir títulos y botones sobre las imágenes para destacar contenido importante.
                </p>
                <button onClick={() => setShowAddForm(!showAddForm)}
                    className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl text-sm hover:bg-purple-700 transition flex-shrink-0">
                    {showAddForm ? '✕ Cancelar' : '+ Nuevo Slide'}
                </button>
            </div>

            {/* Lista de slides existentes */}
            {loading && (
                <div className="flex items-center gap-3 py-8 text-slate-400">
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                    Cargando imágenes del carrusel...
                </div>
            )}

            {!loading && slides.length === 0 && (
                <div className={`p-8 rounded-2xl text-center border-2 border-dashed mb-6 ${darkMode ? 'border-slate-700 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                    <span className="material-symbols-outlined text-5xl mb-2 block">slideshow</span>
                    <p className="font-semibold mb-1">Sin imágenes en el carrusel</p>
                    <p className="text-sm">Agrega la primera imagen usando el formulario de abajo.</p>
                </div>
            )}

            {!loading && slides.length > 0 && (
                <div className="space-y-3 mb-8">
                    {slides.map((slide, idx) => (
                        <SlideEditable
                            key={slide.id}
                            slide={slide}
                            idx={idx}
                            darkMode={darkMode}
                            onUpdate={fetchSlides}
                        />
                    ))}
                </div>
            )}

            {/* Agregar nueva imagen */}
            {showAddForm && (
                <div className={`rounded-2xl border-2 border-dashed p-6 space-y-4 mb-8 ${darkMode ? 'border-purple-600 bg-purple-900/10' : 'border-purple-200 bg-purple-50/40'}`}>
                    <p className="text-sm font-bold text-purple-600 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">add_photo_alternate</span>
                        Configurar nueva portada
                    </p>

                    <form onSubmit={handleAddSlide} className="space-y-4">
                        {/* Preview y Subida */}
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                            <div className="w-full md:w-48 h-28 bg-slate-200 rounded-xl overflow-hidden border-2 border-slate-300 flex-shrink-0">
                                {addSlideForm.image_url ? (
                                    <img src={addSlideForm.image_url} alt="preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs text-center p-2">
                                        Subir imagen<br />para vista previa
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-3 w-full">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Subir archivo</label>
                                    <div className="flex gap-2">
                                        <input type="file" accept="image/*" onChange={e => setAddFile(e.target.files?.[0] || null)} className={`${input} cursor-pointer`} />
                                        <button type="button" onClick={handleUploadForAdd} disabled={uploadingAdd || !addFile}
                                            className="px-4 py-2 bg-green-600 text-white font-bold rounded-xl disabled:opacity-50 text-xs">
                                            {uploadingAdd ? '⏳' : 'Subir'}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">O URL directa</label>
                                    <input type="text" placeholder="/images/..." value={addSlideForm.image_url}
                                        onChange={e => setAddSlideForm({ ...addSlideForm, image_url: e.target.value })} className={input} />
                                </div>
                            </div>
                        </div>

                        {/* Detalles del texto */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-purple-100 dark:border-purple-900/30">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Título principal (Opcional)</label>
                                <input type="text" placeholder="Ej: Inscripciones Abiertas"
                                    value={addSlideForm.title} onChange={e => setAddSlideForm({ ...addSlideForm, title: e.target.value })} className={input} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Subtítulo / Bajada</label>
                                <input type="text" placeholder="Ej: Ven y forma parte de nuestra comunidad"
                                    value={addSlideForm.subtitle} onChange={e => setAddSlideForm({ ...addSlideForm, subtitle: e.target.value })} className={input} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Texto del botón</label>
                                <input type="text" placeholder="Ej: Ver requisitos"
                                    value={addSlideForm.button_text} onChange={e => setAddSlideForm({ ...addSlideForm, button_text: e.target.value })} className={input} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Enlace del botón</label>
                                <input type="text" placeholder="Ej: /admission"
                                    value={addSlideForm.button_link} onChange={e => setAddSlideForm({ ...addSlideForm, button_link: e.target.value })} className={input} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="checkbox" checked={addSlideForm.is_locked} onChange={e => setAddSlideForm({ ...addSlideForm, is_locked: e.target.checked })} className="w-4 h-4 rounded" />
                                <span>🔒 Proteger contra eliminación</span>
                            </label>
                            <button type="submit" disabled={savingAdd || !addSlideForm.image_url}
                                className="px-8 py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl transition disabled:opacity-60 shadow-lg shadow-purple-700/20">
                                {savingAdd ? '💾 Creando...' : '💾 Crear Portada'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componente: Header
// ─────────────────────────────────────────────────────────────────────────────
function HeaderSection({ darkMode, uiHeaderForm, setUiHeaderForm, handleSaveUiHeader, uiHeaderLinks, uiHeaderLinkForm, setUiHeaderLinkForm, editingHeaderLink, setEditingHeaderLink, handleSaveHeaderLink, handleDeleteHeaderLink }) {
    const card = `rounded-[2rem] p-6 md:p-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`;
    const input = `p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200'} w-full focus:ring-2 focus:ring-blue-500 outline-none transition`;

    return (
        <section className={card}>
            <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">web_asset</span>
                Header del Sitio
            </h3>
            <p className="text-sm text-slate-400 mb-6">Edita el logo y título que aparecen en la barra superior.</p>

            <form onSubmit={handleSaveUiHeader} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">URL del Logo</label>
                        <input type="text" placeholder="/images/logo.png" value={uiHeaderForm.logo_url}
                            onChange={(e) => setUiHeaderForm({ ...uiHeaderForm, logo_url: e.target.value })} className={input} />
                        {uiHeaderForm.logo_url && (
                            <img src={uiHeaderForm.logo_url} alt="Logo" className="mt-2 h-10 object-contain rounded border"
                                onError={(e) => e.target.style.display = 'none'} />
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Título del Sitio</label>
                        <input type="text" placeholder="CBTa 134" value={uiHeaderForm.title_text}
                            onChange={(e) => setUiHeaderForm({ ...uiHeaderForm, title_text: e.target.value })} className={input} />
                    </div>
                </div>
                <button type="submit" className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition">
                    💾 Guardar Header
                </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                <h4 className="font-bold mb-3">Links de navegación</h4>
                <form onSubmit={handleSaveHeaderLink} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <input type="text" placeholder="Label (ej: Noticias)" value={uiHeaderLinkForm.label}
                        onChange={(e) => setUiHeaderLinkForm({ ...uiHeaderLinkForm, label: e.target.value })} className={input} />
                    <input type="text" placeholder="Path (ej: noticias)" value={uiHeaderLinkForm.path}
                        onChange={(e) => setUiHeaderLinkForm({ ...uiHeaderLinkForm, path: e.target.value })} className={input} />
                    <input type="text" placeholder="Href (ej: /noticias)" value={uiHeaderLinkForm.href}
                        onChange={(e) => setUiHeaderLinkForm({ ...uiHeaderLinkForm, href: e.target.value })} className={input} />
                    <div className="md:col-span-3 flex gap-2">
                        <button type="submit" className="px-5 py-2.5 bg-blue-700 text-white font-semibold rounded-xl text-sm hover:bg-blue-800 transition">
                            {editingHeaderLink ? '✏️ Actualizar' : '+ Agregar Link'}
                        </button>
                        {editingHeaderLink && (
                            <button type="button" onClick={() => { setEditingHeaderLink(null); setUiHeaderLinkForm({ label: '', href: '', path: '' }); }}
                                className={`px-4 py-2.5 rounded-xl text-sm ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
                <div className="space-y-2">
                    {uiHeaderLinks.map((item) => (
                        <div key={item.id} className={`p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                            <div>
                                <span className="font-semibold text-sm">{item.label}</span>
                                <span className="text-xs text-slate-400 ml-2">→ /{item.path}</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setEditingHeaderLink(item); setUiHeaderLinkForm({ label: item.label, path: item.path, href: item.href || '' }); }}
                                    className="text-xs px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-semibold">Editar</button>
                                <button onClick={() => handleDeleteHeaderLink(item.id)}
                                    className="text-xs px-3 py-1.5 bg-red-100 text-red-600 rounded-lg font-semibold">Eliminar</button>
                            </div>
                        </div>
                    ))}
                    {uiHeaderLinks.length === 0 && <p className="text-sm text-slate-400 italic">Sin links configurados.</p>}
                </div>
            </div>
        </section>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componente: Footer
// ─────────────────────────────────────────────────────────────────────────────
function FooterSection({ darkMode, uiFooterForm, setUiFooterForm, handleSaveUiFooter, uiFooterLinks, uiFooterLinkForm, setUiFooterLinkForm, editingFooterLink, setEditingFooterLink, handleSaveFooterLink, handleDeleteFooterLink }) {
    const card = `rounded-[2rem] p-6 md:p-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`;
    const input = `p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200'} w-full focus:ring-2 focus:ring-blue-500 outline-none transition`;

    return (
        <section className={card}>
            <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-600">bottom_navigation</span>
                Footer del Sitio
            </h3>
            <p className="text-sm text-slate-400 mb-6">Edita los textos del pie de página.</p>

            <form onSubmit={handleSaveUiFooter} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { key: 'school_name', label: 'Nombre del plantel', placeholder: 'CBTa 134' },
                    { key: 'location_text', label: 'Ubicación', placeholder: 'Tetela del Volcán, Morelos' },
                    { key: 'tagline_text', label: 'Tagline / lema', placeholder: 'Educación que transforma' },
                    { key: 'copyright_text', label: 'Copyright', placeholder: '© 2025 CBTa 134' },
                    { key: 'rights_text', label: 'Derechos reservados', placeholder: 'Todos los derechos reservados' },
                ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">{label}</label>
                        <input type="text" placeholder={placeholder} value={uiFooterForm[key] || ''}
                            onChange={(e) => setUiFooterForm({ ...uiFooterForm, [key]: e.target.value })} className={input} />
                    </div>
                ))}
                {[{ key: 'legal_text_1', label: 'Texto legal 1' }, { key: 'legal_text_2', label: 'Texto legal 2' }, { key: 'legal_text_3', label: 'Texto legal 3' }].map(({ key, label }) => (
                    <div key={key} className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">{label}</label>
                        <textarea rows={2} value={uiFooterForm[key] || ''} onChange={(e) => setUiFooterForm({ ...uiFooterForm, [key]: e.target.value })} className={input} />
                    </div>
                ))}
                <div className="md:col-span-2">
                    <button type="submit" className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition">
                        💾 Guardar Footer
                    </button>
                </div>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                <h4 className="font-bold mb-3">Links del Footer</h4>
                <form onSubmit={handleSaveFooterLink} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {[{ key: 'label', placeholder: 'Label' }, { key: 'href', placeholder: 'URL' }, { key: 'icon_url', placeholder: 'Icon URL' }, { key: 'style_class', placeholder: 'Clase CSS' }].map(({ key, placeholder }) => (
                        <input key={key} type="text" placeholder={placeholder} value={uiFooterLinkForm[key] || ''}
                            onChange={(e) => setUiFooterLinkForm({ ...uiFooterLinkForm, [key]: e.target.value })} className={input} />
                    ))}
                    <div className="md:col-span-2 flex gap-2">
                        <button type="submit" className="px-5 py-2.5 bg-blue-700 text-white font-semibold rounded-xl text-sm">
                            {editingFooterLink ? '✏️ Actualizar' : '+ Agregar Link'}
                        </button>
                        {editingFooterLink && (
                            <button type="button" onClick={() => { setEditingFooterLink(null); setUiFooterLinkForm({ label: '', href: '', icon_url: '', style_class: '' }); }}
                                className={`px-4 py-2.5 rounded-xl text-sm ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
                <div className="space-y-2">
                    {uiFooterLinks.map((item) => (
                        <div key={item.id} className={`p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                            <div>
                                <span className="font-semibold text-sm">{item.label}</span>
                                <span className="text-xs text-slate-400 ml-2">{item.href}</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setEditingFooterLink(item); setUiFooterLinkForm({ label: item.label, href: item.href, icon_url: item.icon_url || '', style_class: item.style_class || '' }); }}
                                    className="text-xs px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-semibold">Editar</button>
                                <button onClick={() => handleDeleteFooterLink(item.id)}
                                    className="text-xs px-3 py-1.5 bg-red-100 text-red-600 rounded-lg font-semibold">Eliminar</button>
                            </div>
                        </div>
                    ))}
                    {uiFooterLinks.length === 0 && <p className="text-sm text-slate-400 italic">Sin links configurados.</p>}
                </div>
            </div>
        </section>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componente: Gestión BAETAM
// ─────────────────────────────────────────────────────────────────────────────
function BaetamSection({ darkMode }) {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [seeding, setSeeding] = useState(false);

    const dk = darkMode;
    const input = `p-3 rounded-xl border text-sm ${dk ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200'} w-full focus:ring-2 focus:ring-blue-500 outline-none transition`;
    const cardWrapper = `rounded-[2rem] p-6 md:p-8 border ${dk ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`;

    useEffect(() => {
        fetchBaetam();
    }, []);

    const fetchBaetam = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('baetam_config').select('*').order('created_at', { ascending: false }).limit(1);
            if (data && data.length > 0) setConfig(data[0]);
            else setConfig(null);
            if (error) console.error("Error fetching baetam:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSeedBaetamData = async () => {
        if (!window.confirm('¿Quieres cargar la información REAL de CBTA 134 Tlaxcala para BAETAM? Esto actualizará la configuración y las pestañas informativas.')) return;
        setSeeding(true);
        try {
            // 1. Configuración base
            const baetamData = {
                hero_image_url: 'https://images.unsplash.com/photo-1523050853063-bd80e29247c6?q=80&w=2070',
                title: 'BAETAM CBTA 134',
                subtitle: 'Bachillerato Autoplaneado de Educación Tecnológica Agropecuaria y del Mar - Plantel Tlaxcala',
                target_date: '2026-08-15T08:00:00',
                countdown_label: '⏰ Próximo ciclo de inscripciones:',
                countdown_date_text: '🗓️ Agosto 2026',
                inscriptions_title: 'Unidad de Educación Autoplaneada',
                inscriptions_period_title: '📝 Inscripciones Sabatinas',
                inscriptions_period_description: 'Proceso abierto para mayores de 18 años. Obtén tu certificado oficial de bachillerato estudiando solo los sábados.',
                requirements_title: 'Documentación para Ingreso',
                advantages_title: '¿Por qué elegir nuestra modalidad?',
                contact_title: 'Atención a Estudiantes',
                contact_description: 'Visítanos en nuestras oficinas para una atención personalizada.'
            };

            const { data: existing } = await supabase.from('baetam_config').select('id').limit(1);
            if (existing && existing.length > 0) {
                await supabase.from('baetam_config').update(baetamData).eq('id', existing[0].id);
            } else {
                await supabase.from('baetam_config').insert([baetamData]);
            }

            // 2. Info Cards (Limpia e inserta)
            await supabase.from('baetam_info_cards').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            await supabase.from('baetam_info_cards').insert([
                { title: 'Educación para Adultos', description: 'Programa bivalente diseñado para personas trabajadoras mayores de 18 años.', order_index: 1 },
                { title: 'Estudio Sabatino', description: 'Asistencia presencial únicamente los sábados en horario flexible de 8:00 AM a 3:00 PM.', order_index: 2 },
                { title: 'Título Técnico', description: 'Obtén certificado de bachillerato y título técnico profesional en Ofimática o Agropecuario.', order_index: 3 }
            ]);

            // 3. Requisitos
            await supabase.from('baetam_requirements').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            await supabase.from('baetam_requirements').insert([
                { icon: '📄', text: 'Acta de Nacimiento (Original y 3 copias)', order_index: 1 },
                { icon: '🎓', text: 'Certificado de Secundaria original', order_index: 2 },
                { icon: '🆔', text: 'CURP actualizado (Formato reciente)', order_index: 3 },
                { icon: '📸', text: '6 Fotografías tamaño infantil (B/N)', order_index: 4 },
                { icon: '🏠', text: 'Comprobante de domicilio vigente', order_index: 5 }
            ]);

            // 4. Ventajas
            await supabase.from('baetam_advantages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            await supabase.from('baetam_advantages').insert([
                { title: 'Sin límite de edad', description: 'Nunca es tarde para concluir tus metas académicas. Recibimos alumnos de todas las edades.', order_index: 1 },
                { title: 'Validez Nacional', description: 'Certificado oficial emitido por la SEP con validez para ingresar a cualquier universidad.', order_index: 2 },
                { title: 'Cédula Profesional', description: 'Tratamiento profesional para tu carrera técnica con registro ante la Dirección General de Profesiones.', order_index: 3 }
            ]);

            // 5. Contacto
            await supabase.from('baetam_contact_lines').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            await supabase.from('baetam_contact_lines').insert([
                { line_text: '📍 Ubicación: San Francisco Tetlanohcan, Tlaxcala.', order_index: 1 },
                { line_text: '📞 Teléfono Oficina: (246) 464 5678', order_index: 2 },
                { line_text: '📧 Correo: baetam.tlaxcala@cbta134.edu.mx', order_index: 3 }
            ]);

            alert('✅ Datos de Tlaxcala cargados con éxito.');
            await fetchBaetam();
        } catch (err) {
            alert('Error cargando datos: ' + err.message);
        } finally {
            setSeeding(false);
        }
    };

    const handleSave = async () => {
        if (!config) return;
        setSaving(true);
        const { error } = await supabase.from('baetam_config').update({
            hero_image_url: config.hero_image_url,
            title: config.title,
            subtitle: config.subtitle,
            target_date: config.target_date,
            countdown_date_text: config.countdown_date_text,
            inscriptions_title: config.inscriptions_title,
            updated_at: new Date().toISOString()
        }).eq('id', config.id);

        if (error) alert('Error al guardar: ' + error.message);
        else alert('✅ Configuración de BAETAM actualizada correctamente.');
        setSaving(false);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `baetam-hero-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('ui_media').upload(fileName, file, { upsert: true });

        if (uploadError) {
            alert('Error subiendo: ' + uploadError.message);
            setUploading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage.from('ui_media').getPublicUrl(fileName);
        setConfig({ ...config, hero_image_url: publicUrl });
        setUploading(false);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-slate-400">
            <span className="material-symbols-outlined animate-spin text-4xl mb-3">sync</span>
            <p className="font-bold">Cargando BAETAM...</p>
        </div>
    );

    if (!config) return (
        <div className="p-10 text-center text-red-500 font-bold border-2 border-dashed rounded-3xl">
            ❌ No se encontró la fila de configuración en baetam_config.
        </div>
    );

    return (
        <div className="space-y-6 animate-fadeIn">
            <section className={cardWrapper}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <span className="material-symbols-outlined text-3xl">school</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Imagen y Contenido de BAETAM</h3>
                            <p className="text-sm text-slate-400">Modifica la información visual que ven los aspirantes de educación autoplaneada.</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSeedBaetamData}
                            disabled={seeding}
                            className={`px-4 py-3 rounded-xl text-sm font-bold transition flex items-center gap-2 ${dk ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                        >
                            <span className="material-symbols-outlined text-base">database</span>
                            {seeding ? 'Cargando...' : 'Cargar Datos Tlaxcala'}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 dark:shadow-none transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined">{saving ? 'sync' : 'save'}</span>
                            {saving ? 'Guardando...' : 'Publicar cambios'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Imagen de Cabecera (Hero)</label>
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold uppercase">Dynamic</span>
                        </div>

                        {/* Zona de carga visual mejorada */}
                        <div className={`relative group rounded-3xl overflow-hidden shadow-2xl border-4 ${dk ? 'border-slate-700' : 'border-white'} aspect-[16/8] bg-slate-100`}>
                            <img src={config.hero_image_url} alt="BAETAM Hero" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                            {/* Overlay de Carga siempre visible pero discreto o potente al hover */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                <label className="cursor-pointer bg-white text-purple-700 px-6 py-3 rounded-2xl text-sm font-black shadow-2xl hover:scale-105 active:scale-95 transition flex items-center gap-2">
                                    <span className="material-symbols-outlined">upload_file</span>
                                    {uploading ? 'SUBIENDO...' : 'SUBIR IMAGEN'}
                                    <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" disabled={uploading} />
                                </label>
                                <p className="text-white text-[10px] font-bold uppercase tracking-widest drop-shadow-md">JPG, PNG o WEBP</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="material-symbols-outlined text-blue-600">link</span>
                                <span className="text-xs font-bold text-blue-700 uppercase">Input manual o Archivo</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <div className="md:col-span-2">
                                    <input type="text" value={config.hero_image_url} onChange={e => setConfig({ ...config, hero_image_url: e.target.value })}
                                        className={`${input} !bg-white dark:!bg-slate-950`} placeholder="O pega una URL externa aquí..." />
                                </div>
                                <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 p-2 px-4 shadow-md">
                                    <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                                    {uploading ? 'Subiendo...' : 'Importar'}
                                    <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" disabled={uploading} />
                                </label>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-400 px-1 italic">Nota: Para mejores resultados, usa imágenes horizontales de alta resolución.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Título de Cabecera</label>
                                <input type="text" value={config.title} onChange={e => setConfig({ ...config, title: e.target.value })} className={input} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Subtítulo Descriptivo</label>
                                <textarea value={config.subtitle} onChange={e => setConfig({ ...config, subtitle: e.target.value })} className={input} rows={2} />
                            </div>
                        </div>

                        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 mt-2">
                            <h4 className="font-bold text-sm mb-4 flex items-center gap-2 text-orange-600">
                                <span className="material-symbols-outlined text-base">event</span>
                                Sección de Inscripciones
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Título de la sección</label>
                                    <input type="text" value={config.inscriptions_title} onChange={e => setConfig({ ...config, inscriptions_title: e.target.value })} className={input} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Fecha para Cuenta Regresiva</label>
                                    <input type="datetime-local" value={config.target_date?.split('.')[0]} onChange={e => setConfig({ ...config, target_date: e.target.value })} className={input} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Texto Informativo de Fecha</label>
                                    <input type="text" value={config.countdown_date_text} onChange={e => setConfig({ ...config, countdown_date_text: e.target.value })} className={input} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
const UiInterfazAdmin = ({
    darkMode,
    // Header
    uiHeaderForm, setUiHeaderForm, handleSaveUiHeader,
    uiHeaderLinks, uiHeaderLinkForm, setUiHeaderLinkForm,
    editingHeaderLink, setEditingHeaderLink, handleSaveHeaderLink, handleDeleteHeaderLink,
    // Footer
    uiFooterForm, setUiFooterForm, handleSaveUiFooter,
    uiFooterLinks, uiFooterLinkForm, setUiFooterLinkForm,
    editingFooterLink, setEditingFooterLink, handleSaveFooterLink, handleDeleteFooterLink,
}) => {
    const [activeTab, setActiveTab] = useState('tarjetas');
    const [cards, setCards] = useState([]);
    const [loadingCards, setLoadingCards] = useState(true);
    const [seedingCards, setSeedingCards] = useState(false);
    const [addingCard, setAddingCard] = useState(false);
    const [newCardForm, setNewCardForm] = useState({
        image_url: '',
        title: '',
        description: '',
        path: '',
        button_text: 'Ver más',
        is_locked: false,
        is_visible: true,
        external_url: '',
        post_id: ''
    });
    const [newCardFile, setNewCardFile] = useState(null);
    const [uploadingNewCard, setUploadingNewCard] = useState(false);
    const [savingNew, setSavingNew] = useState(false);

    // ── Cargar tarjetas desde la BD ──────────────────────────────────────────
    const fetchCards = async () => {
        setLoadingCards(true);
        const { data, error } = await supabase
            .from('home_options')
            .select('*')
            .order('order_index', { ascending: true });

        if (!error && data) setCards(data);
        setLoadingCards(false);
    };

    useEffect(() => { fetchCards(); }, []);

    // ── Sembrar tarjetas iniciales en la BD ──────────────────────────────────
    const handleSeedCards = async () => {
        if (!window.confirm('¿Cargar las tarjetas por defecto a la base de datos? Esto solo agregará si no existen.')) return;
        setSeedingCards(true);
        try {
            // Insertar todas las tarjetas iniciales
            const { error } = await supabase.from('home_options').insert(DEFAULT_CARDS);
            if (error) {
                // Si hay error de duplicados, intentar uno por uno
                for (const card of DEFAULT_CARDS) {
                    await supabase.from('home_options').upsert(card, { onConflict: 'path' });
                }
            }
            await fetchCards();
        } catch (err) {
            alert('Error al sembrar: ' + err.message);
        } finally {
            setSeedingCards(false);
        }
    };

    // ── Guardar cambios en una tarjeta ────────────────────────────────────────
    const handleSaveCard = async (id, form) => {
        const { error } = await supabase
            .from('home_options')
            .update({
                title: form.title,
                description: form.description,
                path: form.path,
                button_text: form.button_text || 'Ver más',
                image_url: form.image_url,
                is_locked: form.is_locked,
                is_visible: form.is_visible !== false,
                external_url: form.external_url || null,
                post_id: form.post_id || null,
            })
            .eq('id', id);
        if (error) { alert('Error al guardar: ' + error.message); return; }
        await fetchCards();
    };

    // ── Alternar visibilidad ────────────────────────────────────────────────
    const handleToggleVisibility = async (card) => {
        const newV = card.is_visible === false ? true : false;
        const { error } = await supabase.from('home_options').update({ is_visible: newV }).eq('id', card.id);
        if (error) alert('Error: ' + error.message);
        else await fetchCards();
    };

    // ── Eliminar tarjeta ────────────────────────────────────────────────────
    const handleDeleteCard = async (card) => {
        if (card.is_locked) { alert('Esta tarjeta está protegida. Desprotégela antes de eliminar.'); return; }
        if (!window.confirm(`¿Eliminar la tarjeta "${card.title}"?`)) return;
        const { error } = await supabase.from('home_options').delete().eq('id', card.id);
        if (error) alert('Error: ' + error.message);
        else await fetchCards();
    };

    // ── Reordenar tarjetas ──────────────────────────────────────────────────
    const handleMoveCard = async (card, direction) => {
        const currentIndex = cards.findIndex(c => c.id === card.id);
        const newIndex = currentIndex + direction;
        if (newIndex < 0 || newIndex >= cards.length) return;

        const otherCard = cards[newIndex];

        // Swap order_index
        const { error: err1 } = await supabase.from('home_options').update({ order_index: otherCard.order_index }).eq('id', card.id);
        const { error: err2 } = await supabase.from('home_options').update({ order_index: card.order_index }).eq('id', otherCard.id);

        if (err1 || err2) alert('Error al reordenar');
        else await fetchCards();
    };

    // ── Vincular Nuevo Aviso desde Tarjeta ──────────────────────────────────
    const handleCreatePostForCard = async (cardTitle) => {
        const confirm = window.confirm(`¿Quieres crear un nuevo Aviso Global con el título "${cardTitle}" y vincularlo?`);
        if (!confirm) return null;

        const { data, error } = await supabase.from('publicaciones_globales').insert([{
            titulo: cardTitle,
            subtitulo: 'Nueva publicación desde tarjeta',
            contenido: 'Escribe aquí el contenido detallado...',
            tipo: 'general',
            fecha: new Date().toISOString().split('T')[0],
            is_visible: true
        }]).select();

        if (error) { alert('Error: ' + error.message); return null; }
        return data[0].id;
    };

    // ── Duplicar tarjeta ──────────────────────────────────────────────────
    const handleDuplicateCard = async (card) => {
        const { id, created_at, ...otherProps } = card;
        const maxOrder = Math.max(...cards.map(c => c.order_index), 0);

        const { error } = await supabase.from('home_options').insert([{
            ...otherProps,
            title: `${card.title} (Copia)`,
            is_locked: false,
            order_index: maxOrder + 1
        }]);

        if (error) alert('Error al duplicar: ' + error.message);
        else await fetchCards();
    };

    // ── Subir imagen para nueva tarjeta ─────────────────────────────────────
    const handleUploadNewCard = async () => {
        if (!newCardFile) return;
        setUploadingNewCard(true);
        const fileExt = newCardFile.name.split('.').pop();
        const fileName = `option-${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage.from('ui_media').upload(fileName, newCardFile, { upsert: true });
        if (error) { alert('Error: ' + error.message); setUploadingNewCard(false); return; }
        const { data: { publicUrl } } = supabase.storage.from('ui_media').getPublicUrl(fileName);
        setNewCardForm(f => ({ ...f, image_url: publicUrl }));
        setNewCardFile(null);
        setUploadingNewCard(false);
    };

    // ── Agregar nueva tarjeta ────────────────────────────────────────────────
    const handleAddNewCard = async (e) => {
        e.preventDefault();
        if (!newCardForm.title || !newCardForm.path || !newCardForm.image_url) {
            alert('Completa al menos título, path e imagen.');
            return;
        }
        setSavingNew(true);
        const maxOrder = Math.max(...cards.map(c => c.order_index), 0);
        const { error } = await supabase.from('home_options').insert([{
            ...newCardForm,
            button_text: newCardForm.button_text || 'Ver más',
            is_visible: newCardForm.is_visible !== false,
            order_index: maxOrder + 1,
        }]);
        if (error) alert('Error: ' + error.message);
        else {
            setNewCardForm({ image_url: '', title: '', description: '', path: '', button_text: 'Ver más', is_locked: false, is_visible: true });
            setAddingCard(false);
            await fetchCards();
        }
        setSavingNew(false);
    };

    const dk = darkMode;
    const input = `p-3 rounded-xl border text-sm ${dk ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200'} w-full focus:ring-2 focus:ring-blue-500 outline-none transition`;
    const cardWrapper = `rounded-[2rem] p-6 md:p-8 border ${dk ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-slate-200/50 shadow-xl'}`;

    const tabs = [
        { id: 'tarjetas', label: 'Tarjetas Inicio', icon: 'grid_view' },
        { id: 'carrusel', label: 'Carrusel', icon: 'slideshow' },
        { id: 'baetam', label: 'BAETAM', icon: 'school' },
        { id: 'header', label: 'Header', icon: 'web_asset' },
        { id: 'footer', label: 'Footer', icon: 'bottom_navigation' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Tab bar */}
            <div className={`flex gap-2 flex-wrap p-2 rounded-2xl ${dk ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id
                            ? 'bg-blue-700 text-white shadow-md'
                            : dk ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                        <span className="material-symbols-outlined text-base">{tab.icon}</span>
                        {tab.label}
                        {tab.id === 'tarjetas' && cards.length > 0 && (
                            <span className={`text-xs rounded-full px-1.5 py-0.5 ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'}`}>{cards.length}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* ═══ TAB: Tarjetas de Inicio ═══════════════════════════════════════════ */}
            {activeTab === 'tarjetas' && (
                <section className={cardWrapper}>
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-600">grid_view</span>
                                Tarjetas de Inicio
                            </h3>
                            <p className="text-sm text-slate-400 mt-1">Edita las tarjetas que aparecen en la página principal. Haz clic en "Editar" en cualquier tarjeta para modificarla.</p>
                        </div>
                        <button onClick={() => setAddingCard(a => !a)}
                            className="px-4 py-2 bg-blue-700 text-white font-bold rounded-xl text-sm hover:bg-blue-800 transition flex-shrink-0">
                            {addingCard ? '✕ Cancelar' : '+ Nueva tarjeta'}
                        </button>
                    </div>

                    {/* Nueva tarjeta form */}
                    {addingCard && (
                        <div className={`mb-6 p-5 rounded-2xl border-2 border-dashed border-blue-400 ${dk ? 'bg-blue-900/10' : 'bg-blue-50/40'}`}>
                            <p className="text-sm font-bold text-blue-600 mb-3">➕ Agregar nueva tarjeta</p>
                            <form onSubmit={handleAddNewCard} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Título *</label>
                                    <input type="text" value={newCardForm.title} onChange={e => setNewCardForm(f => ({ ...f, title: e.target.value }))} className={input} required />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Texto del botón</label>
                                    <input type="text" placeholder="Ver más" value={newCardForm.button_text} onChange={e => setNewCardForm(f => ({ ...f, button_text: e.target.value }))} className={input} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Descripción</label>
                                    <textarea value={newCardForm.description} onChange={e => setNewCardForm(f => ({ ...f, description: e.target.value }))} rows={2} className={input} />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Path (ruta) *</label>
                                    <input type="text" placeholder="ej: maestros" value={newCardForm.path} onChange={e => setNewCardForm(f => ({ ...f, path: e.target.value }))} className={input} required />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">URL Externa</label>
                                    <input type="text" placeholder="https://..." value={newCardForm.external_url} onChange={e => setNewCardForm(f => ({ ...f, external_url: e.target.value }))} className={input} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">ID de Aviso (Post ID) - Opcional</label>
                                    <div className="flex gap-2">
                                        <input type="number" placeholder="Vincular a una publicación global específica" value={newCardForm.post_id} onChange={e => setNewCardForm(f => ({ ...f, post_id: e.target.value }))} className={input} />
                                        <button type="button" onClick={async () => {
                                            const id = await handleCreatePostForCard(newCardForm.title || 'Nueva Publicación');
                                            if (id) setNewCardForm({ ...newCardForm, post_id: id });
                                        }} className="px-3 py-2 bg-purple-100 text-purple-700 rounded-xl text-xs font-bold hover:bg-purple-200 transition whitespace-nowrap">
                                            + Crear Nuevo Contenido
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">URL de imagen *</label>
                                    <input type="text" placeholder="/images/..." value={newCardForm.image_url} onChange={e => setNewCardForm(f => ({ ...f, image_url: e.target.value }))} className={input} />
                                </div>
                                <div className="md:col-span-2 grid grid-cols-3 gap-2 items-end">
                                    <div className="col-span-2">
                                        <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Subir imagen</label>
                                        <input type="file" accept="image/*" onChange={e => setNewCardFile(e.target.files?.[0] || null)} className={`${input} cursor-pointer`} />
                                    </div>
                                    <button type="button" onClick={handleUploadNewCard} disabled={uploadingNewCard || !newCardFile}
                                        className="py-3 bg-green-600 text-white rounded-xl text-sm font-semibold disabled:opacity-50">
                                        {uploadingNewCard ? '⏳...' : '⬆️ Subir'}
                                    </button>
                                </div>
                                {newCardForm.image_url && <div className="md:col-span-2"><img src={newCardForm.image_url} alt="preview" className="h-20 rounded-xl object-cover border" onError={e => e.target.style.display = 'none'} /></div>}
                                <div className="md:col-span-2 flex gap-3">
                                    <button type="submit" disabled={savingNew} className="px-6 py-2.5 bg-blue-700 text-white font-bold rounded-xl transition disabled:opacity-60">
                                        {savingNew ? '💾 Guardando...' : '💾 Agregar tarjeta'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Estado: cargando */}
                    {loadingCards && (
                        <div className="flex items-center justify-center py-16">
                            <div className="flex items-center gap-3 text-slate-400">
                                <span className="material-symbols-outlined animate-spin">refresh</span>
                                Cargando tarjetas desde la base de datos...
                            </div>
                        </div>
                    )}

                    {/* Estado: BD vacía */}
                    {!loadingCards && cards.length === 0 && (
                        <div className={`py-12 text-center rounded-2xl border-2 border-dashed ${dk ? 'border-slate-700' : 'border-slate-200'}`}>
                            <span className="material-symbols-outlined text-5xl text-slate-300 block mb-3">grid_view</span>
                            <p className="font-bold text-lg mb-1">No hay tarjetas en la base de datos</p>
                            <p className="text-sm text-slate-400 mb-5">Carga las tarjetas iniciales para comenzar a editarlas.</p>
                            <div className="flex flex-col gap-3 items-center">
                                <button onClick={handleSeedCards} disabled={seedingCards}
                                    className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition disabled:opacity-60 flex items-center gap-2">
                                    <span className="material-symbols-outlined">{seedingCards ? 'refresh' : 'download'}</span>
                                    {seedingCards ? 'Cargando...' : 'Cargar tarjetas por defecto (10 tarjetas)'}
                                </button>
                                <p className="text-xs text-slate-400">
                                    ⚠️ También asegúrate de ejecutar <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded">supabase_ui_update.sql</span> en Supabase para agregar los campos nuevos.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Lista de tarjetas editables */}
                    {!loadingCards && cards.length > 0 && (
                        <div className="space-y-3 mt-4">
                            {/* Estadísticas rápidas */}
                            <div className="flex gap-3 flex-wrap mb-2">
                                <div className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${dk ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                    Total: {cards.length} tarjetas
                                </div>
                                <div className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${dk ? 'bg-green-900/40 text-green-400' : 'bg-green-50 text-green-700'}`}>
                                    ✅ Visibles: {cards.filter(c => c.is_visible !== false).length}
                                </div>
                                {cards.filter(c => c.is_visible === false).length > 0 && (
                                    <div className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${dk ? 'bg-orange-900/40 text-orange-400' : 'bg-orange-50 text-orange-700'}`}>
                                        🙈 Ocultas: {cards.filter(c => c.is_visible === false).length}
                                    </div>
                                )}
                            </div>

                            {cards.map((card, index) => (
                                <TarjetaEditable
                                    key={card.id}
                                    card={card}
                                    idx={index}
                                    total={cards.length}
                                    darkMode={dk}
                                    onSave={handleSaveCard}
                                    onToggleVisibility={handleToggleVisibility}
                                    onDelete={handleDeleteCard}
                                    onMove={handleMoveCard}
                                    onDuplicate={handleDuplicateCard}
                                    onCreatePost={handleCreatePostForCard}
                                />
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* ═══ TAB: Carrusel ═══════════════════════════════════════════════════ */}
            {activeTab === 'carrusel' && (
                <CarruselSection darkMode={dk} />
            )}

            {/* ═══ TAB: BAETAM ═══════════════════════════════════════════════════ */}
            {activeTab === 'baetam' && (
                <BaetamSection darkMode={dk} />
            )}

            {/* ═══ TAB: Header ═══════════════════════════════════════════════════ */}
            {activeTab === 'header' && (
                <HeaderSection
                    darkMode={dk}
                    uiHeaderForm={uiHeaderForm}
                    setUiHeaderForm={setUiHeaderForm}
                    handleSaveUiHeader={handleSaveUiHeader}
                    uiHeaderLinks={uiHeaderLinks}
                    uiHeaderLinkForm={uiHeaderLinkForm}
                    setUiHeaderLinkForm={setUiHeaderLinkForm}
                    editingHeaderLink={editingHeaderLink}
                    setEditingHeaderLink={setEditingHeaderLink}
                    handleSaveHeaderLink={handleSaveHeaderLink}
                    handleDeleteHeaderLink={handleDeleteHeaderLink}
                />
            )}

            {/* ═══ TAB: Footer ═══════════════════════════════════════════════════ */}
            {activeTab === 'footer' && (
                <FooterSection
                    darkMode={dk}
                    uiFooterForm={uiFooterForm}
                    setUiFooterForm={setUiFooterForm}
                    handleSaveUiFooter={handleSaveUiFooter}
                    uiFooterLinks={uiFooterLinks}
                    uiFooterLinkForm={uiFooterLinkForm}
                    setUiFooterLinkForm={setUiFooterLinkForm}
                    editingFooterLink={editingFooterLink}
                    setEditingFooterLink={setEditingFooterLink}
                    handleSaveFooterLink={handleSaveFooterLink}
                    handleDeleteFooterLink={handleDeleteFooterLink}
                />
            )}
        </div>
    );
};

export default UiInterfazAdmin;
