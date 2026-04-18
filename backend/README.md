# Doctome API — Node.js

Express + Mongoose REST API. Replaces all CRUD webhook chains from the n8n workflow.  
The n8n workflow (`doctome_automation_n8n.json`) now handles **only** automation:
- No-show scoring on new appointments (webhook → weather → score → MongoDB)
- Daily batch rescoring at 4 pm
- 30-min reminder checks for HIGH-risk appointments
- Confirmation links (`/confirm-attendance`)
- Reschedule offer flow (`/reschedule-accept`)

---

## Quick Start

```bash
cp .env.example .env          # fill in your values
npm install
npm run dev                   # nodemon, or: npm start
```

---

## Environment Variables

| Variable       | Default                              | Description              |
|---------------|--------------------------------------|--------------------------|
| `PORT`         | `3000`                               | HTTP port                |
| `MONGODB_URI`  | `mongodb://localhost:27017/doctome`  | MongoDB connection string |
| `JWT_SECRET`   | `CHANGE_ME_IN_PRODUCTION`            | HS256 signing secret     |
| `JWT_EXPIRES_IN` | `86400`                            | Token lifetime (seconds) |

> **Important:** set the same `JWT_SECRET` in your n8n environment variable `JWT_SECRET` so the automation webhooks can still verify tokens.

---

## Data Model

All users live in a **single `users` collection** with a `type` field:

| type      | Extra fields (all optional)                                                      |
|-----------|---------------------------------------------------------------------------------|
| `patient` | age, gender, blood_type, distance_km, payment_type, height_cm, weight_kg, bmi, allergies, medical_conditions, prior_no_shows, prior_visits |
| `doctor`  | specialty, clinic_name, available_days, slot_duration_min, max_daily_patients, overbooking_allowed |
| `staff`   | _(none)_                                                                        |
| `admin`   | _(none)_                                                                        |

Backward-compat aliases (`patient_id`, `patient_name`, `patient_phone`, `doctor_id`, `doctor_name`) are kept so existing n8n automation nodes that reference those fields continue to work without changes.

---

## Endpoints

### Auth
| Method | Path              | Auth | Description          |
|--------|-------------------|------|----------------------|
| POST   | `/auth/signup`    | —    | Register new user    |
| POST   | `/auth/login`     | —    | Login, get JWT       |
| GET    | `/auth/me`        | JWT  | Current user profile |
| POST   | `/auth/refresh`   | JWT  | Refresh JWT token    |

**POST /auth/signup body:**
```json
{
  "username": "john_doe",
  "password": "secret",
  "type": "patient",           // patient | doctor | staff | admin
  "full_name": "John Doe",
  "phone": "0550000000",
  "wilaya": "Algiers",
  // patient extras (all optional):
  "age": 35, "gender": "Male", "blood_type": "A+",
  // doctor extras (all optional):
  "specialty": "Cardiology", "clinic_name": "Heart Clinic"
}
```

---

### Patients
| Method | Path             | Auth | Description         |
|--------|-----------------|------|---------------------|
| POST   | `/patients`      | JWT  | Create patient      |
| GET    | `/patients`      | —    | List patients       |
| GET    | `/patients/:id`  | —    | Single patient      |
| PUT    | `/patients/:id`  | JWT  | Update patient      |
| DELETE | `/patients/:id`  | JWT  | Soft-delete patient |

**Query params for GET /patients:** `wilaya`, `name` (regex), `patient_id`, `user_id`

---

### Doctors
| Method | Path            | Auth | Description        |
|--------|----------------|------|--------------------|
| POST   | `/doctors`      | JWT  | Create doctor      |
| GET    | `/doctors`      | —    | List doctors       |
| GET    | `/doctors/:id`  | —    | Single doctor      |
| PUT    | `/doctors/:id`  | JWT  | Update doctor      |
| DELETE | `/doctors/:id`  | JWT  | Soft-delete doctor |

**Query params for GET /doctors:** `wilaya`, `specialty`, `name` (regex), `doctor_id`, `user_id`

---

### Appointments
| Method | Path                  | Auth | Description            |
|--------|-----------------------|------|------------------------|
| POST   | `/appointments`        | JWT  | Create appointment     |
| GET    | `/appointments`        | JWT  | List appointments      |
| GET    | `/appointments/:id`    | JWT  | Single appointment     |
| PUT    | `/appointments/:id`    | JWT  | Update appointment     |
| DELETE | `/appointments/:id`    | JWT  | Cancel appointment     |

**Query params for GET /appointments:** `date`, `patient_id`, `doctor_id`, `risk_level`, `status`, `from`, `to`

---

### Dashboard
| Method | Path                        | Auth | Description               |
|--------|-----------------------------|------|---------------------------|
| GET    | `/dashboard/appointments`   | JWT  | Appointment KPIs + charts |
| GET    | `/dashboard/patients`       | JWT  | Patient KPIs + demographics |

---

### Notifications
| Method | Path              | Auth | Description              |
|--------|-------------------|------|--------------------------|
| GET    | `/notifications`   | JWT  | List user notifications  |
| DELETE | `/notifications`   | JWT  | Clear all notifications  |
| GET    | `/sse/notifications` | JWT | SSE stream of notifications |

**Query params:** `user_id`, `type`

---

## n8n Integration

The stripped n8n workflow (`doctome_automation_n8n.json`) still:
- Receives new appointment bookings via webhook (`POST /doctome-appointment`)
- Scores them and writes directly to MongoDB
- Runs cron jobs for reminders and reschedule offers
- Handles confirmation/reschedule webhook responses

The n8n MongoDB nodes write directly to the same database this API reads from —
no changes needed to those automation nodes.

For the appointment booking webhook, n8n still verifies the JWT using its own
`JWT Verify` code node (which reads `JWT_SECRET` from n8n env vars).
