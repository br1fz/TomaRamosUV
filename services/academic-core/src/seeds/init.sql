-- SEED SQL: UNIVERSIDAD DE VALPARAÍSO - TOMA DE RAMOS MALLA 5125
-- INGENIERÍA CIVIL INFORMÁTICA (5.° SEMESTRE UV)

-- 1. Tabla de Estudiantes
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    rut VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    career_code VARCHAR(20) NOT NULL,
    career_name VARCHAR(150) NOT NULL,
    curriculum_plan VARCHAR(50) NOT NULL,
    semester INT NOT NULL,
    academic_status VARCHAR(50) NOT NULL DEFAULT 'REGULAR ACTIVO',
    priority_group VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Asignaturas
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    code VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    credits INT NOT NULL,
    semester INT NOT NULL,
    prerequisites TEXT[] NOT NULL DEFAULT '{}',
    color_hex VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Secciones y Vacantes
CREATE TABLE IF NOT EXISTS sections (
    id SERIAL PRIMARY KEY,
    subject_code VARCHAR(15) REFERENCES subjects(code) ON DELETE CASCADE,
    section_number INT NOT NULL,
    professor VARCHAR(150) NOT NULL,
    total_quota INT NOT NULL,
    available_quota INT NOT NULL,
    is_full BOOLEAN GENERATED ALWAYS AS (available_quota <= 0) STORED,
    UNIQUE (subject_code, section_number)
);

-- 4. Tabla de Horarios por Sección
CREATE TABLE IF NOT EXISTS section_schedules (
    id SERIAL PRIMARY KEY,
    section_id INT REFERENCES sections(id) ON DELETE CASCADE,
    day VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    block_index INT NOT NULL,
    room VARCHAR(50) NOT NULL
);

-- 5. Tabla de Inscripciones Confirmadas (Transaccional Atómica)
CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    student_rut VARCHAR(15) REFERENCES students(rut) ON DELETE CASCADE,
    section_id INT REFERENCES sections(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verification_code VARCHAR(100) NOT NULL,
    UNIQUE (student_rut, section_id)
);

-- 6. Tabla de Listas de Espera
CREATE TABLE IF NOT EXISTS waitlists (
    id SERIAL PRIMARY KEY,
    student_rut VARCHAR(15) REFERENCES students(rut) ON DELETE CASCADE,
    subject_code VARCHAR(15) REFERENCES subjects(code) ON DELETE CASCADE,
    queue_order INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_rut, subject_code)
);

-- INSERCIÓN DE DATOS INICIALES (Malla 5125 UV)

-- Estudiante de Prueba
INSERT INTO students (rut, email, full_name, career_code, career_name, curriculum_plan, semester, priority_group)
VALUES (
    '20.123.456-7',
    'estudiante.prueba@estudiantes.uv.cl',
    'Estudiante de Prueba UV',
    '19085',
    'Ingeniería Civil Informática',
    'Malla 5125 / Plan Común UV',
    5,
    'Grupo 1 (Prioridad Académica Alta)'
) ON CONFLICT (rut) DO NOTHING;

-- Asignaturas 5.° Semestre ICI UV
INSERT INTO subjects (code, name, credits, semester, prerequisites, color_hex) VALUES
('CIN 311', 'Estructuras de Datos', 5, 5, ARRAY['CIN 211'], '#0284c7'),
('CIN 312', 'Arquitectura de Computadores', 4, 5, ARRAY['CIN 212'], '#7c3aed'),
('CIN 313', 'Modelos de Base de Datos', 4, 5, ARRAY['CIN 211'], '#d97706'),
('CIN 314', 'Fundamentos de Ingeniería de Software', 4, 5, ARRAY['PRO 121'], '#059669'),
('FIS 311', 'Física Electromagnetismo', 5, 5, ARRAY['FIS 211', 'MAT 211'], '#0891b2')
ON CONFLICT (code) DO NOTHING;

-- Secciones y Cupos Iniciales
-- CIN 311: Sec 1 (4/40 cupos), Sec 2 (15/40 cupos)
INSERT INTO sections (subject_code, section_number, professor, total_quota, available_quota) VALUES
('CIN 311', 1, 'Prof. Álvaro Morales', 40, 4),
('CIN 311', 2, 'Prof. Gonzalo Rivera', 40, 15),
-- CIN 312: Sec 1 (12/35 cupos)
('CIN 312', 1, 'Prof. Roberto Silva', 35, 12),
-- CIN 313: Sec 1 (0/40 cupos - AGOTADO)
('CIN 313', 1, 'Prof. Claudia Castro', 40, 0),
-- CIN 314: Sec 1 (18/35 cupos)
('CIN 314', 1, 'Prof. Patricia Valdés', 35, 18),
-- FIS 311: Sec 1 (10/30 cupos - TOPE CON CIN 311 SEC 1), Sec 2 (8/35 cupos)
('FIS 311', 1, 'Prof. Manuel Herrera', 30, 10),
('FIS 311', 2, 'Prof. Karla Contreras', 35, 8)
ON CONFLICT (subject_code, section_number) DO NOTHING;

