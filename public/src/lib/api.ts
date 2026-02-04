export async function api(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(path, {
    ...options,
    credentials: "include",
    headers,
  });

  if (!res.ok) throw new Error(await res.text());
  if (res.status === 204) return null;
  return res.json();
}
