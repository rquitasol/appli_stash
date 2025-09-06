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
├── src/
│   ├── app/
│   │   ├── api/           # API routes (application, login, register, etc.)
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── login/         # Login page
│   │   ├── register/      # Registration page
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/
│   │   ├── context/       # User context provider
│   │   ├── forms/         # Application, Login, Registration forms
│   │   ├── layout/        # Header, Footer
│   │   └── ui/            # UI elements (Button, Input, Modal, Alert)
│   ├── hooks/
│   ├── lib/               # Utility libraries (encryption, JWT, Supabase)
│   ├── store/
│   ├── styles/
│   └── types/
├── public/
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── README.md
```

**Key Features:**

- Next.js 15, React 19, TypeScript, Tailwind CSS
- Supabase for authentication and data storage
- Custom API routes for login, registration, and application CRUD
- User context for authentication state
- Dashboard with modal form for adding applications
- Modular, modern UI components

**Recent changes:**

- Project structure is now monolithic Next.js (no separate extension/web folders)
- All business logic and UI are in `src/`
- API routes handle authentication and application management
- Forms and UI are fully componentized

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
   # Install web app dependencies
   cd web
   npm install

   # Install extension dependencies
   cd ../extension
   npm install
   ```

3. **Start development servers:**

   ```bash

   npm run build:dev
   ```

- **Frontend**: Next.js (React), TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint
- **Extension**: Chrome Extension API v3
- **Storage**: Chrome Storage API, IndexedDB
- **Bundler**: Turbopack (Next.js default)

4. **Load Chrome extension:**

- **Build Tools**: Webpack, Babel
- **Storage**: Chrome Storage API, IndexedDB
- [ ] Next.js web dashboard
- [ ] Basic extension overlay functionality
- [ ] Application status tracking
- [ ] Dashboard with kanban board view
- [ ] Interview scheduling integration
- [ ] Document management
- [ ] Analytics and insights
- [ ] Multi-browser support
- [ ] Mobile companion app

## Roadmap

- [ ] Basic extension overlay functionality
- [ ] Application status tracking
- [ ] Dashboard with kanban board view
- [ ] Interview scheduling integration
- [ ] Document management
- [ ] Analytics and insights
- [ ] Multi-browser support
- [ ] Mobile companion app

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
