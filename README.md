# 🏛️ Plataforma Unificada de Fila Virtual y Toma de Ramos UV
### Universidad de Valparaíso — Ingeniería Civil Informática (Malla 5125)

Sistema web y móvil unificado diseñado para resolver el colapso de servidores y la ansiedad estudiantil durante el proceso de **Toma de Ramos**, implementando una arquitectura de sala de espera virtual (*Virtual Queue / Traffic Gatekeeper*), autenticación federada simulada de Microsoft Azure AD (`@estudiantes.uv.cl`), control de concurrencia estrictamente unitaria por estudiante, validación preventiva de choques de horario y comprobante oficial con verificación QR.

---

## 🚀 Inicio Rápido (Mockup Funcional)

Para ejecutar y probar inmediatamente el mockup interactivo:

```bash
# 1. Navegar al frontend
cd frontend

# 2. Instalar dependencias (si es primera vez)
npm install

# 3. Iniciar servidor de desarrollo Vite
npm run dev
```

Abre tu navegador en: **`http://localhost:3000`** (o `http://127.0.0.1:3000`).

---

## 🐳 Despliegue con Docker Compose

El repositorio incluye un archivo `docker-compose.yml` completo y configurado para levantar toda la infraestructura:

```bash
# Levantar PostgreSQL 16, Redis 7, Backend API y Frontend
docker compose up --build
```

Servicios desplegados:
- **Frontend:** `http://localhost:3000` (Nginx + SPA)
- **Backend API:** `http://localhost:4000` (Express + WebSockets)
- **PostgreSQL 16:** Puerto `5432` con esquema inicial y seeds de Malla 5125.
- **Redis 7:** Puerto `6379` con ZSET FIFO y Single-Session Lock.

---

## 🌟 Módulos y Reglas de Negocio Implementadas

### Módulo 1: Autenticación SSO Microsoft & Control de Sesión Única
- **Formulario Institucional UV:** Simulación de `portal.uv.cl` y `sso.uv.cl`.
- **Banner Mandatorio de Advertencia de Concurrencia:**
  > **"REGISTRO ESTRICTAMENTE ÚNICO POR ESTUDIANTE VERIFICADO"**  
  > *"El acceso a la toma de ramos y su turno en la fila virtual está asociado exclusivamente a su RUT y correo institucional. Iniciar sesión desde múltiples pestañas, ventanas de incógnito o dispositivos distintos transferirá automáticamente la sesión activa al último acceso sin adelantar su lugar en la fila."*
- **Single-Session Lock (Exclusión Mutua):** Si se detecta un nuevo login con el mismo RUT, la pestaña anterior es invalidada inmediatamente mediante un modal informativo de sesión transferida.
- **Usuario de prueba precargado:** Estudiante de Prueba UV (`estudiante.prueba@estudiantes.uv.cl`, RUN `20.123.456-7`).

### Módulo 2: Sala de Espera Virtual Inteligente (Queue Engine)
- **Métricas en Tiempo Real:** Puesto exacto (`#18`), cantidad de alumnos por delante, tiempo estimado de espera (~15 alumnos/minuto) y barra de progreso animada.
- **Tolerancia a micro-cortes de red:** El token mantiene la posición durante 120 segundos de gracia.
- **Alerta Sonora (Web Audio API):** Toggle interactivo para disparar un chime armónico institucional al llegar el turno del estudiante (sin dependencias de archivos de audio externos).
- **Desincentivo al F5:** Preservación de sesión y socket sin pérdida de prioridad.

### Módulo 3: Motor Curricular y Portal de Inscripción (Academic Core)
- **Ventana Protegida de 10 Minutos:** Temporizador con cuenta regresiva regresiva (`10:00`) y alertas visuales de urgencia.
- **Cátedras de Ingeniería Civil Informática (5.° Semestre, Malla 5125 UV):**
  - `CIN 311` — Estructuras de Datos (5 cr) [Sec. 1: 4/40 cupos | Sec. 2: 15/40 cupos]
  - `CIN 312` — Arquitectura de Computadores (4 cr) [Sec. 1: 12/35 cupos]
  - `CIN 313` — Modelos de Base de Datos (4 cr) [**0/40 Cupos - AGOTADO**] ➔ Botón: *"Anotarse en Lista de Espera Automatizada (Turno #4)"*.
  - `CIN 314` — Fundamentos de Ingeniería de Software (4 cr) [Sec. 1: 18/35 cupos]
  - `FIS 311` — Física Electromagnetismo (5 cr) [Sec. 1: Lun 08:30-10:00 (**TOPE CON CIN 311 Sec. 1**) | Sec. 2: Mar 14:00-17:15]
- **Detección Preventiva de Topes Horarios:** Si se intenta marcar secciones con cruce de día y bloque, el sistema desmarca la segunda, emite un aviso sonoro, despliega el modal explicativo y resalta el bloque en rojo en el horario semanal.
- **Control de Créditos:** Medidor en tiempo real con límite reglamentario de 30 créditos SCT.
- **Horario Semanal Interactivo:** Grilla de Lunes a Viernes (08:30 a 19:00 hrs) pintada dinámicamente con las asignaturas seleccionadas.
- **Comprobante Oficial Descargable e Imprimible:** Con código QR dinámico generado localmente y firma criptográfica SHA-256.

### Módulo 4: Sistema de Diseño Dual (Portal Web Desktop vs APPTUI UV Mobile)
- **Vista Desktop (`portal.uv.cl`):** Encabezado Azul Marino Corporativo (`#004A77`), sidebar con foto y perfil de alumno, dashboard modular.
- **Vista Mobile (`APPTUI UV` Dark Mode):** Fondo carbón mate (`#14151A`), tarjetas `#20232A`, acento turquesa oficial `#31C4D7`, barra de navegación fija con badge de 15 notificaciones en rojo coral Santander (`#EC1C24`) y drawer lateral.
- **Barra de Emulación Superior:** Permite alternar instantáneamente entre la vista de escritorio y la vista de smartphone en un marco interactivo.

---

## 🧪 Benchmark de Carga Masiva (100 Usuarios Concurrentes)

Para simular el comportamiento de la fila virtual ante alta concurrencia:

```bash
cd services/queue-engine
node benchmark.js
```

---

## 📁 Estructura del Proyecto

```
TomaRamosUV/
├── docker-compose.yml              # Orquestación de contenedores
├── .env.example                    # Plantilla de variables de entorno
├── README.md                       # Documentación técnica y de usuario
├── Documentación/                  # Insumos institucionales UV (HTML, imágenes, mallas)
├── frontend/                       # Aplicación React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── dev/                # Barra superior de control y emulación
│   │   │   ├── web/                # Layout Portal UV Desktop (#004A77)
│   │   │   ├── mobile/             # Layout APPTUI UV Dark Mode (#14151A, #31C4D7)
│   │   │   └── shared/             # Fila virtual, alertas, comprobante QR
│   │   ├── context/                # Estado reactivo global
│   │   ├── data/                   # Malla 5125 y estudiante de prueba
│   │   ├── types/                  # Tipado estricto TypeScript
│   │   └── utils/                  # Web Audio API y detección de topes
│   └── public/                     # SVGs institucionales UV y foto de alumno
└── services/
    ├── academic-core/              # Motor transaccional y seeds SQL
    ├── auth-sso/                   # Servicio de autenticación federada
    └── queue-engine/               # Motor de colas y benchmark
```

---

## 👨‍💻 Créditos y Autoría

Desarrollado para la **Universidad de Valparaíso (UV)**  
*Malla Curricular 5125 — Ingeniería Civil Informática*  
Valparaíso, Chile • 2026
