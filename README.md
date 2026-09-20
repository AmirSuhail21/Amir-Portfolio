# Amir Suhail — Developer Portfolio

A modern, responsive and dynamic developer portfolio built with **Next.js, TypeScript, Tailwind CSS and Supabase**.

The portfolio showcases my projects, technical skills, professional experience, education and client work through a clean and modern interface with **Dark Mode / Light Mode** support.

---

## 🌐 Live Website

**Portfolio:**  
https://amir-portfolio-ashy.vercel.app/

---

## ✨ Features

- Modern and responsive portfolio design
- Dark Mode / Light Mode
- Dynamic profile information
- Dynamic skills management
- Dynamic project management
- Project categories / types
- Project images
- Live project URLs
- GitHub project URLs
- Featured projects
- Education management
- Professional experience management
- Resume management
- Admin authentication
- Secure admin dashboard
- Supabase database integration
- Supabase Storage for images and resume
- Responsive desktop and mobile layout
- SEO configuration
- Sitemap and robots configuration
- Google Search Console verification
- Contact form
- Social media integration

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Next Themes

### Backend / Database

- Next.js Server Components
- Next.js API / Server functionality
- Supabase
- PostgreSQL
- Supabase Authentication
- Supabase Storage
- Row Level Security (RLS)

### Deployment

- Vercel
- GitHub

---

## 📁 Project Structure

```text
amir-portfolio/
│
├── app/
│   ├── admin/
│   │   ├── education/
│   │   ├── experience/
│   │   ├── forgot-password/
│   │   ├── login/
│   │   ├── profile/
│   │   ├── projects/
│   │   ├── reset-password/
│   │   ├── skills/
│   │   └── page.tsx
│   │
│   ├── api/
│   │
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
│
├── components/
│   ├── admin/
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── ContactForm.tsx
│   ├── Experience.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── Projects.tsx
│   ├── Skills.tsx
│   └── ...
│
├── lib/
│   ├── supabase.ts
│   └── supabase-server.ts
│
├── public/
│   ├── icons/
│   └── ...
│
├── .env.local
├── middleware.ts
├── next.config.ts
├── package.json
└── README.md
