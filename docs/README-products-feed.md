# itch.io → BabyLoveGrowth product feed

`products.xml` in this folder is generated automatically from the itch.io
API and served by GitHub Pages. BabyLoveGrowth reads it from:

    https://bmw8520.github.io/rpgmakermarket/products.xml

## One-time setup

1. **Add the files** from this bundle to the repo root, keeping the folder
   structure (`scripts/`, `.github/workflows/`, `docs/`).
2. **Add the itch.io key as a secret**
   GitHub → repo → Settings → Secrets and variables → Actions →
   *New repository secret* → Name `ITCH_API_KEY`, Value = the key from
   itch.io → Account settings → API keys.
3. **Turn on GitHub Pages**
   Settings → Pages → Source: *Deploy from a branch* → Branch `main`,
   folder `/docs` → Save.
4. **Run the workflow once**
   Actions tab → *Build itch.io product feed* → *Run workflow*.
   After it finishes, `docs/products.xml` appears in the repo and
   Pages publishes it within a minute or two.
5. **Connect BabyLoveGrowth**
   Product Catalog → *XML Feed (URL)* → paste the URL above.

The workflow then re-runs every day at 02:17 UTC and commits a new
`products.xml` only when something on itch.io changed.

## Notes

- The key never leaves GitHub's secret store; the feed contains only
  public store data (title, link, description, cover image, price).
- Free / pay-what-you-want products are listed at `0.00 USD` with a note
  in the description.
- Unpublished (draft) projects are skipped.
- To change the store name or description at the top of the feed, edit
  the constants at the top of `scripts/build_products_feed.py`.
