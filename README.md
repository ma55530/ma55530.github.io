# Matija Akrap — personal site

Quarto website: blog, publications, CV. LessWrong-style serif theme.

## Set up (one time)

1. Install Quarto: <https://quarto.org/docs/get-started/> (or `brew install --cask quarto`).
2. Replace every `USERNAME` and `EMAIL@example.com` with your values:
   `grep -rn "USERNAME\|EMAIL@\|TODO" --include=*.qmd --include=*.yml .`
3. Replace `files/portrait.heic` with your photo (for example `files/portrait.jpg`) and change the path in `index.qmd`.
4. Make a **public** GitHub repo with the name `USERNAME.github.io`. Push this folder to the `main` branch.
5. Make the `gh-pages` branch one time from your computer:
   ```bash
   quarto publish gh-pages
   ```
6. On GitHub, go to **Settings → Pages**. Set the source to the `gh-pages` branch, folder `/ (root)`.

After this, each push to `main` rebuilds the site automatically (`.github/workflows/publish.yml`).

## Daily use

| Task | How |
|---|---|
| See the site on your computer | `quarto preview` |
| Write a new post | Copy a folder in `posts/`, rename it, edit `index.qmd` |
| Keep a post hidden | Add `draft: true` to its front matter |
| Add a paper | Copy a `.pub` block in `publications.qmd` |
| Update the CV | Edit `cv.qmd`. The PDF is made from the same file |
| Add comments and likes | Follow the steps in `posts/_metadata.yml` (Giscus) |

## Files

```
_quarto.yml         site settings and navigation
styles.scss         theme (fonts, colours, layout)
index.qmd           home page
blog.qmd            list of posts
posts/              one folder for each post
publications.qmd    papers
cv.qmd              CV (HTML page + cv.pdf)
files/              images and other files
```
