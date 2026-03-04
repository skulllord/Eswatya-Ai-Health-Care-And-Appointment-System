# ✅ System Updated to Use SQLite

## What Changed?

The system has been updated to use **SQLite** instead of PostgreSQL. This means:
- ✅ No PostgreSQL installation required
- ✅ Database is a simple file (`eswatya_healthcare.db`)
- ✅ Everything works exactly the same
- ✅ Perfect for development and testing

## Current Status

✅ **Backend Running:** http://localhost:8000  
✅ **Database:** SQLite (file-based)  
✅ **Sample Doctors:** 5 doctors seeded  
✅ **Ready to Use!**

## Quick Start

### Backend is Already Running!
The backend is currently running on http://localhost:8000

### Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Then open: http://localhost:5173

## Sample Credentials

### Doctors (Pre-seeded)
```
Username: dr_smith     | Password: doctor123
Username: dr_johnson   | Password: doctor123
Username: dr_williams  | Password: doctor123
Username: dr_brown     | Password: doctor123
Username: dr_davis     | Password: doctor123
```

### Patient
Register your own at http://localhost:5173/register

## Database File Location

The SQLite database is stored as:
```
backend/eswatya_healthcare.db
```

You can view/edit it with any SQLite browser tool.

## If You Want to Use PostgreSQL Instead

If you prefer PostgreSQL, follow these steps:

1. Install PostgreSQL
2. Create database:
   ```sql
   CREATE DATABASE eswatya_healthcare;
   ```

3. Update `backend/database.py`:
   ```python
   DATABASE_URL = "postgresql://postgres:YOUR_PASSWORD@localhost:5432/eswatya_healthcare"
   ```

4. Install psycopg2:
   ```bash
   pip install psycopg2-binary
   ```

5. Reinitialize database:
   ```bash
   python init_db.py
   ```

## Advantages of SQLite

✅ No installation required  
✅ Single file database  
✅ Perfect for development  
✅ Easy to backup (just copy the .db file)  
✅ Fast for small to medium datasets  
✅ Zero configuration  

## Next Steps

1. ✅ Backend is running
2. Start frontend (see commands above)
3. Register as patient
4. Test AI prediction
5. Book appointments

---

**Status:** ✅ System fully functional with SQLite!
