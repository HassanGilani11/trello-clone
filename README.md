# Trello Clone - Ultra Modern Kanban Management

A premium, full-stack project management application inspired by Trello. Built with **Next.js 15**, **Supabase**, **Clerk**, and **Google Gemini AI**, this application offers a cutting-edge user experience with real-time updates, intelligent automation, and a stunning dark mode.

## 🚀 Key Features

### 🤖 "Antigravity" AI Assistant
- **Agentic Intelligence**: Powered by **Google Gemini 3 Flash / 2.0 Flash**, Antigravity understands your board context in real-time.
- **Natural Language Actions**: Simply ask the AI to "Change priority of the top task to High" or "Move all done tasks to archive," and it executes the database changes for you.
- **Smart Insights**: Get instant summaries, risk analysis, and bottleneck detection based on your current workload.

### 📋 Core Kanban Experience
- **Interactive Boards**: Create, manage, and customize unlimited boards with smooth drag-and-drop animations (`@dnd-kit`).
- **Advanced Task Management**: Full support for priorities, due dates, assignees, and rich descriptions.
- **Real-Time Updates**: Changes sync instantly across all clients.

### 🏢 Workspaces & Collaboration
- **Multi-Workspace Architecture**: Organize boards into distinct Workspaces for different teams or projects.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for **Worksapce Owners**, **Admins**, and **Members**.
- **Collaborative Comments**: Threaded task discussions with audit logs and history tracking.

### 🎨 Visuals & UX
- **Full-Width Workspace**: Expansive dialog layout for focused task management.
- **Stunning Dark Mode**: Elegant, eye-friendly interface with automatic theme detection.
- **Premium Aesthetics**: Built with Shadcn/UI and Lucide icons for a professional look and feel.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **AI Engine**: [Google Gemini AI SDK](https://ai.google.dev/)
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
   Run the SQL scripts in `schema.sql` and `supabase/migrations/*.sql` in your Supabase SQL Editor.

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
