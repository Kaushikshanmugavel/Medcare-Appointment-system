# MedCare – Next.js 15 Patient & Admin Portal

This repository contains the Next.js 15 frontend application for **MedCare**, designed with a premium, responsive medical dashboard theme.

---

## Technical Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: TanStack React Query (v5)
- **Forms**: React Hook Form
- **Validation**: Zod
- **API Client**: Axios

---

## Folder Structure
```
frontend/
├── src/
│   ├── app/                # App Router routes and pages
│   ├── components/         # Shared layouts, cards, buttons and dialog modules
│   ├── hooks/              # Custom query and mutation hooks (useDoctors, useAppointments)
│   ├── lib/                # API client configuration
│   ├── providers/          # React Query provider wrapper
│   ├── types/              # TypeScript global data structures
│   └── validators/         # Zod schemas for forms validation
```

---

## Setup & Running Instructions

### Prerequisites
- Node.js (v18 or higher)
- Running MedCare backend server (`http://localhost:5000`)

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```

### Running the App
```bash
# Development mode (runs on http://localhost:3000)
npm run dev

# Production build
npm run build
npm run start
```
