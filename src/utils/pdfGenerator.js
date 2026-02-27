import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Genera la Ficha de Pre-Registro en PDF (una sola página completa).
 * Sin firmas, con espacio para foto y layout optimizado.
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
    doc.setFillColor(...colorVerde);
    doc.rect(0, 0, W, 32, 'F');

    // Logo
    doc.setFillColor(...BN);
    doc.roundedRect(margin, 6, 20, 20, 2, 2, 'F');
    doc.setFontSize(7);
    doc.setTextColor(...colorVerde);
    doc.setFont('helvetica', 'bold');
    doc.text('CBTa\n134', margin + 10, 14, { align: 'center', lineHeightFactor: 1.5 });

    // Título principal
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('CENTRO DE BACHILLERATO TECNOLÓGICO', W / 2, 11, { align: 'center' });
    doc.text('AGROPECUARIO No. 134', W / 2, 17, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('FICHA DE PRE-REGISTRO DE NUEVO INGRESO', W / 2, 23, { align: 'center' });

    const anio = new Date().getFullYear();
    doc.setFontSize(8.5);
    doc.text(`Ciclo Escolar ${anio}\u2013${anio + 1}`, W / 2, 29, { align: 'center' });

    // ── FOLIO Y FECHA ─────────────────────────────────────
    let y = 38;
    doc.setFillColor(...colorGris);
    doc.roundedRect(margin, y, W - margin * 2, 12, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...colorVerde);
    doc.text(`FOLIO: ${data.folio}`, margin + 5, y + 7.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...colorGrisMedio);
    const fechaActual = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.text(`Fecha de emisión: ${fechaActual}`, W - margin - 5, y + 7.5, { align: 'right' });

    y += 18;

    // ── RECUADRO PARA FOTO ────────────────────────────────
    // Ubicado a la derecha de la primera sección
    const photoW = 30;
    const photoH = 35;
    const photoX = W - margin - photoW;
    const photoY = y + 2;

    doc.setDrawColor(...colorGrisMedio);
    doc.setLineWidth(0.3);
    doc.rect(photoX, photoY, photoW, photoH, 'S');
    doc.setFontSize(8);
    doc.setTextColor(...colorGrisMedio);
    doc.text('FOTO AQUÍ', photoX + photoW / 2, photoY + photoH / 2, { align: 'center' });

    // ── SECCIÓN HELPER ────────────────────────────────────
    const seccionHeader = (titulo, yPos, customWidth) => {
        const width = customWidth || (W - margin * 2);
        doc.setFillColor(...colorVerde);
        doc.rect(margin, yPos, width, 7, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text(titulo, margin + 3, yPos + 5);
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
                fontSize: 8,
                cellPadding: { top: 1.5, bottom: 1.5, left: 3, right: 3 },
                textColor: colorTexto,
            },
            columnStyles: {
                0: { fontStyle: 'bold', fillColor: [230, 245, 235], cellWidth: width * 0.35 },
                1: { cellWidth: 'auto' },
            },
            alternateRowStyles: { fillColor: [250, 252, 250] },
        });
        return doc.lastAutoTable.finalY + 4;
    };

    // ── SEC 1: DATOS PERSONALES ───────────────────────────
    // Esta sección es más estrecha para dejar espacio a la foto
    const sec1Width = (W - margin * 2) - photoW - 5;
    y = seccionHeader('1. DATOS DEL ASPIRANTE', y, sec1Width);

    // Ajustamos los datos para que quepan en el ancho reducido
    y = tablaCeldas([
        ['Nombre Completo', `${data.nombre} ${data.apellido_paterno} ${data.apellido_materno}`],
        ['CURP', data.curp],
        ['Sexo', data.sexo],
        ['Fecha Nac.', data.fecha_nacimiento],
        ['Teléfono', data.telefono],
        ['Correo', data.correo],
    ], y, sec1Width);

    // Si la tabla terminó antes que la foto, bajamos y para que lo siguiente no choque
    if (y < photoY + photoH + 5) {
        y = photoY + photoH + 5;
    }

    // El resto de los datos personales que no cabían al lado de la foto
    y = tablaCeldas([
        ['Estado Civil', data.estado_civil],
        ['Lugar Nacimiento', data.lugar_nacimiento],
        ['Domicilio', `${data.domicilio}, Col. ${data.colonia}, ${data.municipio}, C.P. ${data.codigo_postal}`],
    ], y);

    // ── SEC 2: CARRERA(S) ──────────────────────────────────
    y = seccionHeader('2. CARRERAS TÉCNICAS SELECCIONADAS', y);
    const carreraRows = [['1ª Opción', data.carrera_nombre]];
    if (data.segunda_opcion_carrera) carreraRows.push(['2ª Opción', data.segunda_opcion_carrera]);
    if (data.tercera_opcion_carrera) carreraRows.push(['3ª Opción', data.tercera_opcion_carrera]);
    y = tablaCeldas(carreraRows, y);

    // ── SEC 3: ESCUELA ────────────────────────────────────
    y = seccionHeader('3. ESCUELA DE PROCEDENCIA', y);
    y = tablaCeldas([
        ['Tipo de Escuela', data.escuela_tipo],
        ['Nombre', data.escuela_nombre],
        ['Municipio', data.escuela_municipio],
        ['Promedio General', `${data.promedio_general} / 10`],
    ], y);

    // ── SEC 4: TUTOR ──────────────────────────────────────
    y = seccionHeader('4. DATOS DEL PADRE / MADRE / TUTOR', y);
    y = tablaCeldas([
        ['Parentesco', data.tutor_parentesco],
        ['Nombre Completo', data.tutor_nombre],
        ['CURP', data.tutor_curp],
        ['Ocupación', data.tutor_ocupacion],
        ['Último Grado de Estudio', data.tutor_grado_estudios],
        ['Teléfono', data.tutor_telefono],
    ], y);

    // ── PIE DE PÁGINA ─────────────────────────────────────
    const pH = doc.internal.pageSize.getHeight();
    doc.setFillColor(...colorVerde);
    doc.rect(0, pH - 12, W, 12, 'F');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    doc.text(
        'CBTa 134 \u00B7 Documento de Pre-Registro \u00B7 No tiene validez sin sello institucional',
        W / 2, pH - 6.5,
        { align: 'center' }
    );
    doc.text(`Folio: ${data.folio}`, margin, pH - 3);
    doc.text(`${new Date().toLocaleDateString('es-MX')}`, W - margin, pH - 3, { align: 'right' });

    return doc.output('blob');
}
