import { apiRequest } from "@/src/lib/api";
import { bffRequest } from "@/src/lib/bff";

export function registerUser(data) {
  const name =
    data?.name ||
    (data?.email ? data.email.split("@")[0] : null) ||
    "User";
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: { ...data, name },
  });
}

export function loginUser(data) {
  return bffRequest("/api/auth/login", {
    method: "POST",
    body: data,
  });
}

export function logoutUser() {
  return bffRequest("/api/auth/logout", {
    method: "POST",
  });
}

export function getCurrentUser() {
  return bffRequest("/api/auth/me", {
    method: "GET",
  });
}
