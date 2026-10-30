# SYSTEM SPECIFICATION & IMPLEMENTATION DIRECTIVE: UV VIRTUAL QUEUE & ENROLLMENT PLATFORM

## 1. CONTEXTO Y MISIÓN DEL AGENTE
Actúa como un **Staff Software Engineer & Distributed Systems Architect**. Tu objetivo es construir desde cero, ejecutar en entorno local y dejar listo para control de versiones en GitHub un sistema web y móvil unificado (**Responsive Monorepo**) para la **Universidad de Valparaíso (UV)**.

El sistema debe resolver el colapso de servidores y la alta ansiedad estudiantil durante la **Toma de Ramos**, implementando una arquitectura de sala de espera virtual (Virtual Queue / Traffic Gatekeeper) desacoplada, con autenticación federada simulada de Microsoft Azure AD (`@estudiantes.uv.cl`), concurrencia estrictamente unitaria por estudiante, actualización en tiempo real vía WebSockets y un motor transaccional de inscripción curricular con control atómico de vacantes y validación preventiva de choques de horario para **Ingeniería Civil Informática (Malla 5125 / Plan Común UV)**.

---

## 2. ARQUITECTURA TÉCNICA DEL MONOREPO

El proyecto se estructurará como un monorepo modular con despliegue local inmediato mediante Docker Compose:

```
TomaRamosUV/
├── docker-compose.yml
├── .env.example
├── README.md
├── services/
│   ├── auth-sso/               # Servicio de Autenticación & Control de Concurrencia
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── src/
│   ├── queue-engine/           # Motor de Fila Virtual (Redis + WebSockets + TTL)
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── src/
│   └── academic-core/          # Motor Transaccional de Inscripción y Validación Horaria
│       ├── Dockerfile
│       ├── package.json
│       └── src/
└── frontend/                   # Frontend Unificado Multiplataforma (Next.js / Vite React + Tailwind)
    ├── Dockerfile
    ├── tailwind.config.js
    └── src/
        ├── components/
        │   ├── web/            # Layout Desktop Portal UV (#004A77)
        │   ├── mobile/         # Layout Mobile APPTUI UV (#14151A, #31C4D7)
        │   └── shared/         # Fila Virtual, Horario, Alertas
        └── pages/
```

### Stack Tecnológico Recomendado:
- **Backend Runtime:** Node.js (TypeScript) con Express / Fastify o NestJS.
- **Base de Datos & Caché:** 
  - **Redis 7:** Para gestión en memoria de colas de mensajes (ZSET para prioridad FIFO), bloqueo de sesiones concurrentes y tokens de turno con expiración (TTL).
  - **PostgreSQL 16:** Para persistencia de estudiantes, mallas curriculares, cátedras, cupos y comprobantes de inscripción.
- **Comunicación en Tiempo Real:** Socket.io / WebSocket nativo con heartbeat de presencia.
- **Frontend:** React / Next.js (TypeScript) + Tailwind CSS + Lucide Icons / Material Symbols.

---

## 3. ESPECIFICACIÓN DE MÓDULOS Y REGLAS DE NEGOCIO

### MÓDULO 1: Autenticación SSO Microsoft & Control de Sesión Única (Single-Session Lock)
1. **Flujo de Acceso:**
   - Simular el formulario institucional de `portal.uv.cl` y `sso.uv.cl`.
   - Permitir acceso con credenciales institucionales:
     - Formato de cuenta: `nombre.apellido@estudiantes.uv.cl` (ejemplo de prueba: `bruno.diazf@estudiantes.uv.cl`, RUT `19.926.640-3`).
2. **Banner de Advertencia de Concurrencia (Mandatorio en UI):**
   - Antes y durante el formulario de login, mostrar un recuadro de advertencia con borde ámbar (`#F9AB00`) y fondo `#FEF7E0`:
     > **"REGISTRO ESTRICTAMENTE ÚNICO POR ESTUDIANTE VERIFICADO"**  
     > *"El acceso a la toma de ramos y su turno en la fila virtual está asociado exclusivamente a su RUT y correo institucional. Iniciar sesión desde múltiples pestañas, ventanas de incógnito o dispositivos distintos transferirá automáticamente la sesión activa al último acceso sin adelantar su lugar en la fila."*
