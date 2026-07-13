import type { ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { EmptyState } from "./EmptyState";

interface DataTableProps<T> {
  /** Définition des colonnes (voir "En usage"). */
  columns: ColumnDef<T, unknown>[];
  /** Les lignes de la page courante. */
  data: T[];
  loading?: boolean;
  /** Clic sur une ligne → ouvrir le détail. */
  onRowClick?: (row: T) => void;

  /* ─── Pagination serveur (optionnelle) ─── */
  page?: number;          // index base 0, comme Spring
  totalPages?: number;
  totalElements?: number;
  onPageChange?: (page: number) => void;

  /* ─── État vide ─── */
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  onRowClick,
  page,
  totalPages,
  totalElements,
  onPageChange,
  emptyTitle = "Aucun résultat",
  emptyDescription,
  emptyAction,
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // le serveur pagine, pas nous
  });

  const avecPagination =
    page !== undefined && totalPages !== undefined && onPageChange !== undefined;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          {/* ─── En-têtes ─── */}
          <TableHeader>
            {table.getHeaderGroups().map((groupe) => (
              <TableRow key={groupe.id} className="hover:bg-transparent">
                {groupe.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* ─── Corps ─── */}
          <TableBody>
            {loading ? (
              /* Chargement : 5 lignes squelettes */
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j} className="h-14">
                      <Skeleton className="h-4 w-full max-w-[140px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              /* Vide : une seule cellule sur toute la largeur */
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="p-0">
                  <EmptyState
                    icon={Inbox}
                    title={emptyTitle}
                    description={emptyDescription}
                    action={emptyAction}
                  />
                </TableCell>
              </TableRow>
            ) : (
              /* Données */
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={onRowClick ? "cursor-pointer" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="h-14">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ─── Pagination ─── */}
      {avecPagination && !loading && data.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page <span className="font-medium text-foreground">{page + 1}</span>{" "}
            sur {totalPages}
            {totalElements !== undefined && (
              <>
                {" "}— <span className="tabular-nums">{totalElements}</span>{" "}
                résultat{totalElements > 1 ? "s" : ""}
              </>
            )}
          </p>

          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => onPageChange(page + 1)}
            >
              Suivant
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}