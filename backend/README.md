
1. Copy `.env.example` to `.env` (or create a `.env` file) and edit if needed.
   - For local dev the default DATABASE_URL uses SQLite: `file:./dev.db`
2. Install dependencies:
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run seed
   npm run dev
   ```
3. Backend will run at `http://localhost:8000` by default.
## Notes
- Uses Prisma + SQLite for ease of local setup. For production/deployment switch to PostgreSQL and update `DATABASE_URL`.
- Authentication uses JWT stored in an httpOnly cookie.