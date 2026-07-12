/** Erreur normalisée : la SEULE forme d'erreur qui circule dans l'application. */
export interface ApiError {
  status: number;                        // 0 = erreur réseau (pas de réponse)
  message: string;                       // message affichable à l'utilisateur
  fieldErrors?: Record<string, string>;  // erreurs de validation @Valid du backend
}

/** Page de résultats — correspond au format Page<T> de Spring Data. */
export interface Paginated<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // index de la page courante (base 0 côté Spring)
}