-- Horarios por Sección
-- CIN 311 Sec 1: Lun 08:30-10:00 (Bloque 0), Mié 08:30-10:00 (Bloque 0)
INSERT INTO section_schedules (section_id, day, start_time, end_time, block_index, room)
SELECT id, 'Lunes', '08:30', '10:00', 0, 'LAB-INFO 201' FROM sections WHERE subject_code = 'CIN 311' AND section_number = 1;

INSERT INTO section_schedules (section_id, day, start_time, end_time, block_index, room)
SELECT id, 'Miércoles', '08:30', '10:00', 0, 'LAB-INFO 201' FROM sections WHERE subject_code = 'CIN 311' AND section_number = 1;

-- CIN 311 Sec 2: Mar 10:15-11:45 (Bloque 1), Jue 10:15-11:45 (Bloque 1)
INSERT INTO section_schedules (section_id, day, start_time, end_time, block_index, room)
SELECT id, 'Martes', '10:15', '11:45', 1, 'SALA B-12' FROM sections WHERE subject_code = 'CIN 311' AND section_number = 2;

INSERT INTO section_schedules (section_id, day, start_time, end_time, block_index, room)
SELECT id, 'Jueves', '10:15', '11:45', 1, 'SALA B-12' FROM sections WHERE subject_code = 'CIN 311' AND section_number = 2;

-- CIN 312 Sec 1: Lun 10:15-11:45 (Bloque 1), Mié 10:15-11:45 (Bloque 1)
INSERT INTO section_schedules (section_id, day, start_time, end_time, block_index, room)
SELECT id, 'Lunes', '10:15', '11:45', 1, 'SALA C-04' FROM sections WHERE subject_code = 'CIN 312' AND section_number = 1;

INSERT INTO section_schedules (section_id, day, start_time, end_time, block_index, room)
SELECT id, 'Miércoles', '10:15', '11:45', 1, 'SALA C-04' FROM sections WHERE subject_code = 'CIN 312' AND section_number = 1;

-- CIN 313 Sec 1: Mar 08:30-10:00 (Bloque 0), Jue 08:30-10:00 (Bloque 0)
INSERT INTO section_schedules (section_id, day, start_time, end_time, block_index, room)
SELECT id, 'Martes', '08:30', '10:00', 0, 'LAB-BD 103' FROM sections WHERE subject_code = 'CIN 313' AND section_number = 1;

INSERT INTO section_schedules (section_id, day, start_time, end_time, block_index, room)
SELECT id, 'Jueves', '08:30', '10:00', 0, 'LAB-BD 103' FROM sections WHERE subject_code = 'CIN 313' AND section_number = 1;

-- CIN 314 Sec 1: Vie 08:30-10:00 (Bloque 0), Vie 10:15-11:45 (Bloque 1)
INSERT INTO section_schedules (section_id, day, start_time, end_time, block_index, room)
SELECT id, 'Viernes', '08:30', '10:00', 0, 'AUD-ING 1' FROM sections WHERE subject_code = 'CIN 314' AND section_number = 1;

INSERT INTO section_schedules (section_id, day, start_time, end_time, block_index, room)
SELECT id, 'Viernes', '10:15', '11:45', 1, 'AUD-ING 1' FROM sections WHERE subject_code = 'CIN 314' AND section_number = 1;

-- FIS 311 Sec 1: Lun 08:30-10:00 (Bloque 0) -> TOPE DIRECTO CON CIN 311 Sec 1
INSERT INTO section_schedules (section_id, day, start_time, end_time, block_index, room)
SELECT id, 'Lunes', '08:30', '10:00', 0, 'SALA F-02' FROM sections WHERE subject_code = 'FIS 311' AND section_number = 1;

-- FIS 311 Sec 2: Mar 14:00-15:30 (Bloque 3), Mar 15:45-17:15 (Bloque 4)
INSERT INTO section_schedules (section_id, day, start_time, end_time, block_index, room)
SELECT id, 'Martes', '14:00', '15:30', 3, 'LAB-FIS 2' FROM sections WHERE subject_code = 'FIS 311' AND section_number = 2;

INSERT INTO section_schedules (section_id, day, start_time, end_time, block_index, room)
SELECT id, 'Martes', '15:45', '17:15', 4, 'LAB-FIS 2' FROM sections WHERE subject_code = 'FIS 311' AND section_number = 2;
