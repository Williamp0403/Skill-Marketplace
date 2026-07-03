# 🏗️ Plan de Implementación — Skill Marketplace
> Ordenado de más necesario a menos. Cada fase es independiente y deployable.

---

## FASE 1 — Completar el flujo del contrato 🔴 (Crítico)

> Sin esto, la app no tiene un ciclo de vida real. Las propuestas se aceptan y no pasa nada más.

### 1.1 — Estado del Job (`JobStatus`)

**¿Por qué primero?** Es la base de todo lo que viene. Sin saber si un job está abierto, en progreso o terminado, no se puede construir el chat, las reviews, ni las invitaciones correctamente.

**Cambios en Prisma:**
```prisma
enum JobStatus {
  OPEN
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

model Job {
  // ... campos existentes ...
  status JobStatus @default(OPEN)  // nuevo campo
}
```

**Cambios en Backend:**
- `updateApplicationStatus`: cuando se acepta una propuesta → cambiar el job a `IN_PROGRESS` + rechazar automáticamente todas las demás propuestas `PENDING` del mismo job
- Nuevo endpoint `PATCH /jobs/:id/complete` → cambia a `COMPLETED` (solo el cliente dueño)
- Nuevo endpoint `PATCH /jobs/:id/cancel` → cambia a `CANCELLED`
- Filtrar en `getAllJobs` para que por defecto solo muestre jobs `OPEN`

**Cambios en Frontend:**
- Badge de estado en las cards de jobs (`MyJobs`, `JobDetails`)
- Botón "Marcar como completado" en `MyJobs` (solo si está `IN_PROGRESS`)
- Ocultar botón "Aplicar" si el job ya no está `OPEN`

**Dificultad:** 🟡 Media | **Estimado:** 1 día

---

### 1.2 — Sistema de Invitaciones (Cliente → Profesional)

**¿Por qué?** Sin esto, el cliente no puede contactar proactivamente a un profesional que descubrió en `/profiles`.

**Flujo:**
```
Cliente ve perfil público del profesional
  → Botón "Invitar a proyecto"
  → Modal: selector de sus jobs OPEN
  → Se crea una Invitation
  → Profesional recibe notificación
  → Puede aceptar (Application se crea automáticamente) o rechazar
```

**Cambios en Prisma:**
```prisma
model Invitation {
  id             String           @id @default(cuid())
  clientId       String
  professionalId String
  jobId          String
  message        String?
  status         InvitationStatus @default(PENDING)
  createdAt      DateTime         @default(now())

  client       User @relation("ClientInvitations", fields: [clientId], references: [id])
  professional User @relation("ProfessionalInvitations", fields: [professionalId], references: [id])
  job          Job  @relation(fields: [jobId], references: [id])

  @@unique([clientId, professionalId, jobId])
}

enum InvitationStatus {
  PENDING
  ACCEPTED
  REJECTED
}
```

**Cambios en Backend:**
- `POST /invitations` — cliente crea invitación (auth: CLIENT)
- `GET /invitations/me` — profesional ve sus invitaciones (auth: PROFESSIONAL)
- `PATCH /invitations/:id` — profesional acepta/rechaza (auth: PROFESSIONAL)
- Al aceptar → crear automáticamente una Application

**Cambios en Frontend:**
- Botón "Invitar a proyecto" en `ProfileDetails` (visible solo si viewer es CLIENT)
- Modal con selector de jobs del cliente
- Nueva sección "Invitaciones" en el sidebar del profesional
- Card de invitación con botones Aceptar/Rechazar

**Dificultad:** 🟠 Media-Alta | **Estimado:** 2-3 días

---

## FASE 2 — Comunicación ⭐ (Alta prioridad)

### 2.1 — Notificaciones In-App

**¿Por qué antes que el chat?** Las notificaciones son el sistema de alerta de todo. Sin ellas, el usuario no sabe si su propuesta fue aceptada, si llegó una invitación, o si hay un mensaje nuevo.

**Cambios en Prisma:**
```prisma
model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  body      String?
  read      Boolean          @default(false)
  link      String?          // URL a donde navegar al hacer click
  createdAt DateTime         @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum NotificationType {
  APPLICATION_RECEIVED   // Cliente: alguien aplicó a tu job
  APPLICATION_ACCEPTED   // Profesional: te aceptaron
  APPLICATION_REJECTED   // Profesional: te rechazaron
  INVITATION_RECEIVED    // Profesional: te invitaron a un proyecto
  INVITATION_ACCEPTED    // Cliente: el profesional aceptó tu invitación
  NEW_MESSAGE            // Ambos: nuevo mensaje en el chat
  JOB_COMPLETED          // Ambos: el trabajo fue completado
}
```

**Cambios en Backend:**
- Helper interno `createNotification(userId, type, title, body?, link?)` — se llama en cada acción relevante
- `GET /notifications/me` — lista del usuario autenticado
- `PATCH /notifications/read-all` — marcar todas como leídas
- `PATCH /notifications/:id/read` — marcar una como leída

**Cambios en Frontend:**
- Badge con contador en el sidebar (no leídas)
- Dropdown/panel de notificaciones en el header con links de navegación
- Polling cada 30s o refetch al cambiar de ruta

