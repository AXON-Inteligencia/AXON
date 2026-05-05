---
name: testing-dashboard-theme
description: Test visual theme changes on the AXON dashboard. Use when verifying background images, CSS color palettes, or MatrixRain animation colors.
---

# Testing AXON Dashboard Theme

## Setup

1. Install dependencies: `npm install` from the repo root
2. Start dev server: `npm run dev` — runs on `http://localhost:3000`
3. The Vercel preview URL may require Vercel account login. Use localhost for testing instead.

## Key Files

- `client/public/images/hacker-bg.jpg` — Login page background image
- `client/src/index.css` — Global CSS with color references (search for `rgba(` to find theme colors)
- `client/src/components/MatrixRain.tsx` — Falling code animation with `COLORS` array

## Testing Color Changes

### Visual Verification
- Navigate to `http://localhost:3000` to see the login page
- Background image and MatrixRain are visible without authentication
- Check for old color remnants (e.g., cyan `#06b6d4`, green `#22c55e`)

### Programmatic Canvas Verification
Use Playwright via CDP (`http://localhost:29229`) to analyze MatrixRain canvas pixels:

```python
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp('http://localhost:29229')
    context = browser.contexts[0]
    page = context.new_page()
    page.goto('http://localhost:3000')
    time.sleep(3)
    result = page.evaluate('''() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return 'No canvas';
        const ctx = canvas.getContext('2d');
        const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let cyan=false, green=false;
        for (let i=0; i<d.length; i+=4) {
            if (d[i+3]>10) {
                if (d[i+1]>100 && d[i+2]>100 && d[i]<50) cyan=true;
                if (d[i+1]>100 && d[i]<50 && d[i+2]<50) green=true;
            }
        }
        return {cyan, green};
    }''')
    print(result)
    page.close()
```

## Login Testing

- Credentials: Use test credentials provided by the user
- Login form: email + password fields, click "ENTRAR" button
- After login: Dashboard page loads with sidebar navigation (Dashboard, Criar/Editar Play store, Painel Transportadora, Encurtador de link)

## Notes

- The app uses SQLite via sql.js — no external database setup needed
- Background image format must be JPG to match existing `hacker-bg.jpg` reference
- If converting from PNG, use ImageMagick: `convert input.png -quality 92 output.jpg`
- The app might be deployed on Render (`https://axon-3vkg.onrender.com/`) — Render deployments use the production branch, not PR branches
