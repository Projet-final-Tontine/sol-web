import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error(
    "❌ Variables d'environnement invalides :",
    parsed.error.flatten().fieldErrors
  );
  throw new Error("Configuration invalide — vérifie ton fichier .env");
}

export const env = {
  apiUrl: parsed.data.VITE_API_URL,
};