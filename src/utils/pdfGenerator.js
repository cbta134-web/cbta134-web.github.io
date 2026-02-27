import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// ── Colores institucionales ──────────────────────────────────
const colorVerde = [4, 102, 56];   // #046638  CBTa verde
const colorOro = [212, 175, 55]; // #D4AF37
const colorGris = [245, 245, 245];
const colorTexto = [30, 30, 30];
const colorGrisMedio = [100, 100, 100];

/**
 * Dibuja UNA copia de la ficha dentro del doc, comenzando en offsetY.
 * La "copia" se dibuja en el espacio vertical [offsetY, offsetY + altoCopia].
 *
 * @param {jsPDF} doc
 * @param {Object} data   - datos del pre-registro
 * @param {number} offsetY - coordenada Y donde empieza la copia
 * @param {number} altoCopia - altura disponible para esta copia (mm)
 * @param {string} etiqueta - "ORIGINAL" | "COPIA"
 */
function dibujarFicha(doc, data, offsetY, altoCopia, etiqueta) {
    const W = doc.internal.pageSize.getWidth(); // 215.9
    const margin = 12;
    let y = offsetY;

    // ── Etiqueta formato (arriba del encabezado) ──────────────
    doc.setFillColor(212, 175, 55);          // dorado
    doc.rect(0, y, W, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(30, 30, 30);
    doc.text(
        `FORMATO DE FICHA DE PRE-REGISTRO  ·  ${etiqueta}`,
        W / 2, y + 3.5,
        { align: 'center' }
    );
    y += 5;

    // ── ENCABEZADO verde ──────────────────────────────────────
    doc.setFillColor(...colorVerde);
    doc.rect(0, y, W, 26, 'F');

    // Logo cuadro blanco
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, y + 4, 16, 16, 2, 2, 'F');
    doc.setFontSize(6.5);
    doc.setTextColor(...colorVerde);
    doc.setFont('helvetica', 'bold');
    doc.text('CBTa\n134', margin + 8, y + 10, { align: 'center', lineHeightFactor: 1.5 });

    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CENTRO DE BACHILLERATO TECNOLÓGICO', W / 2, y + 8, { align: 'center' });
    doc.text('AGROPECUARIO No. 134', W / 2, y + 14, { align: 'center' });
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text('FICHA DE PRE-REGISTRO DE NUEVO INGRESO', W / 2, y + 20, { align: 'center' });

    // Ciclo escolar
    const anio = new Date().getFullYear();
    doc.setFontSize(7.5);
    doc.text(`Ciclo Escolar ${anio}–${anio + 1}`, W / 2, y + 25, { align: 'center' });
    y += 26;

    // ── FOLIO Y FECHA ─────────────────────────────────────────
    doc.setFillColor(...colorGris);
    doc.roundedRect(margin, y + 2, W - margin * 2, 10, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...colorVerde);
    doc.text(`FOLIO: ${data.folio || '—'}`, margin + 4, y + 8.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...colorGrisMedio);
    const fechaReg = data.created_at
        ? new Date(data.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })
        : new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.text(`Fecha: ${fechaReg}`, W - margin - 4, y + 8.5, { align: 'right' });
    y += 16;

    // ── HELPERS LOCALES ───────────────────────────────────────
    const seccionHeader = (titulo, yPos) => {
        doc.setFillColor(...colorVerde);
        doc.rect(margin, yPos, W - margin * 2, 6, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text(titulo, margin + 3, yPos + 4.3);
        return yPos + 7;
    };

    const tablaCeldas = (body, yPos) => {
        autoTable(doc, {
            body,
            startY: yPos,
            margin: { left: margin, right: margin },
            theme: 'grid',
            styles: {
                fontSize: 7.5,
                cellPadding: { top: 1.2, bottom: 1.2, left: 2.5, right: 2.5 },
                textColor: colorTexto,
            },
            columnStyles: {
                0: { fontStyle: 'bold', fillColor: [230, 245, 235], cellWidth: 48 },
                1: { cellWidth: 'auto' },
            },
            alternateRowStyles: { fillColor: [250, 252, 250] },
        });
        return doc.lastAutoTable.finalY + 3;
    };

    // ── SEC 1: DATOS PERSONALES ───────────────────────────────
    y = seccionHeader('1. DATOS DEL ASPIRANTE', y);
    y = tablaCeldas([
        ['Nombre Completo', `${data.nombre} ${data.apellido_paterno} ${data.apellido_materno}`],
        ['CURP', data.curp],
        ['Sexo', data.sexo],
        ['Fec. Nacimiento', data.fecha_nacimiento],
        ['Correo', data.correo],
        ['Estado Civil', data.estado_civil],
        ['Teléfono', data.telefono],
        ['Lugar Nacimiento', data.lugar_nacimiento],
        ['Domicilio', `${data.domicilio}, Col. ${data.colonia}, ${data.municipio} C.P. ${data.codigo_postal}`],
    ], y);

    // ── SEC 2: CARRERA(S) ─────────────────────────────────────
    y = seccionHeader('2. CARRERAS TÉCNICAS SELECCIONADAS', y);
    const carreraRows = [['1ª Opción', data.carrera_nombre]];
    if (data.segunda_opcion_carrera) carreraRows.push(['2ª Opción', data.segunda_opcion_carrera]);
    if (data.tercera_opcion_carrera) carreraRows.push(['3ª Opción', data.tercera_opcion_carrera]);
    y = tablaCeldas(carreraRows, y);

    // ── SEC 3: ESCUELA ────────────────────────────────────────
    y = seccionHeader('3. ESCUELA DE PROCEDENCIA', y);
    y = tablaCeldas([
        ['Tipo', data.escuela_tipo],
        ['Nombre', data.escuela_nombre],
        ['Municipio', data.escuela_municipio],
        ['Promedio', `${data.promedio_general} / 10`],
    ], y);

    // ── SEC 4: TUTOR ──────────────────────────────────────────
    y = seccionHeader('4. PADRE / MADRE / TUTOR', y);
    y = tablaCeldas([
        ['Parentesco', data.tutor_parentesco],
        ['Nombre', data.tutor_nombre],
        ['CURP', data.tutor_curp],
        ['Ocupación', data.tutor_ocupacion],
        ['Grado Estudios', data.tutor_grado_estudios],
        ['Teléfono', data.tutor_telefono],
    ], y);

    // ── FIRMAS ────────────────────────────────────────────────
    y += 4;
    const sigW = (W - margin * 2 - 10) / 2;

    doc.setDrawColor(...colorGrisMedio);
    doc.line(margin, y + 12, margin + sigW, y + 12);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colorGrisMedio);
    doc.text('Firma del Aspirante', margin + sigW / 2, y + 16, { align: 'center' });
    doc.text(`${data.nombre || ''} ${data.apellido_paterno || ''}`, margin + sigW / 2, y + 19.5, { align: 'center' });

    const sig2X = margin + sigW + 10;
    doc.line(sig2X, y + 12, sig2X + sigW, y + 12);
    doc.text('Firma del Padre / Tutor', sig2X + sigW / 2, y + 16, { align: 'center' });
    doc.text(data.tutor_nombre || '', sig2X + sigW / 2, y + 19.5, { align: 'center' });

    // ── PIE ───────────────────────────────────────────────────
    const pieY = offsetY + altoCopia - 10;
    doc.setFillColor(...colorVerde);
    doc.rect(0, pieY, W, 10, 'F');
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    doc.text(
        `${etiqueta}  ·  CBTa 134 · Documento de Pre-Registro · No tiene validez sin sello institucional`,
        W / 2, pieY + 4,
        { align: 'center' }
    );
    doc.text(`Folio: ${data.folio || '—'}`, margin, pieY + 8);
    doc.text(new Date().toLocaleDateString('es-MX'), W - margin, pieY + 8, { align: 'right' });
}