3. **Mecanismo de Exclusión Mutua en Redis:**
   - Clave en Redis: `session:student:{rut}` -> almacena `{ socketId, device, ip, activeToken, timestamp }`.
   - Si se detecta un nuevo login con el mismo RUT/correo, el backend debe invalidar el socket anterior enviando un evento `SESSION_TRANSFERRED` a la pestaña/dispositivo antiguo, mostrando un modal informativo: *"Tu sesión se ha transferido a otro dispositivo o ventana. Este acceso ha sido desactivado."*

---

### MÓDULO 2: Sala de Espera Virtual Inteligente (Queue Engine)
1. **Estructura de Datos en Redis:**
   - `queue:active`: Sorted Set (`ZSET`), donde el `score` es el timestamp UNIX de ingreso (orden estricto FIFO).
   - `queue:tokens:{uuid}`: Hash con metadatos del estudiante, tiempo de gracia restante y estado (`WAITING`, `PROCESSING`, `COMPLETED`, `EXPIRED`).
2. **Métricas en Tiempo Real por WebSocket:**
   - Cada 2 segundos, el servidor emite a cada cliente conectado:
     - `position`: Puesto exacto en la fila (`#18`).
     - `aheadCount`: Cantidad de alumnos por delante.
     - `estimatedWaitSeconds`: Tiempo estimado calculado según la tasa de salida (ej. 15 alumnos procesados por minuto).
     - `progressPercentage`: Porcentaje de avance de la barra de progreso.
3. **Mecanismos Anti-Ansiedad:**
   - **Tolerancia al corte de red:** Si el estudiante se desconecta momentáneamente (cambio de Wi-Fi a 4G o túnel de metro), el token mantiene su lugar en el ZSET durante 120 segundos de gracia para reconexión.
   - **Avisos Auditivos:** Toggle `[x] Activar alerta sonora al llegar mi turno`. Disparar una señal de audio Web Audio API cuando el estado pase de `WAITING` a `ADMITTED`.
   - **Desincentivo al F5:** Si el usuario recarga la página, el cliente recupera el token almacenado en `sessionStorage`/`localStorage` y reanuda el socket sin perder su puesto ni reiniciar la posición.

---

### MÓDULO 3: Motor Curricular y Portal de Inscripción (Academic Core)
1. **Ventana de Gracia Transaccional:**
   - Una vez admitido el turno, el estudiante tiene **10 minutos protegidos** (`countdown: 10:00`) para inscribir y guardar.
2. **Modelo de Asignaturas (Ingeniería Civil Informática - 5.° Semestre, Malla 5125 UV):**
   Cargar en la base de datos las siguientes cátedras y secciones:
   - **CIN 311 - Estructuras de Datos (5 créditos):**
     - Prerrequisito: `CIN 211` (Aprobado en simulación).
     - Sec. 1: Prof. Álvaro Morales | Horario: Lun 08:30-10:00, Mié 08:30-10:00 | Cupos: 4 / 40.
     - Sec. 2: Prof. Gonzalo Rivera | Horario: Mar 10:15-11:45, Jue 10:15-11:45 | Cupos: 15 / 40.
   - **CIN 312 - Arquitectura de Computadores (4 créditos):**
     - Prerrequisito: `CIN 212` (Aprobado).
     - Sec. 1: Prof. Roberto Silva | Horario: Lun 10:15-11:45, Mié 10:15-11:45 | Cupos: 12 / 35.
   - **CIN 313 - Modelos de Base de Datos (4 créditos):**
     - Prerrequisito: `CIN 211` (Aprobado).
     - Sec. 1: Prof. Claudia Castro | Horario: Mar 08:30-10:00, Jue 08:30-10:00 | **Cupos: 0 / 40 (Agotado)**.
   - **CIN 314 - Fundamentos de Ingeniería de Software (4 créditos):**
     - Prerrequisito: `PRO 121` (Aprobado).
     - Sec. 1: Prof. Patricia Valdés | Horario: Vie 08:30-11:45 | Cupos: 18 / 35.
   - **FIS 311 - Física Electromagnetismo (5 créditos):**
     - Prerrequisito: `FIS 211`, `MAT 211` (Aprobados).
     - Sec. 1: Prof. Manuel Herrera | Horario: Lun 08:30-10:00 (Tope directo con CIN 311 Sec. 1).
     - Sec. 2: Prof. Karla Contreras | Horario: Mar 14:00-17:15 | Cupos: 8 / 35.
