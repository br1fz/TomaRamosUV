-- ==============================================================================
-- UNIVERSIDAD DE VALPARAÍSO - SISTEMA DE TOMA DE RAMOS (ACADEMIC CORE)
-- ESQUEMA RELACIONAL (DDL), REGLAS DE NEGOCIO Y SEEDS INICIALES
-- Compatible con PostgreSQL 16 (Supabase / Neon) y adaptable a SQLite
-- ==============================================================================

-- Limpieza preventiva en caso de reinstalación completa
DROP TABLE IF EXISTS inscripciones CASCADE;
DROP TABLE IF EXISTS horarios_seccion CASCADE;
DROP TABLE IF EXISTS secciones CASCADE;
DROP TABLE IF EXISTS periodos_academicos CASCADE;
DROP TABLE IF EXISTS prerrequisitos CASCADE;
DROP TABLE IF EXISTS malla_ramos CASCADE;
DROP TABLE IF EXISTS ramos CASCADE;
DROP TABLE IF EXISTS profesores CASCADE;
DROP TABLE IF EXISTS alumnos CASCADE;
DROP TABLE IF EXISTS mallas CASCADE;
DROP TABLE IF EXISTS carreras CASCADE;

-- ------------------------------------------------------------------------------
-- 1. CARRERAS Y MALLAS
-- ------------------------------------------------------------------------------
CREATE TABLE carreras (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,      -- Ej: '19085'
    nombre VARCHAR(150) NOT NULL,            -- Ej: 'Ingeniería Civil Informática'
    sede VARCHAR(100) DEFAULT 'Casa Central - Valparaíso'
);

CREATE TABLE mallas (
    id SERIAL PRIMARY KEY,
    carrera_id INT REFERENCES carreras(id) ON DELETE CASCADE,
    codigo_plan VARCHAR(50) NOT NULL,        -- Ej: 'Malla 5125 (Innovada SCT)'
    anio_inicio INT NOT NULL,                -- Año en que entró en vigencia
    anio_fin INT                             -- NULL si sigue activa
);

-- ------------------------------------------------------------------------------
-- 2. ALUMNOS Y PROFESORES
-- ------------------------------------------------------------------------------
CREATE TABLE alumnos (
    id SERIAL PRIMARY KEY,
    rut VARCHAR(12) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,      -- Ej: 'prueba1@estudiantes.uv.cl'
    password_hash VARCHAR(255) NOT NULL,     -- Hash bcrypt
    malla_id INT REFERENCES mallas(id),
    anio_ingreso INT NOT NULL,               -- Determina su avance
    estado VARCHAR(30) DEFAULT 'ALUMNO REGULAR'
);

CREATE TABLE profesores (
    id SERIAL PRIMARY KEY,
    rut VARCHAR(12) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL
);

-- ------------------------------------------------------------------------------
-- 3. CATÁLOGO DE ASIGNATURAS Y MALLA CURRICULAR
-- ------------------------------------------------------------------------------
CREATE TABLE ramos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,      -- Ej: 'INF-110'
    nombre VARCHAR(150) NOT NULL,
    creditos_sct INT NOT NULL DEFAULT 4
);

CREATE TABLE malla_ramos (
    id SERIAL PRIMARY KEY,
    malla_id INT REFERENCES mallas(id) ON DELETE CASCADE,
    ramo_id INT REFERENCES ramos(id) ON DELETE CASCADE,
    semestre_malla INT NOT NULL,             -- Semestre sugerido (1 al 10)
    UNIQUE(malla_id, ramo_id)
);

-- Prerrequisitos autorreferenciales entre ramos de la malla
CREATE TABLE prerrequisitos (
    malla_ramo_id INT REFERENCES malla_ramos(id) ON DELETE CASCADE,
    ramo_prerrequisito_id INT REFERENCES ramos(id) ON DELETE CASCADE,
    PRIMARY KEY (malla_ramo_id, ramo_prerrequisito_id)
);

-- ------------------------------------------------------------------------------
-- 4. PERIODOS ACADÉMICOS, SECCIONES Y HORARIOS
-- ------------------------------------------------------------------------------
CREATE TABLE periodos_academicos (
    id SERIAL PRIMARY KEY,
    anio INT NOT NULL,                       -- 2026
    semestre INT NOT NULL,                   -- 1 o 2
    activo BOOLEAN DEFAULT FALSE,
    UNIQUE(anio, semestre)
);

CREATE TABLE secciones (
    id SERIAL PRIMARY KEY,
    periodo_id INT REFERENCES periodos_academicos(id) ON DELETE CASCADE,
    ramo_id INT REFERENCES ramos(id) ON DELETE CASCADE,
    numero_seccion INT NOT NULL,             -- Sección 1, 2, etc.
    profesor_id INT REFERENCES profesores(id),
    cupos_totales INT NOT NULL DEFAULT 35,
    cupos_disponibles INT NOT NULL DEFAULT 35,
    UNIQUE(periodo_id, ramo_id, numero_seccion)
);

