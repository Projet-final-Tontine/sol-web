import { cn } from "@/lib/utils";
import { formatHTG } from "@/lib/formatters";

interface MoneyDisplayProps {
  /** Montant en gourdes. */
  amount: number;
  /** Affiche un signe explicite : +2 500,00 HTG / −2 500,00 HTG */
  signed?: boolean;
  /** Colore selon le signe (vert entrant, rouge sortant). */
  colored?: boolean;
  className?: string;
}

export function MoneyDisplay({
  amount,
  signed = false,
  colored = false,
  className,
}: MoneyDisplayProps) {
  const estPositif = amount >= 0;
  const signe = signed ? (estPositif ? "+" : "−") : "";
  const valeur = formatHTG(Math.abs(amount));

  return (
    <span
      className={cn(
        "tabular-nums",
        colored && (estPositif ? "text-success" : "text-destructive"),
        className
      )}
    >
      {signe}
      {valeur}
    </span>
  );
}