# 🚀 Skill Marketplace (In Development)

**Skill Marketplace** es una plataforma integral diseñada para conectar **empresas/clientes** con **profesionales de tecnología**. El proyecto resuelve la ineficiencia en el matching freelance mediante una estructura clara de perfiles, gestión de estados de postulación y una futura capa de Inteligencia Artificial.

---

### 🎯 Problemas que resuelve
* **Descentralización:** Centraliza oportunidades laborales en un solo ecosistema.
* **Falta de Transparencia:** Sistema de postulación con estados (**Pendiente, Aceptada, Rechazada**).
* **Matching Ineficiente:** Estructuración de perfiles diseñada para un filtrado inteligente.

### 🛠️ Stack Tecnológico ("Golden Stack")

#### **Frontend**
* ![React](https://img.shields.io/badge/-React%2019-61DAFB?style=flat&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat&logo=vite&logoColor=white) ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
* **Estilos:** ![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white) + **Shadcn UI** (Radix UI).
* **Gestión de Datos:** **TanStack Query** (v5), **Axios**.
* **Formularios:** **React Hook Form** + **Zod** (Validación de esquemas).
* **UI/UX:** **Lucide React** (Iconos) y **Clerk** (Auth).

#### **Backend**
* ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/-Express%205-000000?style=flat&logo=express&logoColor=white) ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
* **ORM:** ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=flat&logo=prisma&logoColor=white) **Prisma** con **PostgreSQL** (Neon).
* **Seguridad:** **Clerk SDK Node** & **Zod** para validación de Body/Params.
* **Ejecución:** **tsx** para un entorno de desarrollo ágil.

---

### 🚀 Funcionalidades Actuales
* **Acceso Público:** Landing page, visor de ofertas de trabajo y perfiles profesionales accesibles sin necesidad de logueo.
* **Sistema de Roles:** Autenticación protegida con distinción clara entre **Cliente** y **Profesional**.
* **Dashboard Profesional:**
    * Gestión de perfil y edición de habilidades técnica.
    * Buscador de trabajos y sistema de postulación directa.
    * Panel de **"Mis Postulaciones"** con seguimiento de estados.
    * Estadísticas de actividad del usuario.

---

### 🤖 RoadMap: IA & Escalabilidad
El proyecto cuenta con una **arquitectura modular** preparada para integrar:
1. **Matching Inteligente:** Implementación de **NLP** y **Embeddings** para calcular el score de compatibilidad entre vacantes y candidatos.
2. **Recomendaciones Personalizadas:** Sistema basado en el historial y skills del profesional.
3. **Fintech & Comunicaciones:** Integración de **Stripe** para pagos y sistema de chat en tiempo real.

---

### ⚙️ Instalación (Local)
1. **Clona el repositorio:**
   ```bash
   git clone [https://github.com/tu-usuario/skill-marketplace.git](https://github.com/tu-usuario/skill-marketplace.git)

2. **Instala las dependencias:**
  ```bash
   npm install
  ```

3. **Configura las variables de entorno:**
Crea un archivo .env basado en el ejemplo del proyecto con tus credenciales de PostgreSQL y Clerk.

4. **Prepara la base de datos:**
   ```bash
   npx prisma migrate dev

5. **Inicia el entorno de desarrollo:**
  ```bash
   npm run dev
