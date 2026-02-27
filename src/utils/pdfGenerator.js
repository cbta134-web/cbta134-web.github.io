import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Genera la Ficha de Pre-Registro en PDF (una sola página completa).
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

    // ── ENCABEZADO ────────────────────────────────────────
    // Borde superior verde (empezando desde 0 ahora)
    doc.setFillColor(...colorVerde);
    doc.rect(0, 0, W, 32, 'F');

    // Logo placeholder (cuadro blanco en esquina)
    doc.setFillColor(BN[0], BN[1], BN[2]); // blanco
    const BN = [255, 255, 255];
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

    // Ciclo escolar
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
    doc.text(`FOLIO: ${data.folio}`, margin + 5, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...colorGrisMedio);
    doc.text(
        `Fecha: ${new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}`,
        W - margin - 5, y + 5,
        { align: 'right' }
    );
    y += 16;

    // ── SECCIÓN HELPER ────────────────────────────────────
    const seccionHeader = (titulo, yPos) => {
        doc.setFillColor(...colorVerde);
        doc.rect(margin, yPos, W - margin * 2, 7, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text(titulo, margin + 3, yPos + 5);
        return yPos + 8;
    };

    const tablaCeldas = (body, yPos) => {
        autoTable(doc, {
            body,
            startY: yPos,
            margin: { left: margin, right: margin },
            theme: 'grid',
            styles: {
                fontSize: 8,
                cellPadding: { top: 1.2, bottom: 1.2, left: 3, right: 3 },
                textColor: colorTexto,
            },
            columnStyles: {
                0: { fontStyle: 'bold', fillColor: [230, 245, 235], cellWidth: 50 },
                1: { cellWidth: 'auto' },
            },
            alternateRowStyles: { fillColor: [250, 252, 250] },
        });
        return doc.lastAutoTable.finalY + 3;
    };

    // ── SEC 1: DATOS PERSONALES ───────────────────────────
    y = seccionHeader('1. DATOS DEL ASPIRANTE', y);
    y = tablaCeldas([
        ['Nombre Completo', `${data.nombre} ${data.apellido_paterno} ${data.apellido_materno}`],
        ['CURP', data.curp],
        ['Sexo', data.sexo],
        ['Fecha de Nacimiento', data.fecha_nacimiento],
        ['Correo Electrónico', data.correo],
        ['Estado Civil', data.estado_civil],
        ['Teléfono', data.telefono],
        ['Lugar de Nacimiento', data.lugar_nacimiento],
        ['Domicilio', data.domicilio],
        ['Colonia', data.colonia],
        ['Municipio', data.municipio],
        ['Código Postal', data.codigo_postal],
    ], y);

    // ── SEC 2: CARRERA(S) ──────────────────────────────────
    y = seccionHeader('2. CARRERAS TÉCNICAS SELECCIONADAS', y);
    const carreraRows = [
        ['1ª Opción de Carrera', data.carrera_nombre],
    ];
    if (data.segunda_opcion_carrera) {
        carreraRows.push(['2ª Opción de Carrera', data.segunda_opcion_carrera]);
    }
    if (data.tercera_opcion_carrera) {
        carreraRows.push(['3ª Opción de Carrera', data.tercera_opcion_carrera]);
    }
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

    // ── FIRMAS ────────────────────────────────────────────
    y += 4;
    const sigW = (W - margin * 2 - 10) / 2;

    // Aspirante
    doc.setDrawColor(...colorGrisMedio);
    doc.line(margin, y + 10, margin + sigW, y + 10);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colorGrisMedio);
    doc.text('Firma del Aspirante', margin + sigW / 2, y + 14, { align: 'center' });
    doc.text(`${data.nombre} ${data.apellido_paterno}`, margin + sigW / 2, y + 18, { align: 'center' });

    // Tutor
    const sig2X = margin + sigW + 10;
    doc.line(sig2X, y + 10, sig2X + sigW, y + 10);
    doc.text('Firma del Padre / Tutor', sig2X + sigW / 2, y + 14, { align: 'center' });
    doc.text(data.tutor_nombre, sig2X + sigW / 2, y + 18, { align: 'center' });

    // ── PIE DE PÁGINA ─────────────────────────────────────
    const pH = doc.internal.pageSize.getHeight();
    doc.setFillColor(...colorVerde);
    doc.rect(0, pH - 12, W, 12, 'F');

    // Info institucional
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
