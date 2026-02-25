-- ===========================================
-- INSERTAR CARRERAS TÉCNICAS EN LA BASE DE DATOS
-- Ejecuta este script en el SQL Editor de Supabase
-- ===========================================

-- Limpiar carreras existentes (opcional - comenta si no quieres borrar)
-- DELETE FROM carreras_tecnicas;

-- 1. TÉCNICO EN CONTABILIDAD
INSERT INTO carreras_tecnicas (
  nombre,
  descripcion,
  imagen_url,
  programa_competencia,
  justificacion,
  perfil_egreso,
  area_especializacion,
  habilidades_socioemocionales,
  oportunidades_profesionales
) VALUES (
  'Técnico en Contabilidad',
  'Formación integral en manejo, registro, control y análisis de información financiera y contable.',
  '/assets/carreras/conta.jpg',
  'El programa de competencias del Técnico en Contabilidad está orientado a la formación integral del estudiante en el manejo, registro, control y análisis de la información financiera y contable de personas físicas y morales. El alumno desarrolla competencias para registrar operaciones contables, elaborar estados financieros básicos, calcular contribuciones fiscales, manejar nóminas y apoyar en procesos administrativos conforme a la normatividad vigente. Se enfatiza el uso de herramientas digitales contables, hojas de cálculo y software administrativo, así como el apego a principios éticos y legales.',
  'La contabilidad es un área estratégica para cualquier organización, ya que permite la correcta toma de decisiones financieras, el cumplimiento fiscal y la transparencia económica. Este programa responde a la necesidad del sector productivo de contar con técnicos capacitados que apoyen la gestión financiera, administrativa y fiscal de empresas, despachos contables y dependencias públicas, contribuyendo al desarrollo económico regional y nacional.',
  'El egresado será capaz de: Registrar operaciones contables de acuerdo con normas vigentes. Elaborar estados financieros básicos. Calcular impuestos y contribuciones. Apoyar procesos de auditoría interna. Manejar documentación fiscal y administrativa. Utilizar software contable y herramientas digitales. Actuar con ética, responsabilidad y confidencialidad profesional.',
  'Contabilidad financiera, contabilidad fiscal, administración básica, nómina y costos, uso de software contable y control administrativo.',
  'Pensamiento analítico y crítico, Organización y atención al detalle, Responsabilidad y honestidad, Trabajo colaborativo, Comunicación efectiva, Manejo del tiempo y presión laboral.',
  'Auxiliar contable, Asistente administrativo, Auxiliar fiscal, Capturista contable, Despachos contables, Empresas privadas y públicas, Emprendimiento propio.'
);

-- 2. TÉCNICO EN OFIMÁTICA
INSERT INTO carreras_tecnicas (
  nombre,
  descripcion,
  imagen_url,
  programa_competencia,
  justificacion,
  perfil_egreso,
  area_especializacion,
  habilidades_socioemocionales,
  oportunidades_profesionales
) VALUES (
  'Técnico en Ofimática',
  'Desarrollo de habilidades para el uso eficiente de herramientas digitales de oficina.',
  '/assets/carreras/ofam.jpg',
  'El programa de competencias en Ofimática desarrolla habilidades para el uso eficiente de herramientas digitales de oficina. El estudiante adquiere competencias en procesamiento de textos, hojas de cálculo, presentaciones electrónicas, bases de datos básicas, gestión de información digital y comunicación electrónica, aplicando normas de calidad, seguridad informática y productividad laboral.',
  'La digitalización de procesos administrativos y educativos ha generado una alta demanda de personal capacitado en tecnologías de oficina. Este programa forma técnicos que incrementan la eficiencia organizacional, optimizan procesos administrativos y fortalecen la competitividad de las instituciones y empresas.',
  'El egresado será capaz de: Elaborar documentos profesionales. Gestionar información digital. Diseñar presentaciones ejecutivas. Manejar hojas de cálculo para análisis de datos. Administrar archivos electrónicos. Utilizar plataformas colaborativas y correo electrónico.',
  'Herramientas ofimáticas, gestión digital de información, soporte administrativo tecnológico.',
  'Comunicación efectiva, Adaptabilidad tecnológica, Organización, Trabajo en equipo, Responsabilidad digital, Pensamiento lógico.',
  'Asistente administrativo digital, Auxiliar de oficina, Capturista, Soporte administrativo, Empresas, escuelas y dependencias públicas, Trabajo remoto.'
);