CREATE TABLE horarios_seccion (
    id SERIAL PRIMARY KEY,
    seccion_id INT REFERENCES secciones(id) ON DELETE CASCADE,
    dia_semana INT NOT NULL,                 -- 1 = Lunes, 2 = Martes, ..., 5 = Viernes
    bloque_inicio TIME NOT NULL,             -- Ej: '08:30:00'
    bloque_fin TIME NOT NULL,                -- Ej: '10:00:00'
    sala VARCHAR(50) DEFAULT 'Lab Informática'
);

-- ------------------------------------------------------------------------------
-- 5. INSCRIPCIONES Y RENDIMIENTO HISTÓRICO
-- ------------------------------------------------------------------------------
CREATE TABLE inscripciones (
    id SERIAL PRIMARY KEY,
    alumno_id INT REFERENCES alumnos(id) ON DELETE CASCADE,
    periodo_id INT REFERENCES periodos_academicos(id) ON DELETE CASCADE,
    ramo_id INT REFERENCES ramos(id) ON DELETE CASCADE,       -- Desnormalizado para constraint única
    seccion_id INT REFERENCES secciones(id) ON DELETE CASCADE,
    estado VARCHAR(20) DEFAULT 'INSCRITO',  -- 'INSCRITO', 'APROBADO', 'REPROBADO'
    nota_final NUMERIC(2,1),                -- Escala 1.0 a 7.0
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Regla de negocio 1: un alumno solo puede tomar 1 vez un ramo por semestre
    UNIQUE(alumno_id, periodo_id, ramo_id)
);

-- ------------------------------------------------------------------------------
-- 6. REGLAS DE NEGOCIO: VISTAS Y FUNCIONES AUXILIARES
-- ------------------------------------------------------------------------------

-- Regla de Negocio 2: Control de Choques de Horario
CREATE OR REPLACE VIEW v_choques_horario AS
SELECT 
    h1.seccion_id AS seccion_1_id,
    h2.seccion_id AS seccion_2_id,
    h1.dia_semana,
    h1.bloque_inicio AS s1_inicio,
    h1.bloque_fin AS s1_fin,
    h2.bloque_inicio AS s2_inicio,
    h2.bloque_fin AS s2_fin
FROM horarios_seccion h1
JOIN horarios_seccion h2 ON h1.dia_semana = h2.dia_semana 
    AND h1.seccion_id < h2.seccion_id
    AND h1.bloque_inicio < h2.bloque_fin 
    AND h1.bloque_fin > h2.bloque_inicio;

