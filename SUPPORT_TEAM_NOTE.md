# 🏗️ Deployment Guide & Support Team Note

This document contains all the necessary technical details and credentials required to host the **IKF Induction Portal** on your production server.

---

## 🔑 Project Credentials (Supabase)

These credentials allow the application to securely communicate with the database for content management, employee directory, and CMS functionality.

| Parameter | Value |
| :--- | :--- |
| **Supabase URL** | `https://basnqmmcldjeiftyeorc.supabase.co` |
| **Anon Public Key** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4` |

> [!IMPORTANT]
> These keys are already integrated into `js/supabase-config.js`. No further configuration of keys is required unless the Supabase project changes.

---

## 📁 Project Structure Overview

- `index.html`: Main landing page for the Induction Portal.
- `cms.html`: Content Management System dashboard.
- `js/`: Application logic, Supabase configuration, and UI controllers.
- `css/`: Styling and design system.
- `images/`: Brand assets and static UI images.

---

## 🚀 How to Make it Live

The project is built to be lightweight and compatible with standard web servers (Nginx, Apache, or simple static hosting).

### Option A: Standard Static Hosting (Recommended)
You can directly host the files on any static web server.
1. Copy all project files to the public directory on your server.
2. Ensure the server points to `index.html` as the entry point.
3. **External Dependencies**: The project uses CDNs for Supabase, jQuery, and Tailwind. Ensure the server has outgoing internet access to these CDNs:
   - `cdn.jsdelivr.net`
   - `cdn.tailwindcss.com`
   - `cdnjs.cloudflare.com`

### Option B: Build System (Vite)
If you prefer to bundle the assets for better performance:
1. Ensure **Node.js** is installed on your server/build environment.
2. Run the following commands in the project root:
   ```bash
   npm install
   npx vite build
   ```
3. Deploy the contents of the generated `dist/` folder to your server's public directory.

---

## 🛠️ Maintenance & CMS Access
- **CMS URL**: `[your-domain]/cms.html`
- **Default Access Key**: `admin123` (Configurable in `js/cms-app.js`)
- **CMS Guide**: Refer to `CMS_USER_GUIDE.md` for detailed instructions on managing content.

---

## 📌 Checklist for Support Team
- [ ] Verify `js/supabase-config.js` is correct.
- [ ] Ensure all images in `images/` folder are correctly uploaded.
- [ ] Test the **Employee Directory** search to verify database connectivity.
- [ ] Verify that `cms.html` loads and handles the login correctly.

---
**Support Contact**: Please refer to the developer documentation for any core logic changes.