**Dificultad:** 🟡 Media | **Estimado:** 1-2 días

---

### 2.2 — Chat / Mensajería Post-Aceptación

**Restricción de acceso:** Solo disponible si existe una Application con status `ACCEPTED` entre las dos partes.

**Cambios en Prisma:**
```prisma
model Conversation {
  id             String   @id @default(cuid())
  clientId       String
  professionalId String
  jobId          String
  createdAt      DateTime @default(now())

  client       User      @relation("ClientConversations", fields: [clientId], references: [id])
  professional User      @relation("ProfessionalConversations", fields: [professionalId], references: [id])
  job          Job       @relation(fields: [jobId], references: [id])
  messages     Message[]

  @@unique([clientId, professionalId, jobId])
}

model Message {
  id             String   @id @default(cuid())
  conversationId String
  senderId       String
  content        String
  read           Boolean  @default(false)
  createdAt      DateTime @default(now())

  conversation Conversation @relation(fields: [conversationId], references: [id])
  sender       User         @relation(fields: [senderId], references: [id])
}
```

**Cambios en Backend:**
- Al aceptar una Application → crear `Conversation` automáticamente
- `GET /conversations/me` — lista de conversaciones del usuario
- `GET /conversations/:id/messages` — mensajes paginados
- `POST /conversations/:id/messages` — enviar mensaje
- `PATCH /conversations/:id/read` — marcar mensajes como leídos

**Cambios en Frontend:**
- Sección "Mensajes" en el sidebar de ambos roles
- Lista de conversaciones tipo inbox (última conversación arriba)
- Vista de hilo de mensajes con scroll automático al último
- Input para escribir y enviar
- Polling cada 5s mientras la conversación está abierta

**Dificultad:** 🟠 Media-Alta | **Estimado:** 3-4 días

---

## FASE 3 — Confianza y calidad 🟡

### 3.1 — Reviews y Valoraciones

**Trigger:** Solo cuando el job está en estado `COMPLETED`.

**Cambios en Prisma:**
```prisma
model Review {
  id         String   @id @default(cuid())
  reviewerId String
  reviewedId String
  jobId      String
  rating     Int      // 1-5
  comment    String?
  createdAt  DateTime @default(now())

  reviewer User @relation("ReviewsGiven", fields: [reviewerId], references: [id])
  reviewed User @relation("ReviewsReceived", fields: [reviewedId], references: [id])
  job      Job  @relation(fields: [jobId], references: [id])

  @@unique([reviewerId, jobId])
}
```

**Cambios en Frontend:**
- Modal "Dejar valoración" al completar el job (para ambos roles)
- Rating visual con estrellas + comentario opcional
- Mostrar promedio y listado de reviews en `ProfileDetails` y `CompanyProfile`

**Dificultad:** 🟡 Media | **Estimado:** 2 días

---

### 3.2 — Guardar Trabajos (Bookmarks)

**Para:** Profesionales que quieren guardar un job para postularse después.

**Cambios en Prisma:**
```prisma
model SavedJob {
  id             String   @id @default(cuid())
  professionalId String
  jobId          String
  createdAt      DateTime @default(now())

  professional User @relation(fields: [professionalId], references: [id])
  job          Job  @relation(fields: [jobId], references: [id])

  @@unique([professionalId, jobId])
}
```

**Cambios en Frontend:**
- Botón bookmark en cards de jobs y en `JobDetails`
- Sección "Guardados" en el sidebar del profesional

**Dificultad:** 🟢 Baja | **Estimado:** 1 día

---

## FASE 4 — Mejoras opcionales 🟢

| Feature | Descripción | Dificultad |
|---------|-------------|------------|
| 🤖 Matching por skills | Recomendar jobs/profesionales por intersección de habilidades | Media |
| 📧 Emails transaccionales | Notificaciones por email con Resend o SendGrid | Baja-Media |
| 💳 Pagos con escrow | Integrar Stripe, liberar pago al completar | Muy Alta |
| 🛡️ Perfil verificado | Badge de identidad verificada | Alta |
| 📅 Disponibilidad semanal | Profesional indica sus horarios disponibles | Media |

---

## Resumen de orden y tiempos

| # | Feature | Fase | Dificultad | Estimado |
|---|---------|------|------------|----------|
| 1 | Estado del Job (JobStatus) | 1 | 🟡 Media | 1 día |
| 2 | Invitaciones Cliente→Profesional | 1 | 🟠 Media-Alta | 2-3 días |
| 3 | Notificaciones In-App | 2 | 🟡 Media | 1-2 días |
| 4 | Chat Post-Aceptación | 2 | 🟠 Media-Alta | 3-4 días |
| 5 | Reviews y Valoraciones | 3 | 🟡 Media | 2 días |
| 6 | Guardar Trabajos | 3 | 🟢 Baja | 1 día |

> [!IMPORTANT]
> El **item 1 (JobStatus)** es prerequisito de casi todo. El chat depende de saber si hay un job `IN_PROGRESS`, las reviews dependen del estado `COMPLETED`, y las invitaciones solo se hacen a jobs `OPEN`.

> [!TIP]
> Cada item es deployable por separado. Puedes terminar el JobStatus hoy, hacer deploy, y luego seguir con las Invitaciones sin romper nada.
