import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Genera la Ficha de Pre-Registro en PDF (una sola página completa).
 * Datos totalmente separados (municipio, CP, etc.), espacio para foto en el encabezado izquierdo.
 *
 * @param {Object} data - Datos del registro completo
 * @returns {Blob} PDF como Blob
 */
export async function generarFichaPDF(data) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
    const W = doc.internal.pageSize.getWidth();   // 215.9
    const margin = 15;

    // ── Colores institucionales ───────────────────────────
    const colorVerde = [4, 102, 56];   // #046638  CBTa verde
    const colorOro = [212, 175, 55];   // #D4AF37
    const colorGris = [245, 245, 245];
    const colorTexto = [30, 30, 30];
    const colorGrisMedio = [100, 100, 100];
    const BN = [255, 255, 255];

    // ── ENCABEZADO ────────────────────────────────────────
    const headerH = 42;
    doc.setFillColor(...colorVerde);
    doc.rect(0, 0, W, headerH, 'F');

    // RECUADRO PARA FOTO (Top Left)
    const photoW = 27;
    const photoH = 34;
    doc.setFillColor(...BN);
    doc.roundedRect(margin, 4, photoW, photoH, 1, 1, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.rect(margin, 4, photoW, photoH, 'S');

    doc.setFontSize(6.5);
    doc.setTextColor(...colorGrisMedio);
    doc.setFont('helvetica', 'normal');
    doc.text('PEGAR FOTO\nAQUÍ', margin + photoW / 2, 18, { align: 'center', lineHeightFactor: 1.4 });

    // Título principal
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CENTRO DE BACHILLERATO TECNOLÓGICO', W / 2 + 10, 12, { align: 'center' });
    doc.text('AGROPECUARIO No. 134', W / 2 + 10, 19, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('FICHA DE PRE-REGISTRO DE NUEVO INGRESO', W / 2 + 10, 27, { align: 'center' });

    const anio = new Date().getFullYear();
    doc.setFontSize(9.5);
    doc.text(`Ciclo Escolar ${anio}\u2013${anio + 1}`, W / 2 + 10, 34, { align: 'center' });

    // ── FOLIO Y FECHA ─────────────────────────────────────
    let y = headerH + 6;
    doc.setFillColor(...colorGris);
    doc.roundedRect(margin, y, W - margin * 2, 12, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...colorVerde);
    doc.text(`FOLIO: ${data.folio}`, margin + 6, y + 7.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...colorGrisMedio);
    const fechaActual = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.text(`Fecha de emisión: ${fechaActual}`, W - margin - 6, y + 7.5, { align: 'right' });

    y += 16;

    // ── SECCIÓN HELPER ────────────────────────────────────
    const seccionHeader = (titulo, yPos, customWidth) => {
        const width = customWidth || (W - margin * 2);
        doc.setFillColor(...colorVerde);
        doc.rect(margin, yPos, width, 7, 'F');
        doc.setFillColor(212, 175, 55);
        doc.rect(margin, yPos, 2, 7, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(255, 255, 255);
        doc.text(titulo, margin + 5, yPos + 5);
        return yPos + 8;
    };

    const tablaCeldas = (body, yPos, customWidth) => {
        const width = customWidth || (W - margin * 2);
        autoTable(doc, {
            body,
            startY: yPos,
            margin: { left: margin, right: W - (margin + width) },
            theme: 'grid',
            styles: {
                fontSize: 8.5,
                cellPadding: { top: 1.2, bottom: 1.2, left: 3, right: 3 },
                textColor: colorTexto,
                lineColor: [220, 220, 220],
                lineWidth: 0.15,
            },
            columnStyles: {
                0: { fontStyle: 'bold', fillColor: [235, 245, 238], cellWidth: width * 0.35 },
                1: { cellWidth: 'auto' },
            },
            alternateRowStyles: { fillColor: [252, 254, 252] },
        });
        return doc.lastAutoTable.finalY + 3;
    };

    // ── SEC 1: DATOS DEL ASPIRANTE ───────────────────────────
    const sec1Width = (W - margin * 2) - photoW - 5;
    y = seccionHeader('1. DATOS PERSONALES DEL ASPIRANTE', y, sec1Width);

    y = tablaCeldas([
        ['Nombre Completo', `${data.nombre} ${data.apellido_paterno} ${data.apellido_materno}`.toUpperCase()],
        ['CURP', data.curp],
        ['Sexo', data.sexo],
        ['Fecha de Nacimiento', data.fecha_nacimiento],
    ], y, sec1Width);

    // Bajar para que no choque con la foto
    if (y < headerH + 6 + 18 + photoH + 2) {
        y = headerH + 6 + 18 + photoH + 2;
    }

    y = tablaCeldas([
        ['Teléfono de Contacto', data.telefono],
        ['Correo Electrónico', data.correo],
        ['Estado Civil', data.estado_civil],
        ['Lugar de Nacimiento', data.lugar_nacimiento],
        ['Domicilio (Calle y Nº)', data.domicilio],
        ['Colonia', data.colonia],
        ['Municipio', data.municipio],
        ['Código Postal', data.codigo_postal],
    ], y);

    // ── SEC 2: SELECCIÓN ACADÉMICA ──────────────────────────
    y = seccionHeader('2. CARRERAS TÉCNICAS SELECCIONADAS', y);
    const carreraRows = [['PRIMERA OPCIÓN', (data.carrera_nombre || '').toUpperCase()]];
    if (data.segunda_opcion_carrera) carreraRows.push(['SEGUNDA OPCIÓN', (data.segunda_opcion_carrera).toUpperCase()]);
    if (data.tercera_opcion_carrera) carreraRows.push(['TERCERA OPCIÓN', (data.tercera_opcion_carrera).toUpperCase()]);
    y = tablaCeldas(carreraRows, y);

    // ── SEC 3: ANTECEDENTES ESCOLARES ────────────────────────
    y = seccionHeader('3. ESCUELA DE PROCEDENCIA', y);
    y = tablaCeldas([
        ['Nombre de la Escuela', data.escuela_nombre],
        ['Tipo de Subsistema', data.escuela_tipo],
        ['Municipio de la Escuela', data.escuela_municipio],
        ['Promedio General', `${data.promedio_general} / 10.0`],
    ], y);

    // ── SEC 4: DATOS DEL TUTOR ──────────────────────────────
    y = seccionHeader('4. DATOS DEL PADRE, MADRE O TUTOR LEGAL', y);
    y = tablaCeldas([
        ['Nombre Completo', data.tutor_nombre],
        ['Parentesco', data.tutor_parentesco],
        ['CURP del Tutor', data.tutor_curp],
        ['Ocupación', data.tutor_ocupacion],
        ['Grado Máximo de Estudios', data.tutor_grado_estudios],
        ['Teléfono de Contacto', data.tutor_telefono],
    ], y);

    // ── PIE DE PÁGINA ─────────────────────────────────────
    const pH = doc.internal.pageSize.getHeight();
    doc.setFillColor(...colorVerde);
    doc.rect(0, pH - 12, W, 12, 'F');

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    doc.text(
        'CBTa 134 \u00B7 Este documento no tiene validez oficial sin sello de la institución y firmas originales.',
        W / 2, pH - 6.5,
        { align: 'center' }
    );
    doc.setFontSize(7.5);
    doc.text(`Folio de Pre-Registro: ${data.folio}`, margin, pH - 3);
    doc.text(`Documento generado el ${new Date().toLocaleDateString()}`, W - margin, pH - 3, { align: 'right' });

    return doc.output('blob');
}
