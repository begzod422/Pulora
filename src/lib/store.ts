export type GoalId = "save" | "debt" | "plan" | "family" | "income";

export interface PuloraUser {
  name: string;
  phone: string; // 998XXXXXXXXX
  passwordHash: string;
  verified: boolean;
  goal?: GoalId;
}

const USER_KEY = "pulora_user";
const PENDING_KEY = "pulora_pending";
export const DEVICE_KEY = "pulora_device_seen";

export function getUser(): PuloraUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as PuloraUser) : null;
  } catch {
    return null;
  }
}
export function saveUser(u: PuloraUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(u));
}
export function logout() {
  localStorage.removeItem(USER_KEY);
}

export interface Pending {
  user: PuloraUser;
  token: string;
  exp: number;
  demoCode?: string;
}
export function setPending(p: Pending) {
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(p));
}
export function getPending(): Pending | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as Pending) : null;
  } catch {
    return null;
  }
}
export function clearPending() {
  sessionStorage.removeItem(PENDING_KEY);
}

export async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function getChecklist(goal: string): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(`pulora_check_${goal}`) || "{}");
  } catch {
    return {};
  }
}
export function setChecklist(goal: string, v: Record<string, boolean>) {
  localStorage.setItem(`pulora_check_${goal}`, JSON.stringify(v));
}
