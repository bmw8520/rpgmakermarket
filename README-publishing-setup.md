# BabyLoveGrowth → GitHub Pages blog (rpgmakermarket)

How it works:

    BabyLoveGrowth (Webhook) → Cloudflare Worker → commit to docs/_posts/ → GitHub Pages rebuilds
                                                                              ↓
                                            https://bmw8520.github.io/rpgmakermarket/blog/<slug>/

Three places to touch, in this order: GitHub, Cloudflare, BabyLoveGrowth.

---

## 1. GitHub — add the blog files and a token

### 1a. Upload the `docs` folder from this bundle
Repo → **Add file → Upload files** → drag the `docs` folder in → Commit.
It adds `docs/_config.yml`, `docs/index.md` and `docs/_posts/2026-10-24-welcome.md`
next to the `products.xml` already there. Nothing is overwritten.

After the Pages rebuild (1–2 min) the blog is live at
https://bmw8520.github.io/rpgmakermarket/ with the welcome post.

### 1b. Create a fine-grained token for the worker
GitHub (top-right avatar) → **Settings → Developer settings → Personal access
tokens → Fine-grained tokens → Generate new token**

- Token name: `blg-publisher`
- Expiration: 1 year (set a reminder; the worker stops when it expires)
- Repository access: **Only select repositories → rpgmakermarket**
- Permissions → Repository permissions → **Contents: Read and write**
  (everything else stays "No access")
- Generate, then copy the token — it is shown once.

---

## 2. Cloudflare — create the worker

1. https://dash.cloudflare.com → sign up / log in (free plan is enough).
2. **Workers & Pages → Create → Create Worker** → name it `blg-publisher` → Deploy.
3. Click **Edit code**, delete the sample, paste the contents of
   `worker/worker.js`, click **Deploy**.
4. **Settings → Variables and Secrets → Add**, one at a time:

   | Type   | Name           | Value                                         |
   |--------|----------------|-----------------------------------------------|
   | Secret | `GITHUB_TOKEN` | the token from 1b                             |
   | Secret | `BLG_SECRET`   | any long random string you make up (30+ chars)|
   | Text   | `REPO`         | `bmw8520/rpgmakermarket`                      |
   | Text   | `BRANCH`       | `main`                                        |
   | Text   | `POSTS_DIR`    | `docs/_posts`                                 |
   | Text   | `SITE_URL`     | `https://bmw8520.github.io/rpgmakermarket`    |

   Save / Deploy after adding them.
5. Copy the worker URL shown on its overview page, e.g.
   `https://blg-publisher.<your-account>.workers.dev`
   Open it in a browser — you should see `{"ok": true, ...}`.

---

## 3. BabyLoveGrowth — connect the webhook

Publishing → **For developers → Webhook → + Connect**

- Webhook URL: the worker URL from step 2.5
- Bearer token / secret: the exact `BLG_SECRET` value you set in Cloudflare

Save, then turn **Automatically Publish** on at the top of the page.

If BLG offers a "send test" button, use it. Otherwise trigger a test yourself
from PowerShell (replace the two placeholders):

    $u = "https://blg-publisher.YOUR-ACCOUNT.workers.dev"
    $h = @{ Authorization = "Bearer YOUR_BLG_SECRET"; "Content-Type" = "application/json" }
    $b = '{"title":"Webhook test post","slug":"webhook-test","content_markdown":"It works.","status":"draft"}'
    Invoke-RestMethod -Method Post -Uri $u -Headers $h -Body $b

A JSON reply with `"ok": true` means a file landed in `docs/_posts/`.
(`status: draft` keeps it off the public site; delete the file afterwards.)

---

## What the worker does with each article

- Reads `title`, `slug`, `content_markdown` or `content_html`,
  `metaDescription`, `heroImageUrl`, `status`, `tags` — tolerant of the
  common spelling variants.
- Writes `docs/_posts/<date>-<slug>.md` with Jekyll front matter.
- If a post with the same slug already exists, it updates that file
  instead of creating a duplicate (so BLG re-sends are safe).
- `status: draft` or `pending` → `published: false` (stored, not shown).
- Returns `400` with the list of field names it received if it can't find
  a title or body — if that ever happens, send that JSON to Claude and the
  field mapping can be adjusted in a minute.

## Where to look when something's off

- Worker → **Logs** tab (turn on "Real-time logs" before triggering a test).
- Repo → **Actions** → "pages build and deployment" must go green after each
  article; a red run usually means a front-matter character Jekyll didn't like.
