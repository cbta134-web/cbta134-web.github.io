import { jsPDF } from 'jspdf';

// ─── Paleta CBTa 134 ────────────────────────────────────────
const V = [4, 102, 56];       // verde institucional
const D = [180, 140, 15];     // dorado
const VC = [229, 244, 234];   // verde claro (celdas)
const GB = [243, 245, 243];   // gris background
const TX = [22, 22, 22];      // texto
const GM = [115, 115, 115];   // gris medio
const BN = [255, 255, 255];   // blanco
const LN = [200, 215, 200];   // líneas de tabla

const M = 11; // margen lateral

// ─── Helpers de dibujo ──────────────────────────────────────
/**
 * Dibuja una celda con borde, fondo y texto.
 */
function cel(doc, x, y, w, h, texto, opts = {}) {
    const { bold, bg, fontSize = 6.3, align = 'left', textColor } = opts;
    // Fondo
    if (bg) {
        doc.setFillColor(...bg);
        doc.rect(x, y, w, h, 'F');
    }
    // Borde
    doc.setDrawColor(...LN);
    doc.setLineWidth(0.18);
    doc.rect(x, y, w, h, 'S');
    // Texto
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(...(textColor || TX));
    const tx = align === 'center' ? x + w / 2 : x + 1.8;
    const ty = y + h / 2 + 1.2;
    doc.text(String(texto || ''), tx, ty, { align: align === 'center' ? 'center' : 'left', maxWidth: w - 3 });
}

/**
 * Dibuja una fila de 2 columnas: [etiqueta | valor]
 * Retorna y + rowH
 */
function fila2(doc, x, y, wTotal, rH, label, valor) {
    const wLabel = 32;
    cel(doc, x, y, wLabel, rH, label, { bold: true, bg: VC });
    cel(doc, x + wLabel, y, wTotal - wLabel, rH, valor);
    return y + rH;
}

/**
 * Dibuja una fila de 4 columnas: [key1 | val1 | key2 | val2]
 * Retorna y + rowH
 */
function fila4(doc, x, y, wTotal, rH, k1, v1, k2, v2) {
    const wKey = 26;
    const wVal = (wTotal - wKey * 2) / 2;
    cel(doc, x, y, wKey, rH, k1, { bold: true, bg: VC });
    cel(doc, x + wKey, y, wVal, rH, v1);
    cel(doc, x + wKey + wVal, y, wKey, rH, k2, { bold: true, bg: VC });
    cel(doc, x + wKey * 2 + wVal, y, wVal, rH, v2);
    return y + rH;
}

/**
 * Encabezado de sección verde con acento dorado
 */
function seccion(doc, x, y, w, h, titulo) {
    doc.setFillColor(...V);
    doc.rect(x, y, w, h, 'F');
    doc.setFillColor(...D);
    doc.rect(x, y, 2, h, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...BN);
    doc.text(titulo, x + 5, y + h / 2 + 1.1);
    return y + h + 0.3;
}

// ─── Función principal: dibuja TODA la ficha ─────────────────
/**
 * Dibuja una ficha completa (ORIGINAL o COPIA) en la región
 * vertical [oy ... oy + halfH] del documento.
 *
 * Cada elemento se posiciona manualmente → NO usa autoTable
 * → NO hay riesgo de desbordamiento.
 */
