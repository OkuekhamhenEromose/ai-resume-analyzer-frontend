const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

function token() {
  return localStorage.getItem("access_token");
}

async function request(path, opts = {}) {
  const headers = { ...opts.headers };
  if (token()) headers["Authorization"] = `Bearer ${token()}`;
  if (!headers["Content-Type"] && !(opts.body instanceof FormData)) {
  headers["Content-Type"] = "application/json";
}
  const res = await fetch(`${BASE}/api${path}`, { ...opts, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail ?? "Request failed");
  }
  return res.json();
}

export const authApi = {
  register: (email, password, profession) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, profession }),
    }),
  login: (email, password) => {
    const f = new URLSearchParams();
    f.append("username", email);
    f.append("password", password);
    return request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: f.toString(),
    });
  },
  me: () => request("/auth/me"),
};

export const resumeApi = {
  analyze: (file, jobDescription, jobRole = "") => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("job_description", jobDescription);
    if (jobRole) fd.append("job_role", jobRole);
    return request("/resume/analyze", { method: "POST", body: fd });
  },
  regenerate: (analysisId, jobRole, jobDescription) =>
    request("/resume/regenerate", {
      method: "POST",
      body: JSON.stringify({ analysis_id: analysisId, job_role: jobRole, job_description: jobDescription }),
    }),
  history: () => request("/resume/history"),
};
