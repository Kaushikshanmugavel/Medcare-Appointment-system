# MedCare – Doctor Appointment Management System Backend

This repository houses the NestJS-based backend REST API for **MedCare**, a professional-grade Doctor Appointment Management System. 

It handles appointment bookings, timezone-aware working slot calculations, overlap collision prevention, doctor management (CRUD), and administration metrics.

---

## Technical Stack
- **Framework**: NestJS (v10+)
- **Language**: TypeScript (v5+)
- **Database**: MongoDB (via Mongoose ODM)
- **Validation**: `class-validator` & `class-transformer`
- **Security**: Direct Secret Key Header Verification (no-JWT configuration)

---

## Folder Structure
```
backend/
├── src/
│   ├── app.module.ts             # App root module bootstrap
│   ├── main.ts                   # Express server config and pipeline setup
│   ├── admin/                    # Admin service, controller, and login DTOs
│   ├── appointments/             # Appointment model, CRUD, slots generation and validation rules
│   ├── doctors/                  # Doctor model, search, and CRUD logic
│   ├── seed/                     # Automatic seeder prepopulating 12 doctors
│   ├── config/                   # Config module loader mapping env keys
│   └── common/                   # Shared architectural guards, filters, and interceptors
│       ├── filters/              # Global HttpExceptionFilter
│       ├── guards/               # AdminGuard validating secret keys
│       └── interceptors/         # Response envelope transformer
```

---

## Setup & Running Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or a MongoDB Atlas Connection URI

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root of the `backend/` directory (see [Environment Variables](#environment-variables) below).

### Running the App
```bash
# Development mode
npm run start:dev

# Production mode build & launch
npm run build
npm run start:prod
```

---

## Environment Variables

Create a `.env` file with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medcare
SECRET_KEY=medcare_admin_secret_key_2026
```

---

## API Endpoints List

All responses use a standardized JSON wrapper:
- **Success**: `{ success: true, message: "...", data: { ... } }`
- **Error**: `{ success: false, message: "...", error: "..." }`

### Admin Endpoints
| HTTP Method | Route | Description | Headers | Body / Parameters |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/login` | Verify administrator secret key | None | `{ "secretKey": "..." }` |
| `GET` | `/api/admin/metrics` | Retrieve statistics (Today's appts, Total doctors...) | `x-secret-key: <key>` | None |

### Doctor Endpoints
| HTTP Method | Route | Description | Headers | Body / Parameters |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/doctors` | List all doctors (supports query search) | None | `?search=specialization_or_name` |
| `GET` | `/api/doctors/:id` | Fetch specific doctor profile | None | None |
| `POST` | `/api/doctors` | Add a new doctor profile | `x-secret-key: <key>` | CreateDoctor DTO |
| `PUT` | `/api/doctors/:id` | Edit active doctor details | `x-secret-key: <key>` | UpdateDoctor DTO |
| `DELETE` | `/api/doctors/:id` | Remove doctor profile | `x-secret-key: <key>` | None |

### Appointment Endpoints
| HTTP Method | Route | Description | Headers | Body / Parameters |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/appointments` | Book a new doctor appointment slot | None | CreateAppointment DTO |
| `GET` | `/api/appointments` | Get appointments list | `x-secret-key: <key>` | `?date=YYYY-MM-DD` / `?doctorId=...` |
| `GET` | `/api/appointments/slots` | Fetch 30min slots with availability status | None | `?doctorId=...&date=YYYY-MM-DD` |
| `GET` | `/api/appointments/:id` | Get individual appointment details | `x-secret-key: <key>` | None |