function dibujarFicha(doc, d, oy, halfH, etiqueta) {
    const W = doc.internal.pageSize.getWidth(); // 215.9
    const wT = W - M * 2; // ancho útil de tabla = 193.9
    const rH = 3.9;       // altura de fila de datos
    let y = oy;

    // ── 1. Barra dorada etiqueta (3.5mm) ─────────────────────
    doc.setFillColor(...D);
    doc.rect(0, y, W, 3.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(...BN);
    doc.text(
        `\u25C6  FORMATO DE FICHA DE PRE-REGISTRO  \u2014  ${etiqueta}  \u25C6`,
        W / 2, y + 2.5, { align: 'center' }
    );
    y += 3.5;

    // ── 2. Encabezado verde institucional (15mm) ─────────────
    doc.setFillColor(...V);
    doc.rect(0, y, W, 15, 'F');
    // Logo
    doc.setFillColor(...BN);
    doc.roundedRect(M, y + 1.5, 12, 12, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.2);
    doc.setTextColor(...V);
    doc.text('CBTa', M + 6, y + 5.5, { align: 'center' });
    doc.text('134', M + 6, y + 9, { align: 'center' });
    // Texto
    doc.setTextColor(...BN);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('CENTRO DE BACHILLERATO TECNOLÓGICO AGROPECUARIO No. 134', W / 2, y + 5.5, { align: 'center' });
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.text('FICHA DE PRE-REGISTRO DE NUEVO INGRESO', W / 2, y + 9.5, { align: 'center' });
    const anio = new Date().getFullYear();
    doc.setFontSize(5.8);
    doc.text(`Ciclo Escolar ${anio} \u2013 ${anio + 1}`, W / 2, y + 13, { align: 'center' });
    y += 15;

    // ── 3. Barra folio / fecha (8mm) ─────────────────────────
    doc.setFillColor(...GB);
    doc.rect(0, y, W, 8, 'F');
    doc.setFillColor(...V);
    doc.rect(M, y, 38, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...BN);
    doc.text(`FOLIO: ${d.folio || '\u2014'}`, M + 3, y + 5.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(...GM);
    const fechaReg = d.created_at
        ? new Date(d.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })
        : new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.text(`Fecha de registro: ${fechaReg}`, W - M - 2, y + 5.5, { align: 'right' });
    y += 9;

    // ═══════════════════════════════════════════════════════════
    // DATOS EN TABLAS MANUALES (no autoTable)
    // Total encabezados: 3.5+15+8+1 = 27.5mm
    // Espacio para datos: halfH - 27.5 - 20 (firmas+pie) = ~92mm @ halfH=139.7
    // Filas estimadas: S1(8 filas)=31mm + S2(2 filas)=12mm + S3(2 filas)=12mm + S4(3 filas)=16mm ≈71mm ✓
    // ═══════════════════════════════════════════════════════════

    // ── SECCIÓN 1: DATOS DEL ASPIRANTE ───────────────────────
    y = seccion(doc, M, y, wT, 4.2, '1.  DATOS DEL ASPIRANTE');
    y = fila2(doc, M, y, wT, rH, 'Nombre Completo', `${d.nombre || ''} ${d.apellido_paterno || ''} ${d.apellido_materno || ''}`.trim());
    y = fila4(doc, M, y, wT, rH, 'CURP', d.curp || '', 'Sexo', d.sexo || '');
    y = fila4(doc, M, y, wT, rH, 'Fec. Nac.', d.fecha_nacimiento || '', 'Estado Civil', d.estado_civil || '');
    y = fila4(doc, M, y, wT, rH, 'Teléfono', d.telefono || '', 'Correo', d.correo || '');
    y = fila4(doc, M, y, wT, rH, 'Lugar Nac.', d.lugar_nacimiento || '', 'Municipio', d.municipio || '');
    y = fila2(doc, M, y, wT, rH, 'Domicilio', `${d.domicilio || ''}, Col. ${d.colonia || ''}, C.P. ${d.codigo_postal || ''}`);
    y += 0.8;

    // ── SECCIÓN 2: CARRERAS ──────────────────────────────────
    y = seccion(doc, M, y, wT, 4.2, '2.  CARRERAS TÉCNICAS SELECCIONADAS');
    const op2 = d.segunda_opcion_carrera;
    const op3 = d.tercera_opcion_carrera;
    y = fila2(doc, M, y, wT, rH, '1ª Opción', d.carrera_nombre || '');
    if (op2) y = fila4(doc, M, y, wT, rH, '2ª Opción', op2, op3 ? '3ª Opción' : '', op3 || '');
    y += 0.8;

    // ── SECCIÓN 3: ESCUELA DE PROCEDENCIA ────────────────────
    y = seccion(doc, M, y, wT, 4.2, '3.  ESCUELA DE PROCEDENCIA');
    y = fila4(doc, M, y, wT, rH, 'Tipo', d.escuela_tipo || '', 'Nombre', d.escuela_nombre || '');
    y = fila4(doc, M, y, wT, rH, 'Municipio', d.escuela_municipio || '', 'Promedio', `${d.promedio_general || ''} / 10`);
    y += 0.8;

    // ── SECCIÓN 4: TUTOR ─────────────────────────────────────
    y = seccion(doc, M, y, wT, 4.2, '4.  PADRE / MADRE / TUTOR LEGAL');
    y = fila4(doc, M, y, wT, rH, 'Parentesco', d.tutor_parentesco || '', 'Nombre', d.tutor_nombre || '');
    y = fila4(doc, M, y, wT, rH, 'CURP', d.tutor_curp || '', 'Ocupación', d.tutor_ocupacion || '');
    y = fila4(doc, M, y, wT, rH, 'Grado Est.', d.tutor_grado_estudios || '', 'Teléfono', d.tutor_telefono || '');

    // ── FIRMAS (posición fija respecto al pie) ───────────────
    const pieY = oy + halfH - 7;
    const firmaY = pieY - 14;
    const sigW = (W - M * 2 - 10) / 2;

    doc.setDrawColor(...GM);
    doc.setLineWidth(0.25);

    doc.line(M, firmaY + 9, M + sigW, firmaY + 9);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(...GM);
    doc.text('Firma del Aspirante', M + sigW / 2, firmaY + 12, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text(`${d.nombre || ''} ${d.apellido_paterno || ''}`.trim(), M + sigW / 2, firmaY + 14.5, { align: 'center' });

    const sx2 = M + sigW + 10;
    doc.line(sx2, firmaY + 9, sx2 + sigW, firmaY + 9);
    doc.setFont('helvetica', 'normal');
    doc.text('Firma del Padre / Madre / Tutor', sx2 + sigW / 2, firmaY + 12, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text(d.tutor_nombre || '', sx2 + sigW / 2, firmaY + 14.5, { align: 'center' });

    // ── PIE DE PÁGINA ────────────────────────────────────────
    doc.setFillColor(...V);
    doc.rect(0, pieY, W, 7, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(...BN);
    doc.text(
        `${etiqueta}  \u00B7  CBTa 134  \u00B7  No tiene validez sin sello institucional`,
        W / 2, pieY + 3, { align: 'center' }
    );
    doc.setFontSize(5);
    doc.text(`Folio: ${d.folio || '\u2014'}`, M, pieY + 6);
    doc.text(new Date().toLocaleDateString('es-MX'), W - M, pieY + 6, { align: 'right' });
}

// ─────────────────────────────────────────────────────────────
/**
 * Genera la Ficha de Pre-Registro en PDF.
 *
 * Una hoja Carta dividida al 50%:
 *   Superior → ORIGINAL
 *   Inferior → COPIA (idéntica)
 * Con línea punteada de corte entre ambas.
 *
 * NO usa autoTable → todo el layout es manual y preciso.
 *
 * @param {Object} data  Datos completos del pre-registro
 * @returns {Blob}       PDF listo para descargar
 */
export async function generarFichaPDF(data) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
    const H = doc.internal.pageSize.getHeight(); // 279.4
    const W = doc.internal.pageSize.getWidth();  // 215.9
    const halfH = H / 2;                             // 139.7

    // ORIGINAL (mitad superior)
    dibujarFicha(doc, data, 0, halfH, 'ORIGINAL');

    // Línea de corte
    doc.setDrawColor(160, 160, 160);
    doc.setLineDash([2.5, 1.5], 0);
    doc.setLineWidth(0.2);
    doc.line(5, halfH, W - 5, halfH);
    doc.setLineDash([], 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(160, 160, 160);
    doc.text('\u2702   Recorte aquí y conserve la COPIA', W / 2, halfH + 2.5, { align: 'center' });

    // COPIA (mitad inferior)
    dibujarFicha(doc, data, halfH, halfH, 'COPIA');

    return doc.output('blob');
}
