/**
 * Minimal GitHub Contents API client — the repo itself is the database.
 * Env: GITHUB_TOKEN (fine-grained, Contents: read/write), GITHUB_REPO ("owner/name"), GITHUB_BRANCH (default "main").
 */
const API = "https://api.github.com";

function cfg() {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO || "zamsaalbertdaniel/AI-PRESS";
    const branch = process.env.GITHUB_BRANCH || "main";
    return { token, repo, branch };
}

export function githubEnabled(): boolean {
    return Boolean(process.env.GITHUB_TOKEN);
}

async function gh(path: string, init: RequestInit = {}) {
    const { token } = cfg();
    if (!token) throw new Error("Missing env: GITHUB_TOKEN");
    const res = await fetch(`${API}${path}`, {
        ...init,
        cache: "no-store",
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
            ...(init.headers || {}),
        },
    });
    return res;
}

export async function ghGetFile(path: string): Promise<{ sha: string; content: Buffer } | null> {
    const { repo, branch } = cfg();
    const res = await gh(`/repos/${repo}/contents/${path}?ref=${branch}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GitHub read failed [${res.status}]: ${await res.text()}`);
    const j = await res.json();
    return { sha: j.sha, content: Buffer.from(j.content, "base64") };
}

export async function ghListDir(path: string): Promise<string[]> {
    const { repo, branch } = cfg();
    const res = await gh(`/repos/${repo}/contents/${path}?ref=${branch}`);
    if (res.status === 404) return [];
    if (!res.ok) throw new Error(`GitHub list failed [${res.status}]: ${await res.text()}`);
    const j = (await res.json()) as Array<{ name: string; type: string }>;
    return j.filter((f) => f.type === "file").map((f) => f.name);
}

export async function ghPutFile(path: string, content: Buffer | string, message: string): Promise<void> {
    const { repo, branch } = cfg();
    const existing = await ghGetFile(path);
    const body = {
        message,
        branch,
        content: Buffer.isBuffer(content) ? content.toString("base64") : Buffer.from(content).toString("base64"),
        ...(existing ? { sha: existing.sha } : {}),
    };
    const res = await gh(`/repos/${repo}/contents/${path}`, { method: "PUT", body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`GitHub write failed [${res.status}]: ${await res.text()}`);
}

export async function ghDeleteFile(path: string, message: string): Promise<void> {
    const { repo, branch } = cfg();
    const existing = await ghGetFile(path);
    if (!existing) return;
    const res = await gh(`/repos/${repo}/contents/${path}`, {
        method: "DELETE",
        body: JSON.stringify({ message, branch, sha: existing.sha }),
    });
    if (!res.ok) throw new Error(`GitHub delete failed [${res.status}]: ${await res.text()}`);
}
