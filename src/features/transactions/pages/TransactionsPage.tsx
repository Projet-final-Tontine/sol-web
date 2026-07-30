import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, ArrowDownLeft, ArrowUpRight, RotateCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/shared/DataTable";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateHeure } from "@/lib/formatters";
import { useTransactions } from "../api/use-transactions";
import type { Transaction, TypeTransaction } from "../types";

const PAR_PAGE = 12;

const METHODE_LABEL: Record<string, string> = {
  MONCASH: "MonCash",
  NATCASH: "NatCash",
  ESPECES: "Espèces",
  VIREMENT: "Virement",
};

type TypeConfig = { label: string; icon: LucideIcon; classe: string };

const TYPE_CONFIG: Record<TypeTransaction, TypeConfig> = {
  COTISATION:    { label: "Cotisation",    icon: ArrowDownLeft, classe: "bg-emerald-50 text-emerald-600" },
  DECAISSEMENT:  { label: "Décaissement",  icon: ArrowUpRight,  classe: "bg-sky-50 text-sky-600" },
  REMBOURSEMENT: { label: "Remboursement", icon: RotateCcw,     classe: "bg-amber-50 text-amber-600" },
  PENALITE:      { label: "Pénalité",      icon: AlertTriangle, classe: "bg-red-50 text-red-600" },
};

export default function TransactionsPage() {
  const { data: transactions, isLoading } = useTransactions();

  const [recherche, setRecherche] = useState("");
  const [type, setType] = useState("TOUS");
  const [statut, setStatut] = useState("TOUS");
  const [page, setPage] = useState(0);

  const filtres = useMemo(() => {
    let liste = transactions ?? [];
    if (type !== "TOUS") liste = liste.filter((t) => t.type === type);
    if (statut !== "TOUS") liste = liste.filter((t) => t.statut === statut);
    if (recherche.trim()) {
      const q = recherche.toLowerCase();
      liste = liste.filter(
        (t) =>
          t.reference.toLowerCase().includes(q) ||
          t.membreNom.toLowerCase().includes(q) ||
          t.solNom.toLowerCase().includes(q)
      );
    }
    return liste;
  }, [transactions, type, statut, recherche]);

  const totalPages = Math.ceil(filtres.length / PAR_PAGE);
  const pageActuelle = filtres.slice(page * PAR_PAGE, (page + 1) * PAR_PAGE);

  const resetPage = () => setPage(0);

  const colonnes = useMemo<ColumnDef<Transaction, unknown>[]>(
    () => [
      {
        accessorKey: "reference",
        header: "Transaction",
        cell: ({ row }) => {
          const t = row.original;
          const cfg = TYPE_CONFIG[t.type];
          const Icon = cfg.icon;
          return (
            <div className="flex items-center gap-3">
              <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${cfg.classe}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-mono text-xs font-medium tabular-nums">
                  {t.reference}
                </p>
                <p className="truncate text-xs text-muted-foreground">{cfg.label}</p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "membreNom",
        header: "Membre",
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{row.original.membreNom}</p>
            <p className="truncate text-xs text-muted-foreground">{row.original.solNom}</p>
          </div>
        ),
      },
      {
        accessorKey: "methode",
        header: "Méthode",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {METHODE_LABEL[row.original.methode]}
          </span>
        ),
      },
      {
        accessorKey: "statut",
        header: "Statut",
        cell: ({ row }) => <StatusBadge statut={row.original.statut} />,
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {formatDateHeure(row.original.date)}
          </span>
        ),
      },
      {
        accessorKey: "montant",
        header: "Montant",
        cell: ({ row }) => {
          const t = row.original;
          /* Décaissement = argent qui sort → négatif, en rouge. Le reste entre. */
          const sortant = t.type === "DECAISSEMENT";
          return (
            <MoneyDisplay
              amount={sortant ? -t.montant : t.montant}
              signed
              colored
              className="text-sm font-medium"
            />
          );
        },
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Journal des mouvements financiers de la plateforme."
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Référence, membre, cercle…"
            value={recherche}
            onChange={(e) => {
              setRecherche(e.target.value);
              resetPage();
            }}
            className="pl-9"
          />
        </div>

        <Select
          value={type}
          onValueChange={(v: string | null) => {
            setType(v ?? "TOUS");
            resetPage();
          }}
        >
          <SelectTrigger className="lg:w-44">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TOUS">Tous les types</SelectItem>
            <SelectItem value="COTISATION">Cotisation</SelectItem>
            <SelectItem value="DECAISSEMENT">Décaissement</SelectItem>
            <SelectItem value="REMBOURSEMENT">Remboursement</SelectItem>
            <SelectItem value="PENALITE">Pénalité</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statut}
          onValueChange={(v: string | null) => {
            setStatut(v ?? "TOUS");
            resetPage();
          }}
        >
          <SelectTrigger className="lg:w-44">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TOUS">Tous les statuts</SelectItem>
            <SelectItem value="EN_ATTENTE">En attente</SelectItem>
            <SelectItem value="VALIDE">Validée</SelectItem>
            <SelectItem value="REJETE">Rejetée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={colonnes}
        data={pageActuelle}
        loading={isLoading}
        page={page}
        totalPages={totalPages}
        totalElements={filtres.length}
        onPageChange={setPage}
        emptyTitle="Aucune transaction trouvée"
        emptyDescription="Aucun mouvement ne correspond à ces critères."
      />
    </div>
  );
}