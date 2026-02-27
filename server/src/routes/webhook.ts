import { Router, raw } from "express";
import { Webhook } from "svix";
import { updateUserFromClerk } from "../modules/user/user.service.js";

const router = Router();

// Clerk envía el body como JSON, pero necesitamos el raw body para verificar la firma.
// Por eso usamos `raw({ type: "application/json" })` en vez del `express.json()` global.
router.post("/clerk", raw({ type: "application/json" }), async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET no está configurado");
    return res.status(500).json({ error: "Webhook secret not configured" });
  }

  // Obtener los headers de verificación de Svix
  const svixId = req.headers["svix-id"] as string;
  const svixTimestamp = req.headers["svix-timestamp"] as string;
  const svixSignature = req.headers["svix-signature"] as string;

  if (!svixId || !svixTimestamp || !svixSignature) {
    return res.status(400).json({ error: "Missing svix headers" });
  }

  // Verificar la firma
  const wh = new Webhook(WEBHOOK_SECRET);
  let event: any;

  try {
    event = wh.verify(req.body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).json({ error: "Invalid webhook signature" });
  }

  // Manejar los eventos
  const { type, data } = event;
  console.log(`Webhook received: ${type}`);

  try {
    if (type === "user.updated") {
      const clerkUserId = data.id as string;
      const firstName = data.first_name as string | null;
      const lastName = data.last_name as string | null;
      const imageUrl = data.image_url as string | null;

      const fullName = [firstName, lastName].filter(Boolean).join(" ") || null;

      await updateUserFromClerk(clerkUserId, {
        name: fullName ?? undefined,
        avatarUrl: imageUrl ?? undefined,
      });

      console.log(`User ${clerkUserId} updated from Clerk webhook`);
    }

    // Puedes agregar más eventos aquí en el futuro:
    // if (type === "user.deleted") { ... }

    return res.json({ received: true });
  } catch (error) {
    console.error(`Error processing webhook ${type}:`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
