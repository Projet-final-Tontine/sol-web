const STORAGE_KEY = "sol_admin_token";

let accessToken: string | null = localStorage.getItem(STORAGE_KEY);

export const tokenStore = {
  get: () => accessToken,
  set: (token: string) => {
    accessToken = token;
    localStorage.setItem(STORAGE_KEY, token);
  },
  clear: () => {
    accessToken = null;
    localStorage.removeItem(STORAGE_KEY);
  },
};