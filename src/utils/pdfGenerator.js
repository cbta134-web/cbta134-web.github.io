import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// ─── Paleta institucional ────────────────────────────────────
const VERDE = [4, 102, 56];
const DORADO = [190, 150, 20];
const VERDE_CLR = [230, 245, 236];
const GRIS_BG = [244, 246, 244];
const TEXTO = [22, 22, 22];
const GRIS_M = [105, 105, 105];

// Ancho efectivo de columnas en tabla 4-col (margin=11mm cada lado)
// Tabla width = 215.9 - 22 = 193.9mm
// col0=key1: 30mm  col1=val1: auto  col2=key2: 30mm  col3=val2: auto
const M = 11; // margen izq/der

/**
 * Dibuja una ficha completa en la mitad vertical del documento.
 * @param {jsPDF}  doc
 * @param {Object} d          datos del pre-registro
 * @param {number} oy         offsetY (0 = ORIGINAL, H/2 = COPIA)
 * @param {number} h          altura disponible (H/2)
 * @param {string} etiqueta   "ORIGINAL" | "COPIA"
 */
function dibujarFicha(doc, d, oy, h, etiqueta) {
    const W = doc.internal.pageSize.getWidth();
    let y = oy;

    // ── 1. Barra dorada de identificación (4.5 mm) ───────────
    doc.setFillColor(...DORADO);
    doc.rect(0, y, W, 4.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(255, 255, 255);
    doc.text(
        `◆  FORMATO DE FICHA DE PRE-REGISTRO  —  ${etiqueta}  ◆`,
        W / 2, y + 3.1,
        { align: 'center' }
    );
    y += 4.5;

    // ── 2. Encabezado institucional verde (19 mm) ─────────────
    doc.setFillColor(...VERDE);
    doc.rect(0, y, W, 19, 'F');

    // Cuadro logo blanco
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(M, y + 2.5, 14, 14, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.8);
    doc.setTextColor(...VERDE);
    doc.text('CBTa\n134', M + 7, y + 8, { align: 'center', lineHeightFactor: 1.5 });

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('CENTRO DE BACHILLERATO TECNOLÓGICO AGROPECUARIO No. 134', W / 2, y + 7, { align: 'center' });
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text('FICHA DE PRE-REGISTRO DE NUEVO INGRESO', W / 2, y + 12.5, { align: 'center' });
    const anio = new Date().getFullYear();
    doc.setFontSize(6.5);
    doc.text(`Ciclo Escolar ${anio} – ${anio + 1}`, W / 2, y + 17, { align: 'center' });
    y += 19;

    // ── 3. Barra folio / fecha (9.5 mm) ──────────────────────
    doc.setFillColor(...GRIS_BG);
    doc.rect(0, y, W, 9.5, 'F');

    // Franja verde izquierda del folio
    doc.setFillColor(...VERDE);
    doc.rect(M, y, 42, 9.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`FOLIO: ${d.folio || '—'}`, M + 3, y + 6.3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...GRIS_M);
    const fechaReg = d.created_at
        ? new Date(d.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })
        : new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.text(`Fecha de registro: ${fechaReg}`, W - M - 2, y + 6.3, { align: 'right' });
    y += 11;

    // ── Helpers de layout ────────────────────────────────────

    /** Encabezado de sección verde compacto (5 mm) */
    const sHead = (titulo, yPos) => {
        doc.setFillColor(...VERDE);
        doc.rect(M, yPos, W - M * 2, 5, 'F');
        // Separador dorado izquierdo
        doc.setFillColor(...DORADO);
        doc.rect(M, yPos, 2.5, 5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(255, 255, 255);
        doc.text(titulo, M + 6, yPos + 3.4);
        return yPos + 5.5;
    };

    /** Tabla de 2 col: [etiqueta, valor] */
    const t2 = (rows, yPos) => {
        autoTable(doc, {
            body: rows,
            startY: yPos,
            margin: { left: M, right: M },
            theme: 'grid',
            styles: {
                fontSize: 7,
                cellPadding: { top: 0.9, bottom: 0.9, left: 2, right: 2 },
                textColor: TEXTO,
                lineColor: [210, 220, 210],
                lineWidth: 0.2,
            },
            columnStyles: {
                0: { fontStyle: 'bold', fillColor: VERDE_CLR, cellWidth: 34 },
                1: { cellWidth: 'auto' },
            },
            alternateRowStyles: { fillColor: [249, 252, 250] },
        });
        return doc.lastAutoTable.finalY + 1.5;
    };

    /** Tabla de 4 col: [key1, val1, key2, val2] */
    const t4 = (rows, yPos) => {
        autoTable(doc, {
            body: rows,
            startY: yPos,
            margin: { left: M, right: M },
            theme: 'grid',
            styles: {
                fontSize: 7,
                cellPadding: { top: 0.9, bottom: 0.9, left: 2, right: 2 },
                textColor: TEXTO,
                lineColor: [210, 220, 210],
                lineWidth: 0.2,
            },
            columnStyles: {
                0: { fontStyle: 'bold', fillColor: VERDE_CLR, cellWidth: 28 },
                1: { cellWidth: 'auto' },
                2: { fontStyle: 'bold', fillColor: VERDE_CLR, cellWidth: 28 },
                3: { cellWidth: 'auto' },
            },
            alternateRowStyles: { fillColor: [249, 252, 250] },
        });
        return doc.lastAutoTable.finalY + 1.5;
    };

    // ── Sección 1: Datos del Aspirante ───────────────────────
    y = sHead('1.  DATOS DEL ASPIRANTE', y);

    // Nombre completo en fila ancha
    y = t2([
        ['Nombre Completo', `${d.nombre || ''} ${d.apellido_paterno || ''} ${d.apellido_materno || ''}`.trim()],
    ], y);

    // Datos en 4 columnas
    y = t4([
        ['CURP', d.curp || '—', 'Sexo', d.sexo || '—'],
        ['Fec. Nac.', d.fecha_nacimiento || '—', 'Estado Civil', d.estado_civil || '—'],
        ['Teléfono', d.telefono || '—', 'Correo', d.correo || '—'],
        ['Lugar Nac.', d.lugar_nacimiento || '—', 'Municipio', d.municipio || '—'],
    ], y);

    // Domicilio completo en fila ancha
    y = t2([
        ['Domicilio', `${d.domicilio || ''}, Col. ${d.colonia || ''}, C.P. ${d.codigo_postal || ''}`],
    ], y);

    // ── Sección 2: Carreras ──────────────────────────────────
    y = sHead('2.  CARRERAS TÉCNICAS SELECCIONADAS', y);
    const op2 = d.segunda_opcion_carrera;
    const op3 = d.tercera_opcion_carrera;
    if (op2 && op3) {
        // Tres opciones: 1ª en fila ancha, 2ª y 3ª en 4-col
        y = t2([['1ª Opción', d.carrera_nombre || '—']], y);
        y = t4([['2ª Opción', op2, '3ª Opción', op3]], y);
    } else if (op2) {
        y = t4([['1ª Opción', d.carrera_nombre || '—', '2ª Opción', op2]], y);
    } else {
        y = t2([['1ª Opción', d.carrera_nombre || '—']], y);
    }

    // ── Sección 3: Escuela de Procedencia ───────────────────
    y = sHead('3.  ESCUELA DE PROCEDENCIA', y);
    y = t4([
        ['Tipo', d.escuela_tipo || '—', 'Nombre', d.escuela_nombre || '—'],
        ['Municipio', d.escuela_municipio || '—', 'Promedio', `${d.promedio_general || '—'} / 10`],
    ], y);

    // ── Sección 4: Tutor ─────────────────────────────────────
    y = sHead('4.  PADRE / MADRE / TUTOR LEGAL', y);
    y = t4([
        ['Parentesco', d.tutor_parentesco || '—', 'Nombre', d.tutor_nombre || '—'],
        ['CURP', d.tutor_curp || '—', 'Ocupación', d.tutor_ocupacion || '—'],
        ['Grado Est.', d.tutor_grado_estudios || '—', 'Teléfono', d.tutor_telefono || '—'],
    ], y);

    // ── Firmas ───────────────────────────────────────────────
    const pieY = oy + h - 9;          // pie ocupa últimos 9 mm
    const firmaY = pieY - 17;           // espacio de firmas sobre el pie

    const sigW = (W - M * 2 - 8) / 2;
    doc.setDrawColor(...GRIS_M);
    doc.setLineWidth(0.3);

    // Firma aspirante
    doc.line(M, firmaY + 11, M + sigW, firmaY + 11);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRIS_M);
    doc.text('Firma del Aspirante', M + sigW / 2, firmaY + 14.5, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text(`${d.nombre || ''} ${d.apellido_paterno || ''}`.trim(), M + sigW / 2, firmaY + 17.5, { align: 'center' });

    // Firma tutor
    const sx2 = M + sigW + 8;
    doc.line(sx2, firmaY + 11, sx2 + sigW, firmaY + 11);
    doc.setFont('helvetica', 'normal');
    doc.text('Firma del Padre / Tutor', sx2 + sigW / 2, firmaY + 14.5, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text(d.tutor_nombre || '', sx2 + sigW / 2, firmaY + 17.5, { align: 'center' });

    // ── Pie de página ─────────────────────────────────────────
    doc.setFillColor(...VERDE);
    doc.rect(0, pieY, W, 9, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(255, 255, 255);
    doc.text(
        `${etiqueta}  ·  CBTa 134  ·  No tiene validez sin sello institucional`,
        W / 2, pieY + 3.8,
        { align: 'center' }
    );
    doc.setFontSize(5.8);
    doc.text(`Folio: ${d.folio || '—'}`, M, pieY + 7.5);
    doc.text(new Date().toLocaleDateString('es-MX'), W - M, pieY + 7.5, { align: 'right' });
}

// ─────────────────────────────────────────────────────────────
/**
 * Genera la Ficha de Pre-Registro en PDF.
 * El PDF es de tamaño Carta (215.9 × 279.4 mm).
 * La hoja se divide en DOS mitades horizontales:
 *   – Mitad superior → ORIGINAL
 *   – Mitad inferior → COPIA
 * Separadas por una línea punteada de corte.
 *
 * @param {Object} data  Datos completos del pre-registro
 * @returns {Blob}       PDF listo para descargar o abrir
 */
export async function generarFichaPDF(data) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
    const H = doc.internal.pageSize.getHeight(); // 279.4
    const W = doc.internal.pageSize.getWidth();  // 215.9
    const mitad = H / 2;                             // 139.7

    // ── ORIGINAL (mitad superior) ─────────────────────────────
    dibujarFicha(doc, data, 0, mitad, 'ORIGINAL');

    // ── Línea de corte ────────────────────────────────────────
    doc.setDrawColor(160, 160, 160);
    doc.setLineDash([2.5, 1.5], 0);
    doc.line(6, mitad, W - 6, mitad);
    doc.setLineDash([], 0);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(160, 160, 160);
    doc.text('✂   Recorte aquí y conserve la COPIA', W / 2, mitad + 3, { align: 'center' });

    // ── COPIA (mitad inferior) ────────────────────────────────
    dibujarFicha(doc, data, mitad, mitad, 'COPIA');

    return doc.output('blob');
}
