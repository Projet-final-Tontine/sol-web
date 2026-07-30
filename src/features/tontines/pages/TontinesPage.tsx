import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/shared/DataTable";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useSols } from "../api/use-tontines";
import type { Sol } from "../types";

const PAR_PAGE = 10;

const FREQUENCE_LABEL: Record<string, string> = {
  HEBDOMADAIRE: "Hebdomadaire",
  MENSUEL: "Mensuel",
};

export default function TontinesPage() {
  const { data: sols, isLoading } = useSols();
  const navigate = useNavigate();

  const [recherche, setRecherche] = useState("");
  const [statut, setStatut] = useState("TOUS");
  const [page, setPage] = useState(0);

  // ─── Filtrage côté client ───
  const filtres = useMemo(() => {
    let liste = sols ?? [];
    if (statut !== "TOUS") {
      liste = liste.filter((s) => s.statut === statut);
    }
    if (recherche.trim()) {
      const q = recherche.toLowerCase();
      liste = liste.filter(
        (s) =>
          s.nom.toLowerCase().includes(q) ||
          s.mamanSolNom.toLowerCase().includes(q) ||
          s.codeInvitation.toLowerCase().includes(q)
      );
    }
    return liste;
  }, [sols, statut, recherche]);

  const totalPages = Math.ceil(filtres.length / PAR_PAGE);
  const pageActuelle = filtres.slice(page * PAR_PAGE, (page + 1) * PAR_PAGE);

  // ─── Colonnes ───
  const colonnes = useMemo<ColumnDef<Sol, unknown>[]>(
    () => [
      {
        accessorKey: "nom",
        header: "Cercle",
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{row.original.nom}</p>
            <p className="truncate text-xs tabular-nums text-muted-foreground">
              {row.original.codeInvitation}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "mamanSolNom",
        header: "Manman sol",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.mamanSolNom}</span>
        ),
      },
      {
        accessorKey: "montantCotisation",
        header: "Cotisation",
        cell: ({ row }) => (
          <div>
            <MoneyDisplay
              amount={row.original.montantCotisation}
              className="text-sm font-medium"
            />
            <p className="text-xs text-muted-foreground">
              {FREQUENCE_LABEL[row.original.frequence]}
            </p>
          </div>
        ),
      },
      {
        id: "participants",
        header: "Participants",
        cell: ({ row }) => {
          const { nombreMembres, nombreMaxMembres } = row.original;
          const ratio = nombreMembres / nombreMaxMembres;
          return (
            <div className="w-28">
              <p className="text-sm tabular-nums">
                {nombreMembres}
                <span className="text-muted-foreground"> / {nombreMaxMembres}</span>
              </p>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${ratio * 100}%` }}
                />
              </div>
            </div>
          );
        },
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
        title="Tontines"
        description="Supervisez les cercles de la plateforme."
      />

      {/* ─── Filtres ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un cercle…"
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
            <SelectItem value="TERMINE">Terminé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ─── Tableau ─── */}
      <DataTable
        columns={colonnes}
        data={pageActuelle}
        loading={isLoading}
        page={page}
        totalPages={totalPages}
        totalElements={filtres.length}
        onPageChange={setPage}
        onRowClick={(sol) => navigate(`/tontines/${sol.id}`)}
        emptyTitle="Aucun cercle trouvé"
        emptyDescription="Aucune tontine ne correspond à ces critères."
      />
    </div>
  );
}