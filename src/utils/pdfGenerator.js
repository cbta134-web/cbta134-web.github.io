import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// ─── Paleta institucional ────────────────────────────────────
const VERDE = [4, 102, 56];
const DORADO = [180, 140, 15];
const VERDE_CLR = [229, 244, 234];
const GRIS_BG = [243, 245, 243];
const TEXTO = [22, 22, 22];
const GRIS_M = [110, 110, 110];

const M = 11; // margen izq/der en mm

/**
 * Layout exacto por mitad (h = 139.7 mm):
 *
 *  ┌─────────────────────────────────┐  ← oy
 *  │ Barra dorada etiqueta   ( 4mm) │
 *  │ Encabezado verde        (17mm) │
 *  │ Barra folio             (10mm) │  total header = 31mm
 *  │─────────────────────────────────│  y = oy+31
 *  │                                 │
 *  │  TABLAS  (max ≈86mm disponibles)│
 *  │   S1: 29mm                      │
 *  │   S2: 14mm                      │
 *  │   S3: 13mm                      │
 *  │   S4: 16mm  → total ≈72mm       │
 *  │                                 │
 *  │ Firmas             (≥ 12mm)     │  firmaY = pieY-15
 *  │ Pie de página      ( 8mm)       │  pieY = oy+131.7
 *  └─────────────────────────────────┘  ← oy+139.7
 *
 * Fila típica autoTable (fontSize 6.5, pad 0.6 t/b): ≈3.5mm
 * Encabezado sección: 4.5mm
 */
