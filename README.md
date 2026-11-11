# 🏛️ Plataforma Unificada de Fila Virtual y Toma de Ramos UV
### Universidad de Valparaíso — Escuela de Ingeniería Civil Informática (Malla 5125)

Sistema web y móvil interactivo diseñado para optimizar la experiencia estudiantil y resolver los cuellos de botella de concurrencia durante el proceso institucional de **Toma de Ramos**. Integra una arquitectura de sala de espera virtual (*Virtual Queue / Traffic Gatekeeper*), autenticación federada institucional UV (`@estudiantes.uv.cl`), control de sesión única por estudiante, motor de validación curricular con prerrequisitos UV (incluyendo regla especial de nota 3.9), detección preventiva de topes de horario y comprobante oficial con código QR dinámico y firma criptográfica SHA-256.

---

## 📋 Instructivo de Acceso para Pruebas (Alpha Testing)

Para ingresar y realizar pruebas en la plataforma (tanto en el entorno local como en el despliegue en Vercel), sigue estos sencillos pasos:

### 1. Acceso mediante Formulario de Login (`0. Login Portal UV`)

1. Abre la aplicación en tu navegador: [http://localhost:3000](http://localhost:3000) (o el enlace de Vercel provisto).
2. En la casilla de **Correo Institucional o RUN**, ingresa cualquiera de las cuentas de prueba habilitadas:
   - Ejemplo de correo: `prueba1@estudiantes.uv.cl`
   - Ejemplo de RUN: `20.123.456-5`
3. En la casilla de **Contraseña**, ingresa la clave oficial de prueba:
   ```
   PruebaUV.2026!
   ```
4. Haz clic en **"Iniciar Sesión"**. El sistema validará el hash criptográfico `bcrypt`, firmará un token de sesión JWT y te redirigirá a la vista de bienvenida del **Portal Académico**.

---

### 2. Acceso Directo en 1 Clic (Barra de Control de Desarrollo)

Para agilizar las sesiones de prueba sin necesidad de reescribir credenciales cada vez:
- **Selector de Alumno en Barra Superior:** En la parte superior de la pantalla verás la **Barra de Control de Entorno**. En el menú desplegable puedes seleccionar directamente cualquiera de los 12 estudiantes de prueba (`prueba1` a `prueba12`). Al seleccionarlo, la sesión cambiará al instante preservando el estado curricular de dicho alumno.
- **Tarjetas Demo en Pantalla de Login:** En la vista de login encontrarás tarjetas preconfiguradas con botones de relleno automático para iniciar sesión con un solo clic.

---

### 👥 Tabla Oficial de los 12 Usuarios de Prueba

Todos los usuarios cuentan con la misma contraseña maestra (`PruebaUV.2026!`), nombres anonimizados neutrales (`Estudiante Prueba XX`), avatares dinámicos y RUNs chilenos matemáticamente válidos (Módulo 11):

| # | Correo Institucional | Nombre en Ficha | RUN Chileno | Semestre | Escenario de Prueba Curricular / Prerrequisitos |
|---|----------------------|-----------------|-------------|:--------:|-------------------------------------------------|
| **1** | `prueba1@estudiantes.uv.cl` | **Estudiante Prueba 1** | `20.123.456-5` | 2.° Sem. | **Prerrequisito Aprobado:** Aprobó *INF-110 (Intro a la Programación)* con nota **5.5**. **Habilitado** para tomar *INF-210 (Estructuras de Datos)*. |
| **2** | `prueba2@estudiantes.uv.cl` | **Estudiante Prueba 2** | `20.234.567-0` | 2.° Sem. | **Regla Especial UV 3.9:** Cursó *INF-110* y reprobó con nota **3.9**. **Habilitado por normativa UV** para inscribir *INF-210*. |
| **3** | `prueba3@estudiantes.uv.cl` | **Estudiante Prueba 3** | `20.345.678-6` | 2.° Sem. | **Prerrequisito Pendiente:** Reprobó *INF-110* con nota **3.5**. **Bloqueado**: el sistema impide la inscripción de *INF-210* y muestra advertencia curricular explicativa. |
| **4** | `prueba4@estudiantes.uv.cl` | **Estudiante Prueba 4** | `20.456.789-1` | 4.° Sem. | **Ciclo Básico Completo:** Aprobó *INF-110* (5.8) e *INF-210* (5.2). Flujo regular de segundo año. |
| **5** | `prueba5@estudiantes.uv.cl` | **Estudiante Prueba 5** | `20.567.890-5` | 5.° Sem. | **Ciclo Intermedio:** Grupo 1 de Prioridad Alta. Ideal para evaluar ramos de 5.° semestre (Malla 5125). |
| **6** | `prueba6@estudiantes.uv.cl` | **Estudiante Prueba 6** | `20.678.901-8` | 6.° Sem. | **Tercer Año:** Avance curricular regular. Grupo 1 de Prioridad Alta. |
| **7** | `prueba7@estudiantes.uv.cl` | **Estudiante Prueba 7** | `20.789.012-K` | 7.° Sem. | **Ciclo Profesional:** Grupo 2 de Prioridad Regular. |
| **8** | `prueba8@estudiantes.uv.cl` | **Estudiante Prueba 8** | `20.890.123-0` | 8.° Sem. | **Cuarto Año:** Asignaturas especializadas de Malla 5125. |
| **9** | `prueba9@estudiantes.uv.cl` | **Estudiante Prueba 9** | `20.901.234-0` | 9.° Sem. | **Ciclo Terminal / Talleres:** Asignaturas de 9.° semestre. |
| **10** | `prueba10@estudiantes.uv.cl` | **Estudiante Prueba 10** | `21.012.345-8` | 10.° Sem. | **Egreso y Titulación:** Pruebas de cierre de plan curricular. |
| **11** | `prueba11@estudiantes.uv.cl` | **Estudiante Prueba 11** | `21.123.456-3` | 5.° Sem. | **Prioridad Flexible (Grupo 3):** Simula asignación de rangos inferiores en la fila virtual. |
| **12** | `prueba12@estudiantes.uv.cl` | **Estudiante Prueba 12** | `21.234.567-9` | 5.° Sem. | **Prioridad Alta (Grupo 1):** Permite comparar tiempos estimados y cupos frente a Grupo 3. |

---

## 🚀 Inicio Rápido Local

### Requisitos Previos
- **Node.js** (v18.0 o superior)
- **npm** (v9.0 o superior)

### Instalación y Ejecución del Prototipo

```bash
# 1. Clonar el repositorio
git clone https://github.com/br1fz/TomaRamosUV.git
cd TomaRamosUV

# 2. Entrar a la carpeta del frontend
cd frontend

# 3. Instalar las dependencias
npm install

# 4. Iniciar en modo desarrollo con Vite
npm run dev
```

Abre tu navegador en: **`http://localhost:3000`** (o el puerto indicado por Vite en consola).

---

## 🗺️ Flujo Wireflow Completo (Paso a Paso)

El prototipo implementa el recorrido integral de punta a punta, estructurado en 6 instancias clave:

```
[0. Login Portal UV] ➔ [1. Portal Académico] ➔ [2. Fila Virtual] ➔ [3. Toma de Ramos] ➔ [4. Horario Armado] ➔ [5. Comprobante QR]
```

### `Paso 0: Login Portal UV`
- Formulario de autenticación federada institucional UV (`portal.uv.cl` / Microsoft SSO).
- **Banner Mandatorio de Sesión Única:** Informa que el acceso a la fila y la toma de ramos está ligado estrictamente al RUT del estudiante. Abrir la sesión en otra pestaña o dispositivo transfiere el turno sin duplicar lugares.
- Botones de llenado rápido para los usuarios de prueba.

### `Paso 1: Portal Académico UV`
- Réplica fiel del **Portal Alumnos UV** oficial (`portalalumnos.uv.cl`) con paleta azul marino (`#004A77`).
- **Ficha Académica Dinámica y Anonimizada:** Muestra el nombre (`Estudiante Prueba XX`), RUN verificado, carrera (*Ingeniería Civil Informática*), sede, plan de estudios (*Malla 5125*) y estado regular.
- Módulos de servicios universitarios y botón destacado de acceso: **"Toma de Ramos 2026-1"**.

### `Paso 2: Fila Virtual (Virtual Queue Engine)`
- Sala de espera automatizada para mitigar la sobrecarga de servidores.
- Visualización de posición exacta en la fila, estudiantes por delante y tiempo estimado de espera.
- **Web Audio API:** Alerta sonora armónica sin dependencias externas para notificar la llegada del turno cuando el usuario está en otra pestaña.
- **Wake Lock API:** Mantiene la pantalla activa en dispositivos móviles para evitar suspensiones.
- Botón **"Adelantar Fila Instantáneamente"** para permitir a los evaluadores ingresar de inmediato sin demoras.

### `Paso 3: Toma de Ramos (Academic Core)`
- **Catálogo de Malla Curricular Completa (Semestres 1 al 10):** Asignaturas oficiales de Ingeniería Civil Informática con códigos reales (`INF-110`, `INF-210`, `MAT-010`, etc.), créditos SCT y profesores.
- **Filtro por Semestre:** Permite filtrar rápidamente por nivel curricular o buscar por nombre y código de asignatura.
- **Ventana de Transacción Protegida (10:00 min):** Temporizador con cuenta regresiva para garantizar la equidad en la reserva de cupos.
- **Validación de Prerrequisitos en Tiempo Real:** Evalúa el historial del alumno activo (aprobado con $\ge 4.0$, regla de nota $3.9$ o bloqueo si reprobó con nota $< 3.9$).
- **Detección Preventiva de Topes Horarios:** El sistema bloquea de inmediato la selección de secciones con cruces en día y bloque, desplegando un modal de alerta y resaltando el conflicto en la grilla.
- **Control de Créditos:** Límite reglamentario de 30 créditos SCT con barra de progreso reactiva.

### `Paso 4: Horario Armado`
- Grilla semanal interactiva (Lunes a Viernes de 08:30 a 19:00 hrs) que consolida visualmente los bloques inscritos.
- Resumen de asignaturas confirmadas, créditos SCT totales y profesor asignado.
- Adaptada responsivamente tanto para vista de escritorio como para pantallas móviles estrechas.

### `Paso 5: Comprobante Oficial QR`
- Certificado oficial de inscripción curricular con validez institucional.
- **Código QR Dinámico:** Generado localmente con enlace de verificación de autenticidad institucional.
- **Firma Criptográfica SHA-256:** Hash único generado a partir del RUN, fecha y ramos inscritos.
- Respeto total de márgenes responsivos y botón para **Descargar en PDF / Imprimir**.

---

## 🎛️ Barra Superior de Control de Entorno (Herramientas para Testers)

En la parte superior de la pantalla se encuentra una barra compacta de herramientas de evaluación:

1. **Flujo Lineal y Progresivo (Sin Salto de Etapas):** La barra de salto de etapas fue retirada intencionalmente para garantizar que los evaluadores recorran el flujo real paso a paso (Login ➔ Portal ➔ Fila Virtual ➔ Toma de Ramos ➔ Horario ➔ Comprobante).
2. **Enfoque Exclusivo en Versión Web:** El prototipo se ejecuta y muestra en su versión web oficial (`portal.uv.cl`). Los componentes y diseños de la aplicación móvil **APPTUI UV** se mantienen preservados dentro del proyecto (`frontend/src/componentes/movil_apptui/`) para futuras fases de desarrollo.
3. **Selector de Alumno Alpha:** Desplegable para alternar rápidamente entre los 12 estudiantes de prueba.
4. **Adelantar Turno:** Visible exclusivamente durante la etapa de *Fila Virtual* para permitir ingresar a la toma de ramos sin esperar el tiempo completo si se desea acelerar el test.
5. **Probar Alerta Sonora:** Reproduce el tono armónico institucional generado mediante la Web Audio API nativa.
6. **Simular Concurrencia:** Dispara el evento de sesión duplicada para verificar el comportamiento de transferencia y el *Single-Session Lock*.
7. **Reiniciar Flujo:** Restablece los datos y retorna al usuario a la pantalla inicial de Login (`0. Login Portal UV`).

---

## 🗄️ Base de Datos y Modelo Relacional

El proyecto cuenta con un esquema relacional SQL completo y compatible con PostgreSQL 16 (Neon / Supabase / Docker) ubicado en [`database/schema_and_seeds.sql`](database/schema_and_seeds.sql):

- **11 Tablas Normalizadas:**
  1. `carreras`: Catálogo de carreras y sedes institucionales.
  2. `mallas`: Planes curriculares (ej. Malla 5125 Innovada SCT).
  3. `alumnos`: Estudiantes con RUN, email, hash bcrypt y plan asociado.
  4. `profesores`: Cuerpo docente asignado.
  5. `ramos`: Catálogo oficial de asignaturas y créditos SCT.
  6. `malla_ramos`: Relación semestral de ramos en la malla.
  7. `prerrequisitos`: Dependencias directas entre asignaturas.
  8. `periodos_academicos`: Periodo activo (ej. 2026-1).
  9. `secciones`: Cupos totales y vacantes disponibles por sección.
  10. `horarios_seccion`: Días de la semana y bloques horarios por sección.
  11. `inscripciones`: Registro histórico y actual con constraint única `(alumno_id, periodo_id, ramo_id)`.
- **Vista `v_choques_horario`:** Detecta traslapes temporales en bloques del mismo día de la semana.
- **Función `fn_verificar_prerrequisitos_pendientes`:** Valida automáticamente si el estudiante cumple con los prerrequisitos considerando nota $\ge 4.0$ o la regla especial UV de nota $= 3.9$.

---

## 📁 Estructura del Repositorio

```
TomaRamosUV/
├── database/
│   └── schema_and_seeds.sql        # Esquema relacional DDL PostgreSQL, vistas, funciones y semillas
├── Documentación/                  # Mallas curriculares PDF/Excel, APK de APPTUI e insumos gráficos
├── frontend/                       # Aplicación React + TypeScript + Vite + Tailwind CSS
│   ├── public/                     # Isotipos UV, avatares SVG, íconos y banners oficiales
│   │   ├── apptui_extracted/       # Activos visuales extraídos de APPTUI UV oficial
│   │   └── portal_alumnos_files/   # Íconos y banners del Portal Académico UV
│   ├── src/
│   │   ├── componentes/
│   │   │   ├── comunes/            # Comprobante QR, alertas de tope, alertas sonoras, modales
│   │   │   ├── desarrollo/         # Barra superior de control y emulación para testers
│   │   │   ├── escritorio_web/     # Portal UV Web Desktop (#004A77, Ficha, Selector, Malla)
│   │   │   └── movil_apptui/       # APPTUI Móvil Dark Mode (#14151A, carcasa de smartphone)
│   │   ├── contextos/              # Contexto global ContextoTomaRamos (estado, fila, carrito, sesión)
│   │   ├── datos/                  # 12 usuarios de prueba, catálogo de asignaturas Malla 5125
│   │   ├── servicios/              # Módulo de autenticación (bcrypt + JWT + SessionStorage)
│   │   ├── tipos/                  # Interfaces y definiciones TypeScript
│   │   └── utilidades/             # Validador de prerrequisitos UV, detector de topes, audio Web API
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json                 # Configuración de despliegue en Vercel
├── services/                       # Microservicios de apoyo (Queue Engine, Auth SSO, Academic Core)
├── docker-compose.yml              # Orquestación de infraestructura en contenedores
├── .env.example                    # Plantilla de variables de entorno (JWT_SECRET, puertos)
└── README.md                       # Documentación técnica y guía de testing
```

---

## 🛡️ Seguridad y Buenas Prácticas

- **Sin contraseñas en texto plano:** Las claves se almacenan exclusivamente como hashes unidireccionales generados con **bcrypt** (10 rondas de sal).
- **Sesiones Criptográficamente Firmadas:** Tokens de sesión firmados mediante **JWT / JWS** con algoritmo HMAC-SHA256 y clave secreta configurable vía variable de entorno (`JWT_SECRET`).
- **Anonimización Estricta:** Todas las identidades de prueba utilizan formatos neutrales (`Estudiante Prueba XX`) para proteger la privacidad en las demostraciones y fases de testeo de usabilidad.
- **Compatibilidad Vercel:** Configuración lista para despliegues *serverless* continuos sin dependencias de compilación rotas.

---

## 👨‍💻 Autoría y Créditos

Proyecto desarrollado para la **Universidad de Valparaíso (UV)**  
*Escuela de Ingeniería Civil Informática — Malla Curricular 5125*  
Valparaíso, Chile • 2026