3. **Reglas de Negocio en la Interfaz y Backend:**
   - **Control de Créditos:** Límite estándar de 30 créditos por semestre. El contador de créditos seleccionados (`Créditos actuales / 30`) debe calcularse en tiempo real.
   - **Detección Preventiva de Topes Horarios:** Si el usuario intenta marcar dos asignaturas con cruce de día y bloque horario (ej. *CIN 311 Sec. 1* y *FIS 311 Sec. 1*), el sistema debe desmarcar la segunda, disparar una alerta emergente (Toast / Modal) y resaltar en rojo el conflicto en el horario semanal.
   - **Manejo de Asignaturas Agotadas:** Para `CIN 313`, el checkbox debe estar deshabilitado, mostrando el botón interactivo: *"Anotarse en Lista de Espera Automatizada (Turno #4)"*.
   - **Transacción Atómica (Reserva de Vacantes):** Al presionar *"Confirmar y Guardar Carga"*, ejecutar una transacción en PostgreSQL / Redis con `DECRBY quota` protegido para evitar sobrecupos (*race conditions*).
   - **Comprobante Oficial:** Al confirmar, emitir un comprobante descargable (PDF imprimible) con código QR de verificación digital y resumen de carga.

---

## 4. SISTEMA DE DISEÑO RESPONSIVO (WEB DESKTOP & APPTUI UV MOBILE)

El frontend debe adaptar su layout de forma fluida según el dispositivo o permitir alternar entre vistas mediante un toggle de emulación:

### A) Vista Web Desktop (Inspirada en `portal.uv.cl` y `portalalumnospregrado.uv.cl`)
- **Header:** Fondo Azul Marino Corporativo (`#004A77`), tipografía limpia blanca, links corporativos.
- **Sidebar Izquierdo:** Perfil de alumno con foto, RUN, carrera y estatus regular.
- **Área Central:** Dashboard modular, sala de espera con widget translúcido de alta confianza, grilla de horario semanal interactiva (Lunes a Viernes 08:30 a 19:00 hrs) que pinta los bloques curriculares al seleccionarlos.

### B) Vista Mobile App (Inspirada en `APPTUI UV` Dark Mode)
- **Fondo General:** Carbón mate (`#14151A`), tarjetas `#20232A` y bordes `#2D323E`.
- **Acento Turquesa Oficial:** `#31C4D7` con fondos de píldora `#13262F`.
- **Badge Notificaciones / Santander:** Rojo coral (`#EC1C24`).
- **Navegación Móvil:** Barra inferior fija con iconos de *Novedades*, *Actividades*, *Enlaces* y *Notificaciones (Badge 15)*.
- **Comportamiento Táctil:** Modales tipo Bottom Sheet para resolver conflictos de horario con un solo toque y visualización de cola adaptada a pantallas de smartphones.

---

## 5. ENTREGABLES ESPERADOS EN EL REPOSITORIO

1. **`docker-compose.yml` completo:**
   - Servicios: `postgres`, `redis`, `backend-api` y `frontend`.
   - Variables de entorno configuradas por defecto para que levante con un único comando: `docker compose up --build`.
2. **Scripts de Seed de Base de Datos:**
   - Carga inicial automática de las asignaturas, docentes, horarios y cupos de Ingeniería Civil Informática UV.
   - Carga de usuarios de prueba (alumno regular con correo `@estudiantes.uv.cl`).
3. **Código Limpio y Documentado:**
   - Tipado estricto en TypeScript en todo el monorepo.
   - Pruebas de integración para el encolamiento FIFO y la concurrencia unitaria de sesión.
4. **README.md de Ejecución:**
   - Pasos claros para clonar el repositorio, configurar variables de entorno, ejecutar en local, simular tráfico de cola masivo mediante un script de benchmarking (ej. 100 usuarios concurrentes) y subir cambios a ramas de GitHub.

Procede ahora a implementar el proyecto paso a paso, generando los archivos de configuración, servicios de backend y componentes de interfaz solicitados.