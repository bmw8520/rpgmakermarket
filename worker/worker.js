/**
 * BabyLoveGrowth → GitHub Pages publisher (Cloudflare Worker)
 *
 * BLG POSTs a finished article here. The worker verifies the shared secret,
 * turns the article into a Jekyll post, and commits it to
 * docs/_posts/<date>-<slug>.md in the GitHub repo. GitHub Pages rebuilds the
 * blog automatically.
 *
 * Secrets (Worker → Settings → Variables and Secrets):
 *   GITHUB_TOKEN  fine-grained PAT with Contents: Read and write on the repo
 *   BLG_SECRET    any long random string; paste the same value into BLG's
 *                 webhook "Bearer token" field
 *
 * Plain variables (same screen, type "Text"):
 *   REPO          bmw8520/rpgmakermarket
 *   BRANCH        main
 *   POSTS_DIR     docs/_posts
 *   SITE_URL      https://bmw8520.github.io/rpgmakermarket
 */

const GITHUB_API = "https://api.github.com";

export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return json({ ok: true, service: "blg-github-publisher" });
    }
    if (request.method !== "POST") {
      return json({ error: "method not allowed" }, 405);
    }

    // --- auth: Authorization: Bearer <BLG_SECRET> (or x-api-key) ---
    const auth = request.headers.get("authorization") || "";
    const bearer = auth.replace(/^Bearer\s+/i, "").trim();
    const apiKey = (request.headers.get("x-api-key") || "").trim();
    if (!env.BLG_SECRET || (bearer !== env.BLG_SECRET && apiKey !== env.BLG_SECRET)) {
      return json({ error: "unauthorized" }, 401);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "body must be JSON" }, 400);
    }
    // Some senders wrap the article: {"article": {...}} or {"data": {...}}
    const a = payload.article || payload.data || payload.post || payload;

    const title = pick(a, ["title", "headline"]);
    if (!title) {
      return json(
        { error: "no title field found", received_keys: Object.keys(a) },
        400,
      );
    }

    const markdown = pick(a, ["content_markdown", "contentMarkdown", "markdown"]);
    const html = pick(a, ["content_html", "contentHtml", "html", "content", "body"]);
    const description = pick(a, [
      "metaDescription", "meta_description", "description", "excerpt", "summary",
    ]);
    const hero = pick(a, ["heroImageUrl", "hero_image_url", "featured_image", "image", "cover"]);
    const status = (pick(a, ["status"]) || "publish").toLowerCase();
    const rawSlug = pick(a, ["slug"]) || title;
    const slug = slugify(rawSlug);
    const tags = toList(pick(a, ["tags", "keywords"]));
    const categories = toList(pick(a, ["categories", "category"]));

    const body = markdown || html || "";
    if (!body) {
      return json({ error: "no content field found", received_keys: Object.keys(a) }, 400);
    }

    const repo = env.REPO || "bmw8520/rpgmakermarket";
    const branch = env.BRANCH || "main";
    const postsDir = (env.POSTS_DIR || "docs/_posts").replace(/\/+$/, "");
    const siteUrl = (env.SITE_URL || "https://bmw8520.github.io/rpgmakermarket").replace(/\/+$/, "");

    // --- find an existing post with this slug so updates overwrite, not duplicate ---
    const existing = await findExistingPost(env, repo, branch, postsDir, slug);
    const today = new Date().toISOString().slice(0, 10);
    const path = existing ? existing.path : `${postsDir}/${today}-${slug}.md`;
    const dateInName = path.split("/").pop().slice(0, 10);

    const frontMatter = [
      "---",
      "layout: post",
      `title: ${yamlStr(title)}`,
      `date: ${dateInName}`,
      description ? `description: ${yamlStr(description)}` : null,
      hero ? `image: ${yamlStr(hero)}` : null,
      tags.length ? `tags: [${tags.map(yamlStr).join(", ")}]` : null,
      categories.length ? `categories: [${categories.map(yamlStr).join(", ")}]` : null,
      status === "draft" || status === "pending" ? "published: false" : null,
      "source: babylovegrowth",
      "---",
      "",
    ].filter((l) => l !== null).join("\n");

    const content = frontMatter + body.trim() + "\n";

    // --- commit via GitHub Contents API ---
    const putBody = {
      message: `${existing ? "Update" : "Add"} article: ${title}`,
      content: b64(content),
      branch,
    };
    if (existing) putBody.sha = existing.sha;

    const res = await gh(env, `/repos/${repo}/contents/${encodePath(path)}`, {
      method: "PUT",
      body: JSON.stringify(putBody),
    });

    if (!res.ok) {
      const text = await res.text();
      return json({ error: "github commit failed", status: res.status, detail: text }, 502);
    }

    const postUrl = `${siteUrl}/blog/${slug}/`;
    return json({
      ok: true,
      action: existing ? "updated" : "created",
      path,
      url: postUrl,
      published: !(status === "draft" || status === "pending"),
    });
  },
};

// ---------- helpers ----------

async function findExistingPost(env, repo, branch, postsDir, slug) {
  const res = await gh(env, `/repos/${repo}/contents/${encodePath(postsDir)}?ref=${branch}`);
  if (!res.ok) return null; // folder may not exist yet
  const files = await res.json();
  if (!Array.isArray(files)) return null;
  const suffix = `-${slug}.md`;
  const hit = files.find((f) => f.type === "file" && f.name.endsWith(suffix));
  return hit ? { path: hit.path, sha: hit.sha } : null;
}

function gh(env, apiPath, init = {}) {
  return fetch(GITHUB_API + apiPath, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "blg-github-publisher",
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
}

function pick(obj, keys) {
  for (const k of keys) {
    const v = obj[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return "";
}

function toList(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  return String(v).split(",").map((s) => s.trim()).filter(Boolean);
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "post";
}

function yamlStr(s) {
  return JSON.stringify(String(s)); // JSON strings are valid YAML double-quoted scalars
}

function encodePath(p) {
  return p.split("/").map(encodeURIComponent).join("/");
}

function b64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (const byte of bytes) bin += String.fromCharCode(byte);
  return btoa(bin);
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
