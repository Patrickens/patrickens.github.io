# Personal Website (GitHub Pages)

Simple static personal website with:

- About section
- Downloadable CV
- Research links
- Blog post highlights

## Local preview

From this folder run:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

1. Create a new GitHub repository.
2. Upload all files from this folder.
3. In GitHub, open **Settings -> Pages**.
4. Under **Build and deployment**, choose:
   - **Source:** Deploy from a branch
   - **Branch:** `main` (or `master`) and `/ (root)`
5. Save and wait ~1 minute.
6. Your site will appear at:
   - `https://<your-username>.github.io/<repo-name>/`

If you name the repo `<your-username>.github.io`, the site URL becomes:

- `https://<your-username>.github.io/`

## Customize quickly

- Update layout/content in `index.html`
- Update styles in `css/main.css`
- Update behavior/animations in `js/tabs.js` and `js/animations.js`
- Replace `Thomas_Diederen_CV.pdf` with your latest CV PDF (keep same filename)
- Blog posts live in `blog/posts/` (current post: `blog/posts/hybrid-modeling/`)
