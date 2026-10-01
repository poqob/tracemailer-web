# tracemailer-web

Official public landing page and static web portal for **TraceMailer** (https://tracemailer.com / https://www.tracemailer.com).

Optimized for high-performance edge deployment on **Cloudflare Pages**.

---

## 🚀 Key Highlights & Tech Stack

- **Modern Architecture**: Pure edge-ready static delivery powered by Tailwind CSS CDN & Alpine.js.
- **Internationalization (i18n)**: Seamless bilingual support (Turkish `tr` & English `en`) with instant reactivity, client language auto-detection, and local persistence.
- **Interactive Hero Physics**: Smooth physics-based drifting service badges (AWS SES, Gmail, Google, SMTP, TraceMailer, Zoho Mail, iCloud, IMAP, Thunderbird) with dynamic desktop constellation & vertical mobile orientation with touch event repulsion.
- **Viewport Scroll Observer**: How It Works showcase maintains initial architectural diagram until the user scrolls into view, lingering for 5 seconds before engaging automated rotation across high-resolution 2K feature telemetry dashboards.
- **Cloudflare Pages Serverless Edge**: Integrated edge function (`functions/api/contact.js`) for contact form lead processing and proxying.
- **Optimized CDN Caching**: Edge `_headers` and `_redirects` preconfigured for sub-100ms global delivery.

---

## 📁 Project Structure

```
├── index.html                 # Main landing page entry
├── _headers                   # Cloudflare Pages security & caching policies
├── _redirects                 # Edge redirection rules
├── functions/
│   └── api/
│       └── contact.js         # Cloudflare Pages Function for lead submissions
├── static/
│   ├── favicon.svg            # Official brand vector icon
│   ├── favicon.ico
│   ├── og-image.jpg           # 1200x630 Social Graph preview image
│   ├── process-diagram.jpg    # Process pipeline architecture diagram
│   ├── i18n.js                # Core internationalization catalog & reactive driver
│   ├── screenshots/           # 2K UI telemetry showcase screenshots
│   ├── robots.txt             # Search engine crawling directives
│   └── sitemap.xml            # SEO index definitions
├── README.md
```

---

## 🌐 Cloudflare Pages Deployment

1. **Repository**: Connect this GitHub repository (`poqob/tracemailer-web`) to Cloudflare Pages.
2. **Build Settings**:
   - **Framework Preset**: None (Static HTML)
   - **Build Command**: *(leave empty)*
   - **Build Output Directory**: `/` (Root directory)
3. **Custom Domains**:
   - Add `tracemailer.com` and `www.tracemailer.com`.
   - Cloudflare will provision automatic TLS/SSL and HTTP/3 edge routing.

---

## 🛡️ License

Copyright &copy; 2026 TraceMailer. All rights reserved.
