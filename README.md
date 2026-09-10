# Yagya Mahajan — Personal Portfolio & CMS

A sleek, high-performance, strictly monochrome dark-mode developer portfolio web application built with React, Vite, and Tailwind CSS, featuring an integrated protected administrative dashboard (`/admin` and `?admin`), instant real-time data persistence via LocalStorage, and a minimalist design system inspired by modern engineering aesthetics.

---

## ✦ Key Features

### 1. Minimalist Monochrome Dark Design System
- **Obsidian & Charcoal Palette**: Strict monochrome design (`#070707`, `#0c0c0f`, `#141414`, `#202020`) with subtle borders and zero vibrant color noise.
- **Glassmorphism**: Backdrop blur cards with micro-interactions, subtle borders, and smooth hover elevation.
- **Interactive Ambient Canvas**: Subtle floating particles and ambient gradients.

### 2. Core Sections
- **Hero Section**: Dynamic role kicker, live IST clock, bento metrics grid, primary stack cloud, and guiding principles quote slider.
- **Journey Timeline**: Chronological track of professional experience and academic education with ATS resume download triggers.
- **Skillset Matrix**: Filterable matrix across Frontend, Backend & Cloud, AI & Data Science, and Tools & Systems.
- **Curated Projects**: Filter pills by stack tags, live real-time search, featured tags, GitHub repository and Live demo links.
- **Technical Articles & Verified Credentials**: Blog insights modal reader, hackathon highlights, and certificate links.
- **Contact Channel**: Validated submission form storing visitor inquiries in the Admin inbox, confetti micro-interaction, and direct developer links.

### 3. Protected Admin Panel (`/admin` & `?admin`)
- **Access Control**: Protected by passphrase (`Yagy@1605`).
- **Profile & Bio Manager**: Update personal details, bio, role, status banner, and social links.
- **Projects Manager**: Add, edit, tag, feature, or remove projects.
- **Skills Matrix Manager**: Add technologies and define custom categories.
- **Milestones Manager**: Manage experience and education records.
- **Visitor Inquiries Log**: View and manage visitor submissions sent via the contact form.
- **Database & Backup**: 1-click JSON backup export, import, and reset to defaults.

---

## ✦ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Effects**: Canvas Confetti, HTML5 Canvas Particle Engine
- **State & Storage**: React Context API + LocalStorage persistence

---

## ✦ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## ✦ Admin Access
Navigate to `http://localhost:3000/?admin` or click the lock icon in the navigation bar. Enter password: `Yagy@1605` (or configured via `VITE_ADMIN_PASSWORD`).