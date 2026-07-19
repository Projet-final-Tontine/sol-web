import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Search, UserCheck, UserX } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useActiverMembre, useDesactiverMembre, useMembres } from "../api/use-members";
import type { Membre } from "../types";

const PAR_PAGE = 10;

export default function MembersPage() {
  const { data: membres, isLoading } = useMembres();
  const activer = useActiverMembre();
  const desactiver = useDesactiverMembre();

  const [recherche, setRecherche] = useState("");
  const [statut, setStatut] = useState<string>("TOUS");
  const [page, setPage] = useState(0);

  const filtres = useMemo(() => {
    let liste = membres ?? [];
    if (statut !== "TOUS") {
      liste = liste.filter((m) => m.statut === statut);
    }
    if (recherche.trim()) {
      const q = recherche.toLowerCase();
      liste = liste.filter(
        (m) =>
          `${m.prenom} ${m.nom}`.toLowerCase().includes(q) ||
          m.telephone.includes(q) ||
          m.email.toLowerCase().includes(q)
      );
    }
    return liste;
  }, [membres, statut, recherche]);

  const totalPages = Math.ceil(filtres.length / PAR_PAGE);
  const pageActuelle = filtres.slice(page * PAR_PAGE, (page + 1) * PAR_PAGE);

  const colonnes = useMemo<ColumnDef<Membre, unknown>[]>(
    () => [
      {
        accessorKey: "nom",
        header: "Membre",
        cell: ({ row }) => {
          const m = row.original;
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                  {(m.prenom[0] ?? "") + (m.nom[0] ?? "")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {m.prenom} {m.nom}
                </p>
                <p className="truncate text-xs text-muted-foreground">{m.email}</p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "telephone",
        header: "Téléphone",
        cell: ({ row }) => (
          <span className="tabular-nums text-sm">{row.original.telephone}</span>
        ),
      },
      {
        accessorKey: "role",
        header: "Rôle",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">{row.original.role}</span>
        ),
      },
      {
        accessorKey: "statut",
        header: "Statut",
        cell: ({ row }) => <StatusBadge statut={row.original.statut} />,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const m = row.original;
          const estActif = m.statut === "ACTIF";
          return (
            <DropdownMenu>
              <DropdownMenuTrigger className="grid h-8 w-8 place-items-center rounded-md hover:bg-accent">
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {estActif ? (
                  <DropdownMenuItem
                    onClick={() => desactiver.mutate(m.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Bloquer
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => activer.mutate(m.id)}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Activer
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [activer, desactiver]
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Membres" description="Gérez les comptes de la plateforme." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un membre…"
            value={recherche}
            onChange={(e) => {
              setRecherche(e.target.value);
              setPage(0);
            }}
            className="pl-9"
          />
        </div>

        <Select
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
            <SelectItem value="ACTIF">Actif</SelectItem>
            <SelectItem value="EN_ATTENTE">En attente</SelectItem>
            <SelectItem value="BLOQUE">Bloqué</SelectItem>
            <SelectItem value="INACTIF">Inactif</SelectItem>
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
        emptyTitle="Aucun membre trouvé"
        emptyDescription="Aucun compte ne correspond à ces critères."
      />
    </div>
  );
}