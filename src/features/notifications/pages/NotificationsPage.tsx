import { useState } from "react";
import {
  Bell, MessageSquare, Plus, Send, Smartphone, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateHeure, formatNombre } from "@/lib/formatters";
import { useEnvoyerNotification, useNotifications } from "../api/use-notifications";
import type { CanalNotification, CibleNotification } from "../types";

const CANAL_LABEL: Record<CanalNotification, string> = {
  PUSH: "Notification push",
  SMS: "SMS",
  IN_APP: "Dans l'application",
};

const CANAL_ICON: Record<CanalNotification, typeof Bell> = {
  PUSH: Bell,
  SMS: Smartphone,
  IN_APP: MessageSquare,
};

/** Mapper le statut de diffusion vers un statut connu du StatusBadge. */
const STATUT_BADGE: Record<string, "VALIDE" | "EN_ATTENTE" | "REJETE"> = {
  ENVOYEE: "VALIDE",
  PROGRAMMEE: "EN_ATTENTE",
  ECHOUEE: "REJETE",
};

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const envoyer = useEnvoyerNotification();

  const [ouvert, setOuvert] = useState(false);
  const [titre, setTitre] = useState("");
  const [message, setMessage] = useState("");
  const [cible, setCible] = useState<CibleNotification>("TOUS");
  const [canal, setCanal] = useState<CanalNotification>("PUSH");

  const peutEnvoyer = titre.trim() !== "" && message.trim() !== "";

  const soumettre = () => {
    envoyer.mutate(
      { titre, message, cible, canal },
      {
        onSuccess: () => {
          setTitre("");
          setMessage("");
          setCible("TOUS");
          setCanal("PUSH");
          setOuvert(false);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Diffusez des messages aux membres de la plateforme."
        actions={
          <Dialog open={ouvert} onOpenChange={setOuvert}>
            <DialogTrigger className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Nouvelle notification
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Nouvelle notification</DialogTitle>
                <DialogDescription>
                  Composez un message et choisissez ses destinataires.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="titre">Titre</Label>
                  <Input
                    id="titre"
                    placeholder="Ex. Rappel de cotisation"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Votre message…"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Destinataires</Label>
                    <Select
                      value={cible}
                      onValueChange={(v: string | null) =>
                        setCible((v as CibleNotification) ?? "TOUS")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TOUS">Tous les membres</SelectItem>
                        <SelectItem value="SOL">Un sol précis</SelectItem>
                        <SelectItem value="STATUT">Par statut</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Canal</Label>
                    <Select
                      value={canal}
                      onValueChange={(v: string | null) =>
                        setCanal((v as CanalNotification) ?? "PUSH")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PUSH">Notification push</SelectItem>
                        <SelectItem value="SMS">SMS</SelectItem>
                        <SelectItem value="IN_APP">Dans l'application</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOuvert(false)}
                  disabled={envoyer.isPending}
                >
                  Annuler
                </Button>
                <Button
                  onClick={soumettre}
                  disabled={!peutEnvoyer || envoyer.isPending}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  {envoyer.isPending ? "Envoi…" : "Envoyer"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* ─── Historique ─── */}
      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : !notifications || notifications.length === 0 ? (
        <Card>
          <EmptyState
            icon={Bell}
            title="Aucune notification"
            description="Composez votre première notification pour les membres."
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const Icon = CANAL_ICON[n.canal];
            return (
              <Card key={n.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold">{n.titre}</h3>
                      <StatusBadge statut={STATUT_BADGE[n.statut]} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {n.cibleLabel} · {formatNombre(n.nombreDestinataires)} destinataire(s)
                      </span>
                      <span>{CANAL_LABEL[n.canal]}</span>
                      <span>{formatDateHeure(n.date)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}