function dibujarFicha(doc, d, oy, h, etiqueta) {
    const W = doc.internal.pageSize.getWidth();
    let y = oy;

    // ── 1. Barra dorada (4 mm) ────────────────────────────────
    doc.setFillColor(...DORADO);
    doc.rect(0, y, W, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(255, 255, 255);
    doc.text(
        `\u25C6  FORMATO DE FICHA DE PRE-REGISTRO  \u2014  ${etiqueta}  \u25C6`,
        W / 2, y + 2.8,
        { align: 'center' }
    );
    y += 4;

    // ── 2. Encabezado verde (17 mm) ───────────────────────────
    doc.setFillColor(...VERDE);
    doc.rect(0, y, W, 17, 'F');

    // Logo
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(M, y + 2, 13, 13, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(...VERDE);
    doc.text('CBTa\n134', M + 6.5, y + 7, { align: 'center', lineHeightFactor: 1.4 });

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(
        'CENTRO DE BACHILLERATO TECNOLÓGICO AGROPECUARIO No. 134',
        W / 2, y + 6.5, { align: 'center' }
    );
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('FICHA DE PRE-REGISTRO DE NUEVO INGRESO', W / 2, y + 11.5, { align: 'center' });
    const anio = new Date().getFullYear();
    doc.setFontSize(6);
    doc.text(`Ciclo Escolar ${anio} \u2013 ${anio + 1}`, W / 2, y + 15.5, { align: 'center' });
    y += 17;

    // ── 3. Barra folio / fecha (10 mm) ───────────────────────
    doc.setFillColor(...GRIS_BG);
    doc.rect(0, y, W, 10, 'F');
    // Acento verde en folio
    doc.setFillColor(...VERDE);
    doc.rect(M, y, 40, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(`FOLIO: ${d.folio || '\u2014'}`, M + 3, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...GRIS_M);
    const fechaReg = d.created_at
        ? new Date(d.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })
        : new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.text(`Fecha de registro: ${fechaReg}`, W - M - 2, y + 7, { align: 'right' });
    y += 11; // y = oy + 32  (dentro del presupuesto)

    // ── Constantes de estilo para autoTable ──────────────────
    // fontSize 6.5pt → altura carácter ≈2.29mm, padding 0.6 c/u → fila ≈3.5mm
    const TBL_STYLES = {
        fontSize: 6.5,
        cellPadding: { top: 0.6, bottom: 0.6, left: 2, right: 2 },
        textColor: TEXTO,
        lineColor: [205, 218, 207],
        lineWidth: 0.2,
    };
    const EVEN_ROW = { fillColor: [249, 252, 250] };

    // Encabezado de sección (4.5mm barra + 0.5mm gap = 5mm total)
    const sHead = (titulo, yPos) => {
        doc.setFillColor(...VERDE);
        doc.rect(M, yPos, W - M * 2, 4.5, 'F');
        doc.setFillColor(...DORADO);
        doc.rect(M, yPos, 2, 4.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.8);
        doc.setTextColor(255, 255, 255);
        doc.text(titulo, M + 5, yPos + 3.2);
        return yPos + 5;
    };

    // Tabla 2 columnas [etiqueta, valor]
    const t2 = (rows, yPos) => {
        autoTable(doc, {
            body: rows,
            startY: yPos,
            margin: { left: M, right: M },
            theme: 'grid',
            styles: TBL_STYLES,
            columnStyles: {
                0: { fontStyle: 'bold', fillColor: VERDE_CLR, cellWidth: 32 },
                1: { cellWidth: 'auto' },
            },
            alternateRowStyles: EVEN_ROW,
            pageBreak: 'avoid',
        });
        return doc.lastAutoTable.finalY + 1;
    };

    // Tabla 4 columnas [key1, val1, key2, val2]
    const t4 = (rows, yPos) => {
        autoTable(doc, {
            body: rows,
            startY: yPos,
            margin: { left: M, right: M },
            theme: 'grid',
            styles: TBL_STYLES,
            columnStyles: {
                0: { fontStyle: 'bold', fillColor: VERDE_CLR, cellWidth: 26 },
                1: { cellWidth: 'auto' },
                2: { fontStyle: 'bold', fillColor: VERDE_CLR, cellWidth: 26 },
                3: { cellWidth: 'auto' },
            },
            alternateRowStyles: EVEN_ROW,
            pageBreak: 'avoid',
        });
        return doc.lastAutoTable.finalY + 1;
    };

    // ── Sección 1: Datos del Aspirante ───────────────────────
    y = sHead('1.  DATOS DEL ASPIRANTE', y);
    y = t2([
        ['Nombre Completo', `${d.nombre || ''} ${d.apellido_paterno || ''} ${d.apellido_materno || ''}`.trim()],
    ], y);
    y = t4([
        ['CURP', d.curp || '\u2014', 'Sexo', d.sexo || '\u2014'],
        ['Fec. Nac.', d.fecha_nacimiento || '\u2014', 'Estado Civil', d.estado_civil || '\u2014'],
        ['Teléfono', d.telefono || '\u2014', 'Correo', d.correo || '\u2014'],
        ['Lugar Nac.', d.lugar_nacimiento || '\u2014', 'Municipio', d.municipio || '\u2014'],
    ], y);
    y = t2([
        ['Domicilio', `${d.domicilio || ''}, Col. ${d.colonia || ''}, C.P. ${d.codigo_postal || ''}`],
    ], y);

    // ── Sección 2: Carreras ───────────────────────────────────
    y = sHead('2.  CARRERAS TÉCNICAS SELECCIONADAS', y);
    const op2 = d.segunda_opcion_carrera;
    const op3 = d.tercera_opcion_carrera;
    if (op2 && op3) {
        y = t2([['1ª Opción', d.carrera_nombre || '\u2014']], y);
        y = t4([['2ª Opción', op2, '3ª Opción', op3]], y);
    } else if (op2) {
        y = t4([['1ª Opción', d.carrera_nombre || '\u2014', '2ª Opción', op2]], y);
    } else {
        y = t2([['1ª Opción', d.carrera_nombre || '\u2014']], y);
    }

    // ── Sección 3: Escuela de Procedencia ────────────────────
    y = sHead('3.  ESCUELA DE PROCEDENCIA', y);
    y = t4([
        ['Tipo', d.escuela_tipo || '\u2014', 'Nombre', d.escuela_nombre || '\u2014'],
        ['Municipio', d.escuela_municipio || '\u2014', 'Promedio', `${d.promedio_general || '\u2014'} / 10`],
    ], y);

    // ── Sección 4: Tutor ──────────────────────────────────────
    y = sHead('4.  PADRE / MADRE / TUTOR LEGAL', y);
    y = t4([
        ['Parentesco', d.tutor_parentesco || '\u2014', 'Nombre', d.tutor_nombre || '\u2014'],
        ['CURP', d.tutor_curp || '\u2014', 'Ocupación', d.tutor_ocupacion || '\u2014'],
        ['Grado Est.', d.tutor_grado_estudios || '\u2014', 'Teléfono', d.tutor_telefono || '\u2014'],
    ], y);

    // ── Pie de página y firmas ────────────────────────────────
    const pieY = oy + h - 8;      // pie = últimos 8mm
    const firmaY = pieY - 16;       // zona de firmas = 16mm antes del pie

    const sigW = (W - M * 2 - 8) / 2;

    doc.setDrawColor(...GRIS_M);
    doc.setLineWidth(0.25);

    // Firma aspirante
    doc.line(M, firmaY + 10, M + sigW, firmaY + 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(...GRIS_M);
    doc.text('Firma del Aspirante', M + sigW / 2, firmaY + 13, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text(
        `${d.nombre || ''} ${d.apellido_paterno || ''}`.trim(),
        M + sigW / 2, firmaY + 15.5, { align: 'center' }
    );

    // Firma tutor
    const sx2 = M + sigW + 8;
    doc.line(sx2, firmaY + 10, sx2 + sigW, firmaY + 10);
    doc.setFont('helvetica', 'normal');
    doc.text('Firma del Padre / Madre / Tutor', sx2 + sigW / 2, firmaY + 13, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text(d.tutor_nombre || '', sx2 + sigW / 2, firmaY + 15.5, { align: 'center' });

    // Pie verde
    doc.setFillColor(...VERDE);
    doc.rect(0, pieY, W, 8, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(255, 255, 255);
    doc.text(
        `${etiqueta}  \u00B7  CBTa 134  \u00B7  No tiene validez sin sello institucional`,
        W / 2, pieY + 3.5, { align: 'center' }
    );
    doc.setFontSize(5.5);
    doc.text(`Folio: ${d.folio || '\u2014'}`, M, pieY + 7);
    doc.text(new Date().toLocaleDateString('es-MX'), W - M, pieY + 7, { align: 'right' });
}

// ─────────────────────────────────────────────────────────────
/**
 * Genera la Ficha de Pre-Registro en PDF.
 *
 * Una sola hoja Carta (215.9 × 279.4 mm) dividida en DOS mitades:
 *   Mitad superior → ORIGINAL
 *   Mitad inferior → COPIA
 * Separadas por línea punteada de recorte.
 *
 * @param {Object} data  Datos completos del pre-registro
 * @returns {Blob}       PDF listo para descargar / imprimir
 */
export async function generarFichaPDF(data) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
    const H = doc.internal.pageSize.getHeight(); // 279.4 mm
    const W = doc.internal.pageSize.getWidth();  // 215.9 mm
    const mitad = H / 2;                             // 139.7 mm

    // ── ORIGINAL (parte superior) ─────────────────────────────
    dibujarFicha(doc, data, 0, mitad, 'ORIGINAL');

    // ── Línea de corte ────────────────────────────────────────
    doc.setDrawColor(160, 160, 160);
    doc.setLineDash([2.5, 1.5], 0);
    doc.line(5, mitad, W - 5, mitad);
    doc.setLineDash([], 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(160, 160, 160);
    doc.text('\u2702   Recorte aquí y conserve la COPIA', W / 2, mitad + 2.8, { align: 'center' });

    // ── COPIA (parte inferior) ────────────────────────────────
    dibujarFicha(doc, data, mitad, mitad, 'COPIA');

    return doc.output('blob');
}
