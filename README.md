# AI Resume Analyzer & Job Tracker

A full-stack career management platform that helps users analyze resumes, track job applications, and monitor their job search progress from one place.

The project is built with **FastAPI, PostgreSQL, Redis, and Next.js**, with a focus on secure authentication, clean backend architecture, caching, and scalable application design.

## Features

### Resume Analysis
- Upload resumes for analysis
- Extract and process resume content
- AI-powered resume analysis
- Resume scoring and feedback
- Identify missing skills and improvement areas
- View detailed analysis results

### Job Tracker
- Create and manage job applications
- Track application status
- Store company and job information
- Add notes and application dates
- Prevent duplicate applications
- Track application progress

### Dashboard
- Resume statistics
- Application statistics
- Latest resume analysis
- Job application overview
- Cached dashboard data using Redis

### Authentication & Security
- User registration and login
- JWT-based authentication
- Access and refresh tokens
- HttpOnly authentication cookies
- Password hashing
- CSRF protection
- Rate limiting
- Protected API routes
- User-specific data isolation

### Backend Architecture
The backend follows a layered architecture:

```text
Router
   ↓
Service
   ↓
Repository
   ↓
Database
