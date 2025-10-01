# AppliStash

> Your secret stash for job applications - track, organize, and conquer your job hunt!

AppliStash is a Chrome extension and companion web app that helps you track job applications, interviews, and contacts directly from the websites where you apply. It features a modern dashboard with both normal and calendar views, making it easy to manage your entire job search process.

## Features

- **One-Click Save**: Chrome extension injects an overlay on job sites
- **Smart Tracking**: Track application status from saved to offer with drag-and-drop Kanban board
- **Interview Management**: Schedule and track interviews with both list and calendar views
- **Contact Management**: Keep track of recruiters and hiring managers
- **Dashboard Insights**: Comprehensive web dashboard with modern UI
- **Seamless Integration**: Works directly on job sites you already use
- **Collapsible Sidebar**: Clean navigation that expands on hover
- **Built with React**: Modern, responsive UI for both extension and web app

## Project Structure

```
appli_stash/
├── apps/
│   ├── web/               # Main Next.js web application
│   │   ├── app/
│   │   │   ├── api/       # API routes (application, contact, interview, auth)
│   │   │   ├── dashboard/ # Dashboard with Kanban board
│   │   │   ├── contacts/  # Contact management page
│   │   │   ├── interviews/# Interview management with calendar view
│   │   │   ├── login/     # Login page
│   │   │   ├── register/  # Registration page
│   │   │   ├── layout.tsx # Root layout
│   │   │   └── page.tsx   # Home page
│   │   ├── components/
│   │   │   ├── context/   # User context provider
│   │   │   ├── forms/     # Application, Contact, Interview forms
│   │   │   ├── layout/    # Header, Footer, Sidebar, MainLayout
│   │   │   ├── board/     # Kanban board and item components
│   │   │   ├── calendar/  # Calendar view for interviews
│   │   │   └── ui/        # UI components
│   │   ├── lib/           # Utility libraries (encryption, JWT, Supabase)
│   │   ├── types/         # TypeScript type definitions
│   │   ├── public/
│   │   ├── next.config.ts
│   │   └── .env           # Environment variables
│   └── extension/         # Chrome extension
│       ├── src/
│       │   ├── config/    # API configuration
│       │   ├── popup/     # Extension popup interface
│       │   └── background/# Background scripts
│       ├── dist/          # Built extension files
│       ├── manifest.json  # Chrome extension manifest
│       └── package.json   # Extension dependencies
├── packages/
│   └── shared/            # Shared component library
│       ├── src/
│       │   ├── components/
│       │   │   └── ui/    # Reusable UI components (Button, Input, Modal, Alert)
│       │   ├── types/     # Shared TypeScript types
│       │   └── index.ts   # Exports for shared components
├── pnpm-workspace.yaml    # PNPM workspace configuration
├── package.json           # Root package.json for monorepo
├── tsconfig.json          # Root TypeScript configuration
├── vercel.json            # Vercel deployment configuration
├── postcss.config.mjs
├── eslint.config.mjs
└── README.md
```

**Key Features:**

- Next.js 15, React 19, TypeScript, Tailwind CSS
- Monorepo structure with PNPM workspaces
- Shared component library for UI consistency
- Supabase for authentication and data storage
- Custom API routes for CRUD operations on applications, contacts, and interviews
- User context for authentication state management
- Dashboard with drag-and-drop Kanban board for application tracking
- Interview management with both normal list view and calendar view
- Contact management for tracking recruiters and hiring managers
- Collapsible sidebar navigation with hover functionality
- Chrome extension for capturing job applications from websites
- Modular, modern UI components with consistent design system
- Vercel deployment configuration

## Installation (Development)

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Web Application Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/rquitasol/appli_stash.git
   cd appli_stash
   ```

2. **Install dependencies:**

   ```bash
   # Install all dependencies with PNPM (recommended)
   pnpm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the `apps/web` directory with the following variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   PASSWORD_SECRET=your_password_secret
   ```

4. **Start development server:**

   ```bash
   # Run the web application development server
   pnpm dev
   ```

5. **Build for production:**

   ```bash
   # Build the web application for production
   pnpm build
   ```

### Chrome Extension Setup

1. **Build the extension:**

   ```bash
   # Navigate to the extension directory
   cd apps/extension

   # Install dependencies (if not already installed from root)
   pnpm install

   # Build the extension
   pnpm dev
   ```

   This will compile the extension to the `apps/extension/dist` folder.

2. **Load in Chrome:**
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" (toggle in the top-right corner)
   - Click "Load unpacked" and select the `apps/extension/dist` directory
   - The AppliStash extension should now appear in your browser toolbar

3. **Extension Features:**
   - Basic login functionality integrated with the web app
   - Lightweight popup interface
   - Direct integration with Chrome APIs
   - Configurable API endpoints (local development vs production)

## Technology Stack

- **Frontend**: Next.js 15 (React 19), TypeScript
- **Styling**: Tailwind CSS
- **Monorepo Management**: PNPM Workspaces
- **Database/Auth**: Supabase
- **Deployment**: Vercel
- **Linting**: ESLint
- **Bundler**: Turbopack (Next.js default)

## Deployment

The application is configured for deployment on Vercel. The `vercel.json` file in the root directory ensures proper configuration for the monorepo structure.

### Vercel Deployment Steps:

1. Connect your GitHub repository to Vercel
2. Configure the deployment settings:
   - Set the "Framework Preset" to Next.js
   - Set the "Root Directory" to `apps/web`
   - Add all environment variables from your `.env` file
3. Deploy your application

## Roadmap

- [x] Refactor to monorepo structure
- [x] Create shared component library
- [x] Set up Vercel deployment configuration
- [x] Basic application tracking functionality
- [x] User authentication with Supabase
- [x] Kanban board view for application tracking
- [x] Interview scheduling and management
- [x] Calendar view for interviews
- [x] Contact management system
- [x] Collapsible sidebar navigation
- [x] Chrome extension basic structure
- [ ] Chrome extension integration with job sites
- [ ] Document management for resumes and cover letters
- [ ] Analytics and insights dashboard
- [ ] Email integration and reminders
- [ ] Mobile responsive design improvements
- [ ] Dark mode support
- [ ] Advanced filtering and search

## Inspiration

Built for job seekers who are tired of losing track of applications across multiple platforms. AppliStash brings order to the chaos of modern job hunting.

---

**Happy job hunting!**
