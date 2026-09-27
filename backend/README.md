uvicorn app.main:app --reload




User uploads PDF
       ↓
Validate filename
       ↓
Validate .pdf extension
       ↓
Validate Content-Type
       ↓
Read file
       ↓
Check 5 MB limit
       ↓
Create upload directory
       ↓
Generate unique filename
       ↓
Save PDF
       ↓
Extract text
       ↓
Send text to OpenAI
       ↓
Get ResumeAnalysis
       ↓
Create Resume database record
       ↓
Save to PostgreSQL