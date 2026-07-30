/** Cible d'une notification. */
export type CibleNotification = "TOUS" | "SOL" | "STATUT";

/** Canal d'envoi. */
export type CanalNotification = "PUSH" | "SMS" | "IN_APP";

/** État de diffusion. */
export type StatutDiffusion = "ENVOYEE" | "PROGRAMMEE" | "ECHOUEE";

export interface Notification {
  id: string;
  titre: string;
  message: string;
  cible: CibleNotification;
  cibleLabel: string;        // "Tous les membres", "Sol Delmas 33"…
  canal: CanalNotification;
  statut: StatutDiffusion;
  nombreDestinataires: number;
  date: string;              // ISO
}

/** Corps de composition d'une nouvelle notification. */
export interface NouvelleNotification {
  titre: string;
  message: string;
  cible: CibleNotification;
  canal: CanalNotification;
}