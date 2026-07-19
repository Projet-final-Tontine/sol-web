/* Formatage centralisé. Un seul endroit pour toute l'application. */

const HTG = new Intl.NumberFormat("fr-HT", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const HTG_COMPACT = new Intl.NumberFormat("fr-HT", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const NOMBRE = new Intl.NumberFormat("fr-HT");

const DATE_COURTE = new Intl.DateTimeFormat("fr-HT", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const DATE_LONGUE = new Intl.DateTimeFormat("fr-HT", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** 2500 → "2 500,00 HTG" */
export const formatHTG = (montant: number) => `${HTG.format(montant)} HTG`;

/** 18450 → "18,5 k" — pour les axes de graphiques */
export const formatHTGCompact = (montant: number) => HTG_COMPACT.format(montant);

/** 1234 → "1 234" */
export const formatNombre = (n: number) => NOMBRE.format(n);

/** 0.925 → "92,5 %" */
export const formatPourcent = (ratio: number) =>
  new Intl.NumberFormat("fr-HT", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(ratio);

/** "2026-07-12T14:30:00" → "12 juil. 2026" */
export const formatDate = (iso: string) => DATE_COURTE.format(new Date(iso));

/** "2026-07-12T14:30:00" → "12 juil. 2026, 14:30" */
export const formatDateHeure = (iso: string) => DATE_LONGUE.format(new Date(iso));