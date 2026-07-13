import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight, Eye, EyeOff, Landmark, Lock, PiggyBank, ShieldCheck, Target, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ApiError } from "@/types/api";
import { useAuth } from "../hooks/use-auth";
import cochon from "@/assets/cochon.png";

const schema = z.object({
  telephone: z.string().min(1, "Ce champ est requis"),
  motDePasse: z.string().min(1, "Le mot de passe est requis"),
});

type Formulaire = z.infer<typeof schema>;

export default function LoginPage() {
  const { connexion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [voirMdp, setVoirMdp] = useState(false);

  const destination =
    (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  const {
    register, handleSubmit, setError,
    formState: { errors, isSubmitting },
  } = useForm<Formulaire>({ resolver: zodResolver(schema) });

  const onSubmit = async (valeurs: Formulaire) => {
    try {
      await connexion(valeurs);
      navigate(destination, { replace: true });
    } catch (error) {
      setError("root", { message: (error as ApiError).message });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-card shadow-2xl lg:min-h-[660px] lg:grid-cols-2">

        {/* ─────── PANNEAU GAUCHE ─────── */}
        <div className="relative hidden overflow-hidden bg-[#F1EFFD] lg:block">
          <svg className="absolute inset-x-0 top-0 h-36 w-full text-primary/25"
               viewBox="0 0 400 100" preserveAspectRatio="none" fill="currentColor">
            <path d="M0,0 L400,0 L400,55 C290,105 110,15 0,70 Z" />
          </svg>
          <svg className="absolute inset-x-0 top-0 h-28 w-full text-primary"
               viewBox="0 0 400 100" preserveAspectRatio="none" fill="currentColor">
            <path d="M0,0 L400,0 L400,45 C300,95 100,5 0,60 Z" />
          </svg>
          <svg className="absolute inset-x-0 bottom-0 h-40 w-full text-primary/25"
               viewBox="0 0 400 100" preserveAspectRatio="none" fill="currentColor">
            <path d="M0,100 L400,100 L400,45 C280,-5 120,90 0,35 Z" />
          </svg>
          <svg className="absolute inset-x-0 bottom-0 h-28 w-full text-primary"
               viewBox="0 0 400 100" preserveAspectRatio="none" fill="currentColor">
            <path d="M0,100 L400,100 L400,55 C270,5 130,100 0,50 Z" />
          </svg>

          <div className="absolute left-8 top-36 grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="h-1 w-1 rounded-full bg-primary/40" />
            ))}
          </div>

          <div className="absolute left-7 top-1/2 grid h-12 w-12 place-items-center rounded-full bg-white shadow-sm">
            <Landmark className="h-5 w-5 text-primary" />
          </div>
          <div className="absolute right-8 top-[38%] grid h-12 w-12 place-items-center rounded-full bg-white shadow-sm">
            <Target className="h-5 w-5 text-primary" />
          </div>

          <span className="absolute left-10 top-[62%] h-5 w-5 rounded-full border-2 border-primary/30" />
          <span className="absolute right-16 top-28 h-4 w-4 rounded-full border-2 border-primary/25" />

          <div className="relative flex h-full flex-col justify-between p-10">
            <div />

            <img src={cochon} alt="" className="mx-auto w-full max-w-[290px]" />

            <div className="flex items-center gap-5">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white shadow-md">
                <PiggyBank className="h-7 w-7 text-primary" strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <div className="flex items-start gap-4 pl-6">   {/* ajoute pl-6 */}
                <h2 className="text-xl font-bold text-foreground">Bienvenue ! </h2>
                <div className="flex items-start gap-8">   {/* gap-4 → gap-8 */}
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Rejoignez une communauté solidaire<br />
                  et gérez votre épargne en toute{" "}
                  <span className="font-semibold text-primary">simplicité</span>.
                </p>
              </div>
              </div>
              </div>.
            </div>
          </div>
        </div>

        {/* ─────── PANNEAU DROIT ─────── */}
        <div className="relative flex items-center justify-center p-8 lg:p-12">
          <div className="absolute right-8 top-8 hidden grid-cols-5 gap-1.5 lg:grid">
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i} className="h-1 w-1 rounded-full bg-muted-foreground/20" />
            ))}
          </div>

          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-1">
              <p className="text-3xl font-bold tracking-tight text-foreground">
                Sol<span className="text-amber-500">+</span>
              </p>
              <h1 className="pt-2 text-lg font-semibold">Console d'administration</h1>
              <p className="text-sm text-muted-foreground">
                Connectez-vous à votre compte administrateur
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone ou e-mail</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="telephone" autoComplete="username"
                         placeholder="Entrez votre identifiant"
                         className="h-12 pl-10" {...register("telephone")} />
                </div>
                {errors.telephone && (
                  <p className="text-sm text-destructive">{errors.telephone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="motDePasse">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="motDePasse" type={voirMdp ? "text" : "password"}
                         autoComplete="current-password"
                         placeholder="Entrez votre mot de passe"
                         className="h-12 px-10" {...register("motDePasse")} />
                  <button type="button" onClick={() => setVoirMdp((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                          aria-label={voirMdp ? "Masquer" : "Afficher"}>
                    {voirMdp ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.motDePasse && (
                  <p className="text-sm text-destructive">{errors.motDePasse.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="memoriser" defaultChecked />
                  <Label htmlFor="memoriser" className="text-sm font-normal">
                    Se souvenir de moi
                  </Label>
                </div>
                <Link to="/mot-de-passe-oublie"
                      className="text-sm font-medium text-primary hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>

              {errors.root && (
                <p className="rounded-md bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                  {errors.root.message}
                </p>
              )}

              <Button type="submit" disabled={isSubmitting}
                      className="group h-12 w-full justify-center gap-3 text-base">
                <Lock className="h-4 w-4" />
                {isSubmitting ? "Connexion…" : "Se connecter"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                Connexion sécurisée
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-muted/60 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="space-y-0.5">
                <p className="text-sm font-semibold">Vos données sont protégées</p>
                <p className="text-xs text-muted-foreground">
                  Connexion sécurisée avec chiffrement SSL
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}