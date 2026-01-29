# Trello Clone - Ultra Modern Kanban Management with AI Integration

A premium, full-stack project management application inspired by Trello. Built with **Next.js 15**, **Supabase**, **Clerk**, and **Google Gemini AI**, this application offers a cutting-edge user experience with real-time updates, intelligent automation, and a stunning dark mode.

## 🚀 Key Features

### 🤖 "Antigravity" AI Assistant (V2)
- **Agentic Intelligence**: Powered by **Google Gemini 2.5 Flash** with resilient fallbacks to **Gemini 2.0** and **Experimental Models**.
- **Context-Aware Actions**: The AI understands your board structure, members, and deadlines. It can execute complex commands like "Move all high-priority tasks to Done" or "Assign all bugs to John."
- **Persistent Memory**: Chat history is synced to Supabase and cached locally (`LocalStorage`) for an **instant-load experience**.
- **Self-Healing**: Automatic model switching ensures uptime even when API rate limits are hit.

### 📋 Core Kanban Experience
- **Interactive Boards**: Create, manage, and customize unlimited boards with smooth drag-and-drop animations (`@dnd-kit`).
- **Advanced Task Management**: Full support for priorities, due dates, assignees, and rich descriptions.
- **Activity Logs**: Detailed audit trail of every action taken on a task.
- **Real-Time Updates**: Changes sync instantly across all clients.

### 🏢 Workspaces & Collaboration
- **Multi-Workspace Architecture**: Organize boards into distinct Workspaces for different teams or projects.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for **Workspace Owners**, **Admins**, and **Members**.
- **Collaborative Comments**: Threaded task discussions with audit logs and history tracking.

### 🎨 Visuals & UX
- **Responsive Design**: Mobile-optimized Navbar and layouts.
- **Task Focus**: Modal-based task editing with optimized scrollable Views for long activity logs.
- **Stunning Dark Mode**: Elegant, eye-friendly interface with automatic theme detection.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **AI Engine**: [Google Gemini AI SDK](https://ai.google.dev/) (Multi-Model Fallback System)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [Supabase (PostgreSQL)](https://supabase.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)

---

## 🏁 Getting Started

### Prerequisites

- Node.js 18.x or later
- A Supabase account
- A Clerk project
- A Google Cloud Project (for Gemini API)

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
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
   CLERK_SECRET_KEY=your_secret
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

   # Google AI
   GOOGLE_AI_API_KEY=your_gemini_api_key
   ```

4. **Initialize Database:**
   Run the SQL scripts in `supabase/migrations/` in your Supabase SQL Editor.
   **Critical:** Ensure to run `fix_chat_rls.sql` to enable Chat Permissions.

5. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [https://trello-clone-ruddy-nine.vercel.app/](https://trello-clone-ruddy-nine.vercel.app/) to see your app in action!

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📬 Contact

Project Link: [https://github.com/HassanGilani11/trello-clone](https://github.com/HassanGilani11/trello-clone)
