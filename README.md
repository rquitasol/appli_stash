# AppliStash

> Your secret stash for job applications - track, organize, and conquer your job hunt!

AppliStash is a Chrome extension and companion web app that helps you track job applications directly from the websites where you apply. It overlays custom buttons on job listings or application pages, letting you save, organize, and review your progress in one place.

## Features

- **One-Click Save**: Chrome extension injects an overlay on job sites
- **Smart Tracking**: Track application status from saved to offer
- **Dashboard Insights**: Comprehensive web dashboard for management
- **Seamless Integration**: Works directly on job sites you already use
- **Built with React**: Modern, responsive UI for both extension and web app

## Project Structure

```
appli_stash/
├── apps/
│   └── web/               # Main Next.js web application
│       ├── app/
│       │   ├── api/       # API routes (application, login, register, etc.)
│       │   ├── dashboard/ # Dashboard pages
│       │   ├── login/     # Login page
│       │   ├── register/  # Registration page
│       │   ├── layout.tsx # Root layout
│       │   └── page.tsx   # Home page
│       ├── components/
│       │   ├── context/   # User context provider
│       │   ├── forms/     # Application, Login, Registration forms
│       │   ├── layout/    # Header, Footer
│       │   └── board/     # Board components
│       ├── lib/           # Utility libraries (encryption, JWT, Supabase)
│       ├── types/         # TypeScript type definitions
│       ├── public/
│       ├── next.config.ts
│       └── .env           # Environment variables
├── packages/
│   └── shared/            # Shared component library
│       ├── src/
│       │   ├── components/
│       │   │   └── ui/    # Reusable UI components (Button, Input, Modal, Alert)
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
- Custom API routes for login, registration, and application CRUD
- User context for authentication state
- Dashboard with modal form for adding applications
- Modular, modern UI components
- Vercel deployment configuration

**Recent changes:**

- Refactored to a monorepo structure with PNPM workspaces
- Created a shared component library in `packages/shared`
- Moved UI components to the shared package for reusability
- Reorganized application code into `apps/web` directory
- Added Vercel deployment configuration
- Enhanced Modal component with improved styling and accessibility
- Updated form buttons to use "Save" instead of "Add Application"
- Maintained clear modal titles for different operations
- Fixed path aliases for proper module resolution
- Optimized build configuration for monorepo deployment

## Data Models

### Application Object

- **Name** - Company Name
- **Position** - Job title/role
- **Application Date** - When you applied

  - `Saved`
  - `Applied`
  - `Phone Screen`
  - `Interview`
  - `Offer`
  - `Rejected`
  - `Withdrawn`

- **Job URL** - Link to original posting
- **Salary Range** - Expected compensation
- **Location** - Job location (Remote/City/State)
- **Application Method** - How you applied (LinkedIn, Company Site, Referral, etc.)
- **Priority Level** - High, Medium, Low
- **Notes** - Personal notes and observations
- **Next Action** - Follow-up date/action needed
- **Contact Person** - Recruiter or hiring manager
- **Application Deadline** - When applications close

### Contact Object

- **Name** - Contact's full name
- **Title** - Job title/role
- **Email** - Contact email
- **Phone** - Phone number
- **Company** - Company name
- **LinkedIn Profile** - LinkedIn URL
- **Notes** - Interaction history
- **Relationship** - Connection to application

### Interview Object

- **Application ID** - Links to specific application
- **Interview Type** - Phone, Video, In-person, Technical
- **Date/Time** - Scheduled time
- **Interviewer Name(s)** - Who you're meeting with
- **Status** - Scheduled, Completed, Cancelled
- **Notes** - Interview notes and feedback
- **Follow-up Required** - Next steps needed

### Document Object

- **Application ID** - Links to specific application
- **Document Type** - Resume, Cover Letter, Portfolio
- **File Name/Path** - Document location
- **Version** - Document version number
- **Date Modified** - Last updated

### Company Object

- **Company Name** - Organization name
- **Industry** - Business sector
- **Size** - Company size (employees)
- **Website** - Company website
- **Notes** - Company research notes
- **Rating** - Personal rating or Glassdoor score

## Installation (Development)

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
   # Run the development server
   pnpm dev
   ```

5. **Build for production:**

   ```bash
   # Build the application for production
   pnpm build
   ```

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
- [ ] Kanban board view for application tracking
- [ ] Interview scheduling integration
- [ ] Document management for resumes and cover letters
- [ ] Analytics and insights dashboard
- [ ] Chrome extension for quick application saving
- [ ] Mobile responsive design
- [ ] Dark mode support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Inspiration

Built for job seekers who are tired of losing track of applications across multiple platforms. AppliStash brings order to the chaos of modern job hunting.

---

**Happy job hunting!**
