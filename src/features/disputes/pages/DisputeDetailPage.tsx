import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MessageSquarePlus, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateHeure } from "@/lib/formatters";
import {
  useAjouterNote, useChangerStatut, useLitige,
} from "../api/use-disputes";
import type { NoteLitige, StatutLitige } from "../types";

const TYPE_LABEL: Record<string, string> = {
  PAIEMENT: "Paiement", MEMBRE: "Membre", SOL: "Sol", AUTRE: "Autre",
};

export default function DisputeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: litige, isLoading, isError } = useLitige(id);
  const changerStatut = useChangerStatut();
  const ajouterNote = useAjouterNote();

  const [nouveauStatut, setNouveauStatut] = useState<StatutLitige | "">("");
  const [noteStatut, setNoteStatut] = useState("");
  const [nouvelleNote, setNouvelleNote] = useState("");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !litige) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm font-medium">Ce litige est introuvable.</p>
        <Link
          to="/litiges"
          className="mt-4 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Retour à la liste
        </Link>
      </div>
    );
  }

  const appliquerStatut = () => {
    if (!nouveauStatut || !noteStatut.trim()) return;
    changerStatut.mutate(
      { id: litige.id, statut: nouveauStatut, note: noteStatut },
      {
        onSuccess: () => {
          setNouveauStatut("");
          setNoteStatut("");
        },
      }
    );
  };

  const envoyerNote = () => {
    if (!nouvelleNote.trim()) return;
    ajouterNote.mutate(
      { id: litige.id, contenu: nouvelleNote },
      { onSuccess: () => setNouvelleNote("") }
    );
  };

  return (
    <div className="space-y-6">
      <Link
        to="/litiges"
        className="-ml-2 inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Litiges
      </Link>

      {/* En-tête */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{litige.sujet}</h1>
            <StatusBadge statut={litige.statut} />
          </div>
          <p className="font-mono text-sm tabular-nums text-muted-foreground">
            {litige.reference}
          </p>
        </div>
      </div>

      {/* Infos + changement de statut */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-4 p-5 lg:col-span-1">
          <InfoLigne label="Membre" valeur={litige.membreNom} />
          <InfoLigne label="Cercle concerné" valeur={litige.solNom ?? "—"} />
          <InfoLigne label="Type" valeur={TYPE_LABEL[litige.type]} />
          <InfoLigne label="Ouvert le" valeur={formatDateHeure(litige.dateOuverture)} />
        </Card>

        <Card className="space-y-3 p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold">Changer le statut</h3>
          <Select
            value={nouveauStatut}
            onValueChange={(v: string | null) =>
              setNouveauStatut((v as StatutLitige) ?? "")
            }
          >
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="Nouveau statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OUVERT">Ouvert</SelectItem>
              <SelectItem value="EN_COURS">En cours</SelectItem>
              <SelectItem value="RESOLU">Résolu</SelectItem>
              <SelectItem value="REJETE">Rejeté</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Motif du changement (obligatoire)…"
            rows={2}
            value={noteStatut}
            onChange={(e) => setNoteStatut(e.target.value)}
          />
          <Button
            onClick={appliquerStatut}
            disabled={!nouveauStatut || !noteStatut.trim() || changerStatut.isPending}
            className="w-full sm:w-auto"
          >
            {changerStatut.isPending ? "Application…" : "Appliquer"}
          </Button>
        </Card>
      </div>

      {/* Fil de notes */}
      <Card className="p-5">
        <h3 className="text-base font-semibold tracking-tight">Historique du dossier</h3>

        <div className="mt-5 space-y-4">
          {litige.notes.map((note: NoteLitige) => (
            <div key={note.id} className="flex gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{note.auteur}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDateHeure(note.date)}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{note.contenu}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex items-start gap-2">
            <MessageSquarePlus className="mt-2.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <Textarea
              placeholder="Ajouter une note…"
              rows={2}
              value={nouvelleNote}
              onChange={(e) => setNouvelleNote(e.target.value)}
            />
          </div>
          <div className="mt-2 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={envoyerNote}
              disabled={!nouvelleNote.trim() || ajouterNote.isPending}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {ajouterNote.isPending ? "Envoi…" : "Ajouter"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function InfoLigne({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{valeur}</p>
    </div>
  );
}