/**
 * Genera la Ficha de Pre-Registro en PDF.
 * Imprime DOS copias en la misma página: ORIGINAL (arriba) y COPIA (abajo),
 * separadas por una línea punteada con la leyenda "✂ CUT".
 *
 * @param {Object} data - Datos del registro completo
 * @returns {Blob} PDF como Blob
 */
export async function generarFichaPDF(data) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
    const H = doc.internal.pageSize.getHeight(); // 279.4 mm (carta)
    const W = doc.internal.pageSize.getWidth();  // 215.9 mm
    const mitad = H / 2;

    // ── Copia ORIGINAL (mitad superior) ──────────────────────
    dibujarFicha(doc, data, 0, mitad, 'ORIGINAL');

    // ── Línea separadora ──────────────────────────────────────
    doc.setDrawColor(150, 150, 150);
    doc.setLineDash([3, 2], 0);
    doc.line(8, mitad, W - 8, mitad);
    doc.setLineDash([], 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(150, 150, 150);
    doc.text('✂  Recorta aquí  ·  COPIA', W / 2, mitad - 1, { align: 'center' });

    // ── Copia COPIA (mitad inferior) ─────────────────────────
    dibujarFicha(doc, data, mitad, mitad, 'COPIA');

    return doc.output('blob');
}

/**
 * Genera UN solo PDF con las fichas de MÚLTIPLES pre-registros.
 * Cada pre-registro ocupa una página y se imprime con ORIGINAL + COPIA.
 *
 * @param {Array<Object>} registros - Array de objetos de pre-registro
 * @param {string|number} year      - Año para el nombre del archivo
 * @returns {void} Descarga el PDF directamente
 */
export async function generarFichasPDFMasivo(registros, year) {
    if (!registros || registros.length === 0) return;

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
    const H = doc.internal.pageSize.getHeight();
    const W = doc.internal.pageSize.getWidth();
    const mitad = H / 2;

    registros.forEach((data, idx) => {
        if (idx > 0) doc.addPage();

        // ORIGINAL (mitad superior)
        dibujarFicha(doc, data, 0, mitad, 'ORIGINAL');

        // Línea separadora
        doc.setDrawColor(150, 150, 150);
        doc.setLineDash([3, 2], 0);
        doc.line(8, mitad, W - 8, mitad);
        doc.setLineDash([], 0);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(150, 150, 150);
        doc.text('✂  Recorta aquí  ·  COPIA', W / 2, mitad - 1, { align: 'center' });

        // COPIA (mitad inferior)
        dibujarFicha(doc, data, mitad, mitad, 'COPIA');
    });

    const fileName = `Fichas_PreRegistro_${year}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
}
