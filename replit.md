# Japanese Learning Center Website

## Project Overview
This is a Japanese language learning center website built with Next.js, React, and TypeScript. The application includes:

- **Frontend**: Next.js with React components and TailwindCSS
- **Backend**: Next.js API routes for handling quiz, CMS, and authentication
- **Features**: 
  - User authentication and role management
  - Japanese quiz system (N5-N1 levels)
  - Content Management System (CMS)
  - Notification system
  - Responsive design

## Project Structure
- `app/` - Next.js App Router structure with pages and API routes
- `src/` - React components, contexts, and utilities
- `components/` - Reusable UI components (Radix UI + shadcn/ui)

## Recent Changes
- **2025-09-21**: 
  - Fixed TypeScript configuration and LSP errors
  - Configured Next.js for Replit environment with CORS headers
  - Created API routes to replace Supabase edge functions
  - Updated frontend contexts to use new API endpoints
  - Configured workflow to run on port 5000

## Architecture
- **Frontend**: Next.js with React Router for navigation
- **State Management**: React Context API for auth, quiz, CMS, and notifications
- **UI**: TailwindCSS with Radix UI components
- **Backend**: Next.js API routes with mock data storage
- **Development Server**: Runs on port 5000 with 0.0.0.0 host binding for Replit

## User Preferences
- Vietnamese language interface
- Japanese language learning focus
- Quiz-based assessment system

**Email:** `admin@japancenter.demo`
- **Mật khẩu:** `Admin123!@#`