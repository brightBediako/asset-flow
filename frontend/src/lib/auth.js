const AUTH_STORAGE_KEY = "assetflow_auth";

function normalizeRoleName(role) {
  return String(role || "").trim().toUpperCase();
}

export function setAuth(auth) {
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function getAuth() {
  const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearAuth() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isAuthenticated() {
  const auth = getAuth();
  return Boolean(auth?.email);
}

export function getUserRole() {
  const auth = getAuth();
  const role = normalizeRoleName(auth?.role);
  return role || null;
}

export function hasAnyRole(roles = []) {
  const allowed = roles.map((role) => normalizeRoleName(role));
  const role = getUserRole();
  return Boolean(role && allowed.includes(role));
}

export function isAdminRole() {
  return hasAnyRole(["SUPER_ADMIN", "ORG_ADMIN"]);
}

export function getCurrentUserId() {
  const auth = getAuth();
  return auth?.id ?? null;
}
