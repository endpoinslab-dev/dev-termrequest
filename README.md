# TermQuest — Interactive Shell RPG

A browser-based terminal simulator with gamified missions and interactive command reference for learning Linux, PowerShell, and KQL.

## Prerequisites

- Node.js 18+ and npm
- Git

## Local Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Build

```bash
npm run build
```

Static output goes to `dist/`.

---

## Cloud Deployment

### Netlify (Simplest)

1. Push the repo to GitHub/GitLab
2. Go to [app.netlify.com](https://app.netlify.com) → Add new site → Import from Git
3. Select your repo
4. Set:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **Deploy**

Or via CLI:

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Add new project → Import repo
3. Framework preset auto-detects **Vite**
4. Set output directory to `dist`
5. Click **Deploy**

Or via CLI:

```bash
npm install -g vercel
vercel --prod
```

### AWS S3 + CloudFront

```bash
# 1. Build
npm run build

# 2. Create S3 bucket (must match domain name if using custom domain)
aws s3 mb s3://termquest --region us-east-1
aws s3 website s3://termquest --index-document index.html --error-document index.html

# 3. Upload
aws s3 sync dist/ s3://termquest

# 4. Create CloudFront distribution pointing to the S3 website endpoint
#    (Origin domain: termquest.s3-website-us-east-1.amazonaws.com)
#    (Error pages: 404 → /index.html, 403 → /index.html)

# 5. Invalidate cache on updates
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Azure Static Web Apps

```bash
# 1. Install Azure CLI
# 2. Build
npm run build

# 3. Deploy
swa deploy dist/ --env production
```

Or via the Azure Portal:
1. Create a **Static Web App** resource (Free tier available)
2. Connect your GitHub repo
3. Set build preset to **Vite** (or manually: build command `npm run build`, output `dist`)
4. Azure handles CI/CD automatically on git push

### Docker

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Build and run:

```bash
docker build -t termquest .
docker run -p 8080:80 termquest
```

### GitHub Pages

```bash
npm run build

# Deploy to gh-pages branch
npx gh-pages -d dist
```

Or use the GitHub Actions workflow:

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## Environment Variables

None required. TermQuest runs entirely in the browser with no backend.

---

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3 (cyberpunk dark theme)
- Virtual filesystem shell interpreter (no real shell or xterm.js)
