# Trello Clone - Ultra Modern Kanban Management

A premium, full-stack project management application inspired by Trello. Built with **Next.js 15**, **Supabase**, and **Clerk**, this application offers a cutting-edge user experience with real-time updates, advanced RBAC, and a stunning dark mode.

## 🚀 Key Features

### 📋 Core Kanban Experience
- **Interactive Boards**: Create, manage, and customize unlimited boards.
- **Advanced Task Management**: Add tasks with rich descriptions, priorities (Low, Medium, High), due dates, and assignees.
- **Drag & Drop**: Seamlessly move tasks between columns and reorder columns with smooth, intuitive animations powered by `@dnd-kit`.
- **Dynamic Columns**: Fully customizable workflow columns (To Do, In Progress, Done, etc.).

### 🔒 Security & Collaboration
- **Member Management**: Invite other users to your board via email.
- **Role-Based Access (RBAC)**: Fine-grained permissions for Board Owners, Admins, and Members.
- **Database-Level Protection**: Secure PostgreSQL Row Level Security (RLS) ensuring total data isolation between users.
- **Authentication**: Enterprise-grade security with Clerk (Google, GitHub, and Email login).

### 📈 Activity Tracking
- **Audit Logs**: Complete history of task changes, moves, and mentions.
- **Real-time Feed**: See exactly who changed what and when.

### 🎨 Visuals & UX
- **Stunning Dark Mode**: Elegant, eye-friendly interface with automatic theme detection.
- **Premium Aesthetics**: Built with Shadcn/UI and Lucide icons for a professional look and feel.
- **Responsive Design**: Flawless experience across Mobile, Tablet, and Desktop.
- **Advanced Filters**: Find tasks instantly by priority, assignee, or date.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [Supabase (PostgreSQL)](https://supabase.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **State Management**: React Hooks & Context API

---

## 🏁 Getting Started

### Prerequisites

- Node.js 18.x or later
- A Supabase account
- A Clerk project

### Local Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HassanGilani11/trello-clone.git
   cd trello-clone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root:
   ```env
   # Clerk Auth
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Initialize Database:**
   Run the SQL provided in `schema.sql` and the migration files in `supabase/migrations/` within your Supabase SQL Editor.

5. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see your app in action!

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📬 Contact

Project Link: [https://github.com/HassanGilani11/trello-clone](https://github.com/HassanGilani11/trello-clone)
