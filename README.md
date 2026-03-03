# 🚀 Skill Marketplace

**Skill Marketplace** es una plataforma integral diseñada para conectar **empresas/clientes** con **profesionales de tecnología**. El proyecto resuelve la ineficiencia en el matching freelance mediante una estructura clara de perfiles, gestión de estados de postulación y una futura capa de Inteligencia Artificial.

🔗 **Demo en producción:** [https://skillmarketplace.netlify.app](https://skillmarketplace.netlify.app/)

---

### 🎯 Problemas que resuelve

- **Descentralización:** Centraliza oportunidades laborales en un solo ecosistema.
- **Falta de Transparencia:** Sistema de postulación con estados (**Pendiente, Aceptada, Rechazada**).
- **Matching Ineficiente:** Estructuración de perfiles diseñada para un filtrado inteligente.

---

### 🛠️ Stack Tecnológico

#### **Frontend**

- ![React](https://img.shields.io/badge/-React%2019-61DAFB?style=flat&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat&logo=vite&logoColor=white) ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
- **Estilos:** ![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white) + **Shadcn UI** (Radix UI).
- **Gestión de Datos:** **TanStack Query** (v5), **Axios**.
- **Formularios:** **React Hook Form** + **Zod** (Validación de esquemas).
- **UI/UX:** **Lucide React** (Iconos) y **Clerk** (Auth).

#### **Backend**

- ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/-Express%205-000000?style=flat&logo=express&logoColor=white) ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
- **ORM:** ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=flat&logo=prisma&logoColor=white) **Prisma** con **PostgreSQL** (Neon).
- **Seguridad:** **Clerk SDK Node** & **Zod** para validación de Body/Params.
- **Ejecución:** **tsx** para un entorno de desarrollo ágil.

#### **Despliegue**

- **Frontend:** Netlify
- **Backend:** Vercel (Serverless Functions)
- **Base de Datos:** Neon (PostgreSQL serverless)

---

### 🚀 Funcionalidades

#### Acceso Público

- Landing page con presentación de la plataforma.
- Exploración de ofertas de trabajo con filtros (modalidad, experiencia, tipo de trabajo).
- Exploración de perfiles profesionales con filtrado por habilidades.
- Detalle completo de cada oferta y cada perfil.

#### Panel del Cliente (Empresa)

- **Dashboard:** Estadísticas de proyectos publicados, propuestas recibidas, pendientes y talentos contratados. Actividad reciente y acciones rápidas.
- **Perfil de Empresa:** Formulario con nombre de empresa, industria, sitio web, ubicación y descripción (separado de la identidad personal de Clerk).
- **Publicar Proyecto:** Creación de ofertas con título, descripción, presupuesto, modalidad de trabajo, nivel de experiencia, tipo de contrato y skills requeridos.
- **Mis Proyectos:** Listado y gestión de todos los proyectos publicados.
- **Propuestas Recibidas:** Revisar, aceptar o rechazar postulaciones de profesionales. Selector de proyecto sincronizado con la URL (`?job=ID`).
- **Buscar Talentos:** Explorar perfiles de profesionales filtrados por habilidades.
- **Configuración:** Gestión de cuenta personal mediante integración con Clerk.

#### Panel del Profesional

- **Dashboard:** Estadísticas de propuestas enviadas (total, pendientes, aceptadas, rechazadas). Actividad reciente y acciones rápidas.
- **Mi Perfil:** Edición de título profesional, biografía, tarifa por hora, experiencia, ubicación, habilidades, idiomas, portafolio y educación. Validación con React Hook Form + Zod.
- **Explorar Trabajos:** Búsqueda de proyectos publicados por clientes con filtros avanzados.
- **Mis Propuestas:** Seguimiento del estado de todas las postulaciones enviadas.
- **Configuración:** Gestión de cuenta personal mediante integración con Clerk.

#### Sistema de Roles y Autenticación

- Autenticación completa con **Clerk** (Google OAuth, Email, etc.).
- Selección de rol en el onboarding (**Cliente** o **Profesional**).
- Rutas protegidas por rol con layouts independientes (sidebar, header).
- Webhook de Clerk para sincronizar datos de usuario (nombre, avatar) automáticamente.

---

### 🤖 Roadmap: IA & Escalabilidad

El proyecto cuenta con una **arquitectura modular** preparada para integrar:

1. **Matching Inteligente:** Implementación de **NLP** y **Embeddings** para calcular el score de compatibilidad entre vacantes y candidatos.
2. **Recomendaciones Personalizadas:** Sistema basado en el historial y skills del profesional.
3. **Fintech & Comunicaciones:** Integración de **Stripe** para pagos y sistema de chat en tiempo real.

---

### 📁 Estructura del Proyecto

```
skill-marketplace/
├── client/                    # Frontend (React + Vite)
│   ├── public/                # Archivos estáticos (favicon, _redirects)
│   └── src/
│       ├── components/        # Componentes reutilizables (StatCard, QuickAction, UI)
│       │   ├── ui/            # Componentes Shadcn (Button, Input, Form, Select, etc.)
│       │   ├── client/        # Componentes específicos del dashboard del cliente
│       │   └── professional/  # Componentes específicos del dashboard del profesional
│       ├── layouts/           # Layouts (RootLayout, ClientLayout, ProfessionalLayout)
│       ├── pages/             # Páginas organizadas por rol (client/, professional/)
│       ├── routes/            # Enrutamiento y protección de rutas
│       ├── schemas/           # Esquemas de validación Zod (frontend)
│       ├── services/          # Funciones de llamadas a la API (Axios)
│       ├── store/             # Estado global (AuthProvider)
│       ├── types/             # Tipos TypeScript
│       └── lib/               # Utilidades (axios, utils, date)
│
└── server/                    # Backend (Express + Prisma)
    ├── prisma/
    │   ├── schema.prisma      # Modelos: User, ProfessionalProfile, ClientProfile, Job, Application
    │   └── migrations/        # Historial de migraciones
    └── src/
        ├── modules/           # Módulos por entidad (user, job, application, etc.)
        │   ├── user/
        │   ├── job/
        │   ├── application/
        │   ├── professionalProfile/
        │   ├── clientProfile/
        │   └── profile/
        ├── middleware/         # Auth, Role, Validation
        ├── routes/            # Registro de rutas (index, webhook)
        └── lib/               # Cliente Prisma
```

---

### ⚙️ Instalación Local

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/tu-usuario/skill-marketplace.git
   cd skill-marketplace
   ```

2. **Instala las dependencias:**

   ```bash
   # Frontend
   cd client && npm install

   # Backend
   cd ../server && npm install
   ```

3. **Configura las variables de entorno:**

   Crea un archivo `.env` en `/server` con:

   ```env
   DATABASE_URL="tu-url-de-neon-postgres"
   CLERK_SECRET_KEY="tu-clerk-secret-key"
   CLERK_WEBHOOK_SECRET="tu-clerk-webhook-secret"
   ```

   Crea un archivo `.env` en `/client` con:

   ```env
   VITE_BACKEND_URL="http://localhost:3000/api"
   VITE_CLERK_PUBLISHABLE_KEY="tu-clerk-publishable-key"
   ```

4. **Prepara la base de datos:**

   ```bash
   cd server
   npx prisma migrate dev
   ```

5. **Inicia el entorno de desarrollo:**

   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev

   # Terminal 2 - Frontend
   cd client && npm run dev
   ```

---

### 📄 Licencia

ISC