-- 3. TÉCNICO EN PROGRAMACIÓN
INSERT INTO carreras_tecnicas (
  nombre,
  descripcion,
  imagen_url,
  programa_competencia,
  justificacion,
  perfil_egreso,
  area_especializacion,
  habilidades_socioemocionales,
  oportunidades_profesionales
) VALUES (
  'Técnico en Programación',
  'Formación de técnicos capaces de diseñar, desarrollar, probar y mantener aplicaciones informáticas.',
  '/images/programacion.jpg',
  'El programa de competencias en Programación forma técnicos capaces de diseñar, desarrollar, probar y mantener aplicaciones informáticas. Se desarrollan competencias en lógica de programación, lenguajes estructurados y orientados a objetos, bases de datos, desarrollo web y documentación técnica, aplicando estándares de calidad y buenas prácticas de desarrollo de software.',
  'La industria tecnológica requiere profesionales con habilidades prácticas en desarrollo de software. Este programa responde a la creciente demanda de programadores capaces de crear soluciones digitales para distintos sectores productivos, impulsando la innovación y la transformación digital.',
  'El egresado será capaz de: Analizar problemas y proponer soluciones computacionales. Desarrollar aplicaciones de software. Diseñar bases de datos. Programar aplicaciones web. Documentar sistemas. Aplicar metodologías de desarrollo.',
  'Desarrollo de software, programación web, bases de datos, lógica computacional.',
  'Pensamiento lógico, Resolución de problemas, Creatividad, Trabajo colaborativo, Autogestión del aprendizaje, Disciplina técnica.',
  'Programador junior, Desarrollador web, Soporte técnico de software, Freelance, Startups tecnológicas, Continuación de estudios universitarios.'
);

-- 4. TÉCNICO AGROPECUARIO
INSERT INTO carreras_tecnicas (
  nombre,
  descripcion,
  imagen_url,
  programa_competencia,
  justificacion,
  perfil_egreso,
  area_especializacion,
  habilidades_socioemocionales,
  oportunidades_profesionales
) VALUES (
  'Técnico Agropecuario',
  'Formación de técnicos capaces de participar en procesos agrícolas y pecuarios con enfoque sustentable.',
  '/assets/carreras/agrope.jpg',
  'El programa de competencias agropecuarias forma técnicos capaces de participar en procesos agrícolas y pecuarios, aplicando técnicas de producción sustentable, manejo de recursos naturales, sanidad, reproducción y administración básica de unidades productivas rurales.',
  'El sector agropecuario es fundamental para la seguridad alimentaria y el desarrollo rural. Este programa responde a la necesidad de técnicos capacitados que impulsen la producción sustentable y la modernización del campo mexicano.',
  'El egresado será capaz de: Manejar cultivos y especies pecuarias. Aplicar técnicas de producción sustentable. Participar en proyectos productivos. Manejar herramientas e insumos agropecuarios. Cumplir normas de sanidad y bioseguridad.',
  'Producción agrícola, producción pecuaria, manejo sustentable, administración rural.',
  'Trabajo en campo, Responsabilidad ambiental, Trabajo en equipo, Resiliencia, Planeación, Compromiso social.',
  'Técnico agropecuario, Productor rural, Asistente en granjas, Proyectos productivos, Cooperativas, Emprendimiento rural.'
);

-- 5. TÉCNICO EN SISTEMAS DE PRODUCCIÓN PECUARIA
INSERT INTO carreras_tecnicas (
  nombre,
  descripcion,
  imagen_url,
  programa_competencia,
  justificacion,
  perfil_egreso,
  area_especializacion,
  habilidades_socioemocionales,
  oportunidades_profesionales
) VALUES (
  'Técnico en Sistemas de Producción Pecuaria',
  'Desarrollo de competencias para manejar especies pecuarias bajo distintos sistemas de producción.',
  '/assets/carreras/pecuarios.jpg',
  'Este programa desarrolla competencias para manejar especies pecuarias bajo distintos sistemas de producción. El estudiante adquiere habilidades en alimentación, sanidad, reproducción, manejo zootécnico y diseño de proyectos pecuarios con enfoque productivo y sustentable.',
  'La producción pecuaria es clave para la economía y el abastecimiento alimentario. Se requieren técnicos especializados que optimicen la producción, garanticen el bienestar animal y mejoren la rentabilidad del sector.',
  'El egresado será capaz de: Manejar especies pecuarias. Aplicar programas de alimentación. Participar en prevención sanitaria. Apoyar procesos reproductivos. Diseñar proyectos productivos pecuarios.',
  'Zootecnia, producción animal, sanidad, reproducción, proyectos pecuarios.',
  'Liderazgo en campo, Responsabilidad ética, Trabajo colaborativo, Toma de decisiones, Planeación productiva.',
  'Técnico pecuario, Encargado de granja, Asistente veterinario, Productor independiente, Empresas agropecuarias.'
);

-- ===========================================
-- ¡LISTO! Las 5 carreras técnicas han sido agregadas
-- Puedes editarlas desde tu panel de administración
-- ===========================================