-- Regla de Negocio 3: Función de Validación de Prerrequisitos UV
CREATE OR REPLACE FUNCTION fn_verificar_prerrequisitos_pendientes(
    p_alumno_id INT,
    p_ramo_a_inscribir_id INT
)
RETURNS TABLE (
    ramo_prerrequisito_id INT,
    codigo VARCHAR,
    nombre VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.ramo_prerrequisito_id, r.codigo, r.nombre
    FROM prerrequisitos p
    JOIN malla_ramos mr ON p.malla_ramo_id = mr.id
    JOIN ramos r ON p.ramo_prerrequisito_id = r.id
    WHERE mr.malla_id = (SELECT malla_id FROM alumnos WHERE id = p_alumno_id)
      AND mr.ramo_id = p_ramo_a_inscribir_id
      AND p.ramo_prerrequisito_id NOT IN (
          SELECT ins.ramo_id
          FROM inscripciones ins
          WHERE ins.alumno_id = p_alumno_id
            AND ins.estado IN ('APROBADO', 'REPROBADO')
            AND (ins.nota_final >= 4.0 OR ins.nota_final = 3.9)
      );
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 7. DATOS INICIALES (SEEDS) PARA TESTING
-- ------------------------------------------------------------------------------

-- Período Activo
INSERT INTO periodos_academicos (id, anio, semestre, activo) 
VALUES (1, 2026, 1, TRUE)
ON CONFLICT (anio, semestre) DO UPDATE SET activo = TRUE;

-- Carrera y Malla
INSERT INTO carreras (id, codigo, nombre) 
VALUES (1, '19085', 'Ingeniería Civil Informática')
ON CONFLICT (id) DO NOTHING;

INSERT INTO mallas (id, carrera_id, codigo_plan, anio_inicio) 
VALUES (1, 1, 'Malla 5125 (Innovada SCT)', 2020)
ON CONFLICT (id) DO NOTHING;

-- Profesores
INSERT INTO profesores (id, rut, nombre, email) VALUES
(1, '11.222.333-4', 'Felipe Moncada', 'felipe.moncada@uv.cl'),
(2, '12.333.444-5', 'Nicolás Cáceres', 'nicolas.caceres@uv.cl'),
(3, '13.444.555-6', 'Bastián Rivas', 'bastian.rivas@uv.cl')
ON CONFLICT (id) DO NOTHING;

-- Ramos base
INSERT INTO ramos (id, codigo, nombre, creditos_sct) VALUES
(1, 'INF-110', 'Introducción a la Programación', 5),
(2, 'MAT-010', 'Cálculo Diferencial', 6),
(3, 'INF-210', 'Estructuras de Datos', 5),
(4, 'INF-220', 'Bases de Datos', 5),
(5, 'INF-310', 'Sistemas Operativos', 5)
ON CONFLICT (id) DO NOTHING;

-- Configuración de Malla (Semestres 1, 2 y 3)
INSERT INTO malla_ramos (id, malla_id, ramo_id, semestre_malla) VALUES
(1, 1, 1, 1), -- Intro Prog (Semestre 1)
(2, 1, 2, 1), -- Cálculo (Semestre 1)
(3, 1, 3, 2), -- Estructuras de Datos (Semestre 2)
(4, 1, 4, 2), -- Bases de Datos (Semestre 2)
(5, 1, 5, 3)  -- Sistemas Operativos (Semestre 3)
ON CONFLICT (id) DO NOTHING;

-- Prerrequisitos:
INSERT INTO prerrequisitos (malla_ramo_id, ramo_prerrequisito_id) VALUES (3, 1)
ON CONFLICT (malla_ramo_id, ramo_prerrequisito_id) DO NOTHING;

INSERT INTO prerrequisitos (malla_ramo_id, ramo_prerrequisito_id) VALUES (5, 3)
ON CONFLICT (malla_ramo_id, ramo_prerrequisito_id) DO NOTHING;

-- Secciones para 2026-1
INSERT INTO secciones (id, periodo_id, ramo_id, numero_seccion, profesor_id, cupos_totales, cupos_disponibles) VALUES
(1, 1, 3, 1, 1, 30, 25), -- Estructuras de Datos - Sec 1
(2, 1, 3, 2, 2, 30, 28), -- Estructuras de Datos - Sec 2
(3, 1, 4, 1, 3, 35, 30), -- Bases de Datos - Sec 1
(4, 1, 5, 1, 1, 25, 20)  -- Sistemas Operativos - Sec 1
ON CONFLICT (id) DO NOTHING;

-- Horarios (Lunes y Miércoles en bloques estándar)
INSERT INTO horarios_seccion (id, seccion_id, dia_semana, bloque_inicio, bloque_fin, sala) VALUES
(1, 1, 1, '08:30:00', '10:00:00', 'Lab 1'),     -- Sec 1 ED: Lun 08:30-10:00
(2, 1, 3, '08:30:00', '10:00:00', 'Lab 1'),     -- Sec 1 ED: Mie 08:30-10:00
(3, 2, 1, '10:15:00', '11:45:00', 'Lab 2'),     -- Sec 2 ED: Lun 10:15-11:45
(4, 3, 2, '08:30:00', '10:00:00', 'Sala B3'),    -- Sec 1 BD: Mar 08:30-10:00
(5, 4, 4, '14:00:00', '15:30:00', 'Lab Redes')  -- Sec 1 SO: Jue 14:00-15:30
ON CONFLICT (id) DO NOTHING;

-- 12 Alumnos de Prueba (Password por defecto: 'PruebaUV.2026!')
INSERT INTO alumnos (id, rut, nombre, email, password_hash, malla_id, anio_ingreso) VALUES
(1,  '21.111.001-1', 'Estudiante Prueba 1',  'prueba1@estudiantes.uv.cl',  '$2b$10$f0htJg3hg7O74CSTs9im..iYJBAY0N/eaezBfRKPuncEUgtTB.2j.', 1, 2025),
(2,  '21.111.002-2', 'Estudiante Prueba 2',  'prueba2@estudiantes.uv.cl',  '$2b$10$f0htJg3hg7O74CSTs9im..iYJBAY0N/eaezBfRKPuncEUgtTB.2j.', 1, 2025),
(3,  '21.111.003-3', 'Estudiante Prueba 3',  'prueba3@estudiantes.uv.cl',  '$2b$10$f0htJg3hg7O74CSTs9im..iYJBAY0N/eaezBfRKPuncEUgtTB.2j.', 1, 2025),
(4,  '21.111.004-4', 'Estudiante Prueba 4',  'prueba4@estudiantes.uv.cl',  '$2b$10$f0htJg3hg7O74CSTs9im..iYJBAY0N/eaezBfRKPuncEUgtTB.2j.', 1, 2025),
(5,  '21.111.005-5', 'Estudiante Prueba 5',  'prueba5@estudiantes.uv.cl',  '$2b$10$f0htJg3hg7O74CSTs9im..iYJBAY0N/eaezBfRKPuncEUgtTB.2j.', 1, 2024),
(6,  '21.111.006-6', 'Estudiante Prueba 6',  'prueba6@estudiantes.uv.cl',  '$2b$10$f0htJg3hg7O74CSTs9im..iYJBAY0N/eaezBfRKPuncEUgtTB.2j.', 1, 2024),
(7,  '21.111.007-7', 'Estudiante Prueba 7',  'prueba7@estudiantes.uv.cl',  '$2b$10$f0htJg3hg7O74CSTs9im..iYJBAY0N/eaezBfRKPuncEUgtTB.2j.', 1, 2024),
(8,  '21.111.008-8', 'Estudiante Prueba 8',  'prueba8@estudiantes.uv.cl',  '$2b$10$f0htJg3hg7O74CSTs9im..iYJBAY0N/eaezBfRKPuncEUgtTB.2j.', 1, 2024),
(9,  '21.111.009-9', 'Estudiante Prueba 9',  'prueba9@estudiantes.uv.cl',  '$2b$10$f0htJg3hg7O74CSTs9im..iYJBAY0N/eaezBfRKPuncEUgtTB.2j.', 1, 2023),
(10, '21.111.010-0', 'Estudiante Prueba 10', 'prueba10@estudiantes.uv.cl', '$2b$10$f0htJg3hg7O74CSTs9im..iYJBAY0N/eaezBfRKPuncEUgtTB.2j.', 1, 2023),
(11, '21.111.011-1', 'Estudiante Prueba 11', 'prueba11@estudiantes.uv.cl', '$2b$10$f0htJg3hg7O74CSTs9im..iYJBAY0N/eaezBfRKPuncEUgtTB.2j.', 1, 2023),
(12, '21.111.012-2', 'Estudiante Prueba 12', 'prueba12@estudiantes.uv.cl', '$2b$10$f0htJg3hg7O74CSTs9im..iYJBAY0N/eaezBfRKPuncEUgtTB.2j.', 1, 2023)
ON CONFLICT (id) DO NOTHING;

-- Historial para probar prerrequisitos:
-- Alumno 1 aprobó Introducción a la Programación con 5.5 (Habilitado para Estructuras de Datos)
INSERT INTO inscripciones (id, alumno_id, periodo_id, ramo_id, seccion_id, estado, nota_final)
VALUES (1, 1, 1, 1, 1, 'APROBADO', 5.5)
ON CONFLICT (id) DO NOTHING;

-- Alumno 2 reprobó Introducción a la Programación con 3.9 (Habilitado por regla especial 3.9)
INSERT INTO inscripciones (id, alumno_id, periodo_id, ramo_id, seccion_id, estado, nota_final)
VALUES (2, 2, 1, 1, 1, 'REPROBADO', 3.9)
ON CONFLICT (id) DO NOTHING;

-- Alumno 3 reprobó Introducción a la Programación con 3.5 (NO habilitado para Estructuras de Datos)
INSERT INTO inscripciones (id, alumno_id, periodo_id, ramo_id, seccion_id, estado, nota_final)
VALUES (3, 3, 1, 1, 1, 'REPROBADO', 3.5)
ON CONFLICT (id) DO NOTHING;

-- Reiniciar secuencias de IDs para futuros inserts
SELECT setval('carreras_id_seq', (SELECT COALESCE(MAX(id), 1) FROM carreras));
SELECT setval('mallas_id_seq', (SELECT COALESCE(MAX(id), 1) FROM mallas));
SELECT setval('alumnos_id_seq', (SELECT COALESCE(MAX(id), 1) FROM alumnos));
SELECT setval('profesores_id_seq', (SELECT COALESCE(MAX(id), 1) FROM profesores));
SELECT setval('ramos_id_seq', (SELECT COALESCE(MAX(id), 1) FROM ramos));
SELECT setval('malla_ramos_id_seq', (SELECT COALESCE(MAX(id), 1) FROM malla_ramos));
SELECT setval('periodos_academicos_id_seq', (SELECT COALESCE(MAX(id), 1) FROM periodos_academicos));
SELECT setval('secciones_id_seq', (SELECT COALESCE(MAX(id), 1) FROM secciones));
SELECT setval('horarios_seccion_id_seq', (SELECT COALESCE(MAX(id), 1) FROM horarios_seccion));
SELECT setval('inscripciones_id_seq', (SELECT COALESCE(MAX(id), 1) FROM inscripciones));
