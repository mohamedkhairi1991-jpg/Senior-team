# Hospital Coordination Backend (Express + Supabase)

## Env (Replit → Tools → Secrets)
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE
- JWT_SECRET

## Run locally
```bash
npm install
npm run dev
```

### Health check
- `/` → text
- `/health/db` → checks table access

### Core endpoints
- `POST /api/auth/register` → { email, password, role }
- `POST /api/auth/login` → { email, password } → { token }
- `GET  /api/patients`
- `POST /api/patients` → { name, dob?, mrn? }
- `GET  /api/entries/:patientId`
- `POST /api/entries/:patientId` → { type, text, date?, author? }
- `GET  /api/recommendations/:patientId`
- `POST /api/recommendations/:patientId` → { text, author? }
- `POST /api/images/:patientId` (multipart field `file`)