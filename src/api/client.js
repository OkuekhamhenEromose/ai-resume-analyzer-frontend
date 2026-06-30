const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

// Fail loudly during local dev if someone forgets to set the var in prod —
// this only logs a console warning, it does not throw, so it never breaks
// rendering.
if (!BASE && import.meta.env.PROD) {
  console.warn(
    "[ResumeIQ] VITE_API_BASE_URL is not set. All API calls will be sent to " +
    "this site's own origin (e.g. https://your-app.vercel.app/api/...), " +
    "which has no backend and will fail. Set VITE_API_BASE_URL in your " +
    "Vercel project's Environment Variables to your Render backend URL, " +
    "e.g. https://ai-resume-analyzer-backend-l530.onrender.com, then redeploy."
  );
}

function token() {
  return localStorage.getItem("access_token");
}

async function request(path, opts = {}) {
  const headers = { ...opts.headers };
  if (token()) headers["Authorization"] = `Bearer ${token()}`;
  if (!(opts.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  let res;
  try {
    res = await fetch(`${BASE}/api${path}`, { ...opts, headers });
  } catch (networkErr) {
    // fetch() throws (rather than resolving with !ok) on network failures,
    // CORS rejections, DNS errors, and the backend being completely
    // unreachable. Without this catch, that throw can surface as an
    // unhandled promise rejection in places that don't expect it.
    throw new Error(
      `Could not reach the API at ${BASE || "(same origin — VITE_API_BASE_URL is not set)"}. ` +
      `This is usually a CORS or network issue. Original error: ${networkErr.message}`
    );
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: `Request failed (${res.status})` }));
    throw new Error(err.detail ?? `Request failed (${res.status})`);
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