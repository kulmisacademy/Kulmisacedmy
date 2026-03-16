# Kulmis Academy

A modern e-learning platform for high-quality online courses. Learn technology, coding, and digital skills—from AI to Web3—with a clean, engaging experience.

![Kulmis Academy](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)

## Features

- **Clean production state** – No demo or placeholder data; all courses and lessons come from the database
- **Course preview & enrollment** – Full course page (thumbnail, title, instructor, description, price, “What You Will Learn”, curriculum). Locked lessons for non-enrolled students; preview lessons are free to watch. Enroll Now → sign in/register for free courses, or payment request flow for paid courses
- **Student auth** – Register (name, email, phone, password) and Sign in with return-to-course support. Header shows session (name, Sign out) or Sign In / Join for free
- **Paid courses** – Payment instructions (EVC PLUS / DAHABSHIIL), payment request form, confirmation message, Contact on WhatsApp / Call Now. Admin approves or rejects requests; approving creates enrollment
- **Lesson player** – Vimeo-embedded video, curriculum sidebar (desktop left / mobile below), lesson title & description, next-lesson button. Access only when enrolled or lesson is preview
- **Student dashboard – My Courses** – Logged-in students see **My Courses** in the header; page lists only enrolled courses with thumbnail, title, instructor, lesson count, and **Continue Learning** (opens lesson player)
- **Admin dashboard** – Create, edit, delete courses; **course thumbnail upload** (image or URL); add, reorder, delete lessons (with “preview” flag); course table with lesson count; **Payment requests** page (list, approve, reject)
- **Neon PostgreSQL** – Drizzle ORM: users, courses, lessons, enrollments, progress, payment_requests
- **Responsive design** – Tailwind CSS across Courses, Course preview, My Courses, and Lesson player
- **Kulmis branding** – Logo (sky blue + neon pink) in header, footer, and admin sidebar; loading page with neon animation in logo colors

### Logo

Place your **Kulmis Academy** logo image as `public/kulmis-logo.png` to display it in the header, footer, and admin sidebar. If the file is missing, the app shows a text logo in the same colors (K in pink, ULMIS in blue, ACADEMY in pink).

---

## Connect Neon DB and start with Admin

### 1. Create a Neon database

1. Go to [console.neon.tech](https://console.neon.tech) and sign in.
2. Click **New Project** and create a project (e.g. `kulmis-academy`).
3. Open the project, then click **Connect**.
4. Copy the **connection string** (it looks like  
   `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`).

### 2. Configure environment variables

In the project root, create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and set:

- **`DATABASE_URL`** – Your Neon connection string from step 1.
- **`SESSION_SECRET`** – A long random string for sessions (e.g. 32+ characters).
- Optionally **`ADMIN_EMAIL`** and **`ADMIN_PASSWORD`** – Used when creating the first admin (defaults: `admin@kulmis.academy` / `Admin123!`).
- Optionally **`BLOB_READ_WRITE_TOKEN`** – For course thumbnail uploads (Vercel Blob). Without it, admins can still use a thumbnail URL when creating/editing courses.

Example:

```env
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require"
SESSION_SECRET=your-session-secret-min-32-characters-long
ADMIN_EMAIL=admin@kulmis.academy
ADMIN_PASSWORD=Admin123!
```

### 3. Install dependencies and create tables

```bash
npm install
npm run db:init
```

`db:init` creates the tables (users, courses, lessons, enrollments, progress) in your Neon database.

If you prefer Drizzle Kit and it works on your setup, you can use `npm run db:push` instead. If you see *"unknown command 'push'"*, use `npm run db:init` as above.

If you already have the database and only need the new course fields (instructor, learning outcomes), run:

```bash
npm run db:migrate
```

### 4. Create the first admin user

```bash
npm run db:seed
```

This creates an admin user with the email and password from `.env` (or the defaults above). You’ll see a confirmation in the terminal.

### 5. Run the app and sign in

```bash
npm run dev
```

- Open [http://localhost:3000](http://localhost:3000) for the public site.
- Open [http://localhost:3000/admin](http://localhost:3000/admin) and sign in with your admin email and password.

After signing in you’ll see the admin dashboard (courses, lessons, users counts and quick actions).

---

## Getting Started (summary)

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) account (free tier is enough)

### Installation

```bash
cd "KULMIS ACADEMY"
npm install
cp .env.example .env
# Edit .env and add your DATABASE_URL and SESSION_SECRET
npm run db:init
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and [http://localhost:3000/admin](http://localhost:3000/admin).

### Scripts

| Command           | Description                    |
|-------------------|--------------------------------|
| `npm run dev`     | Start dev server               |
| `npm run build`   | Build for production           |
| `npm run start`   | Start production server        |
| `npm run lint`    | Run ESLint                     |
| `npm run db:push` | Push schema via Drizzle Kit (if supported) |
| `npm run db:init` | Create tables in Neon (use this if push fails) |
| `npm run db:migrate` | Add instructor_name & learning_outcomes to existing courses table |
| `npm run db:seed` | Create first admin user        |
| `npm run db:studio` | Open Drizzle Studio (DB UI)  |
| `npm run db:generate` | Generate migrations         |

---

## Project Structure

```
KULMIS ACADEMY/
├── .env.example
├── PRD
├── README.md
├── drizzle.config.ts
├── scripts/
│   └── seed.ts              # Creates first admin user
├── src/
│   ├── app/
│   │   ├── admin/           # Admin login & dashboard
│   │   ├── register/        # Student registration
│   │   ├── signin/          # Student & admin sign in
│   │   ├── join/            # Join for free (register form)
│   │   ├── courses/        # List, [id] preview, [id]/lessons/[lessonId] player
│   │   └── dashboard/       # Courses, payment-requests, etc.
│   ├── components/         # Header, HeaderWithSession, Footer, Hero, etc.
│   └── lib/
│       ├── auth.ts          # Session (student & admin)
│       ├── db.ts            # Neon + Drizzle client
│       ├── schema.ts        # users, courses, lessons, enrollments, payment_requests, progress
│       └── vimeo.ts         # Vimeo embed helpers
├── tailwind.config.ts
├── next.config.mjs
└── package.json
```

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Neon (PostgreSQL) + Drizzle ORM
- **Styling:** Tailwind CSS
- **Language:** TypeScript

---

## Design

The UI follows the Kulmis Academy design with:

- Light blue primary palette and pink/teal accents
- Neon-style animations (glowing borders, icon pulses, gradient text)
- Sections: Hero, Featured Courses, Why Choose Us, Path to Mastery, Testimonials, CTA, Footer

---

## Roadmap (from PRD)

- [x] Neon PostgreSQL + admin dashboard
- [x] Create / edit / delete courses and lessons (admin)
- [x] Public courses listing and course detail (preview) pages
- [x] Student registration and sign in (session-based)
- [x] Course enrollment (free + paid via payment requests)
- [x] Payment requests table and admin approve/reject
- [x] Vimeo video integration in lesson player
- [ ] Student dashboard and progress tracking
- [ ] Certificates, quizzes, comments (future)

---

## License

© 2026 Kulmis Academy. All rights reserved.
#   K u l m i s a c e d m y  
 