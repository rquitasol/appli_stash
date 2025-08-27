# appli_stash

appli_stash is a Chrome extension and companion web app that helps you track job applications directly from the websites where you apply. It overlays custom buttons on job listings or application pages, letting you save, organize, and review your progress in one place.

## Features

- Chrome extension that injects an overlay on job sites
- Add applications to your personal stash with one click
- Track application status (applied, interview, offer, rejected, etc.)
- Redirects to a dashboard for deeper insights and management
- Built with React for the frontend and content overlay

## Project Structure

- **extension/** – Chrome extension source (manifest, background, content scripts, popup UI)
- **web/** – React web app for dashboard and detailed tracking
- **shared/** – Shared utilities, models, and constants

## Installation (Dev)

1. Clone the repo:
   ```bash
   git clone https://github.com/rquitasol/appli_stash.git
   cd appli_stash
   ```
