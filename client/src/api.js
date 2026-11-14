
const API = (
  import.meta.env.VITE_API_URL ||
  "https://online-course-management-2.onrender.com/api"
).replace(/\/$/, "");

export function getToken() {
  return localStorage.getItem("learnhub_token");
}

export async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}
