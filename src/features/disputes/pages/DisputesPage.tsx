import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/formatters";
import { useLitiges } from "../api/use-disputes";
import type { Litige } from "../types";

const PAR_PAGE = 10;

const TYPE_LABEL: Record<string, string> = {
  PAIEMENT: "Paiement",
  MEMBRE: "Membre",
  SOL: "Sol",
  AUTRE: "Autre",
};

export default function DisputesPage() {
  const { data: litiges, isLoading } = useLitiges();
  const navigate = useNavigate();

  const [recherche, setRecherche] = useState("");
  const [statut, setStatut] = useState("TOUS");
  const [page, setPage] = useState(0);

  const filtres = useMemo(() => {
    let liste = litiges ?? [];
    if (statut !== "TOUS") liste = liste.filter((l) => l.statut === statut);
    if (recherche.trim()) {
      const q = recherche.toLowerCase();
      liste = liste.filter(
        (l) =>
          l.reference.toLowerCase().includes(q) ||
          l.sujet.toLowerCase().includes(q) ||
          l.membreNom.toLowerCase().includes(q)
      );
    }
    return liste;
  }, [litiges, statut, recherche]);

  const totalPages = Math.ceil(filtres.length / PAR_PAGE);
  const pageActuelle = filtres.slice(page * PAR_PAGE, (page + 1) * PAR_PAGE);

  const colonnes = useMemo<ColumnDef<Litige, unknown>[]>(
    () => [
      {
        accessorKey: "reference",
        header: "Litige",
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{row.original.sujet}</p>
            <p className="truncate font-mono text-xs tabular-nums text-muted-foreground">
              {row.original.reference}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "membreNom",
        header: "Membre",
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate text-sm">{row.original.membreNom}</p>
            <p className="truncate text-xs text-muted-foreground">
              {row.original.solNom ?? "—"}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {TYPE_LABEL[row.original.type]}
          </span>
        ),
      },
      {
        accessorKey: "dateOuverture",
        header: "Ouvert le",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {formatDate(row.original.dateOuverture)}
          </span>
        ),
      },
      {
        accessorKey: "statut",
        header: "Statut",
        cell: ({ row }) => <StatusBadge statut={row.original.statut} />,
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Litiges"
        description="Traitez les réclamations des membres."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Référence, sujet, membre…"
            value={recherche}
            onChange={(e) => {
              setRecherche(e.target.value);
              setPage(0);
            }}
            className="pl-9"
          />
        </div>

        <Select
          value={statut}
          onValueChange={(v: string | null) => {
            setStatut(v ?? "TOUS");
            setPage(0);
          }}
        >
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TOUS">Tous les statuts</SelectItem>
            <SelectItem value="OUVERT">Ouvert</SelectItem>
            <SelectItem value="EN_COURS">En cours</SelectItem>
            <SelectItem value="RESOLU">Résolu</SelectItem>
            <SelectItem value="REJETE">Rejeté</SelectItem>
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
        onRowClick={(litige) => navigate(`/litiges/${litige.id}`)}
        emptyTitle="Aucun litige"
        emptyDescription="Aucune réclamation ne correspond à ces critères."
      />
    </div>
  );
}