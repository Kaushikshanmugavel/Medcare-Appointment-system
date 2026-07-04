# MedCare – Doctor Appointment Management System

MedCare is a Full Stack SaaS-like Doctor Appointment Management System built with a decoupled Next.js 15 frontend and NestJS backend.

---

## Workspace Structure

- **[`backend/`](file:///c:/Users/gauta/OneDrive/Desktop/medcare/backend/)**: NestJS backend application with MongoDB Mongoose ODM, validation pipes, automatic seeder, and booking calendar collision validation rules.
- **[`frontend/`](file:///c:/Users/gauta/OneDrive/Desktop/medcare/frontend/)**: Next.js 15 App Router application with Tailwind CSS, Zod, React Hook Form, Axios API client, and TanStack React Query synchronization.

---

## Getting Started

Refer to individual service instructions for environment variables and specific configurations:
- **[Backend Setup Guidelines](file:///c:/Users/gauta/OneDrive/Desktop/medcare/backend/README.md)**
- **[Frontend Setup Guidelines](file:///c:/Users/gauta/OneDrive/Desktop/medcare/frontend/README.md)**

### Running the Complete Application Locally

1. **Start the Backend server**:
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```
   *The backend will automatically seed 12 professional doctors when starting on an empty MongoDB database and run on `http://localhost:5000/api`.*

2. **Start the Frontend portal**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The frontend will run on `http://localhost:3000`.*
