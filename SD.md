# Software Document (SD)

## Project Name
GoPratle Requirement Posting

## Project Goal
This project provides a multi-step requirement posting flow for events.
Users can enter event details and choose who they want to hire:
- Planner
- Performer
- Crew

Data is saved to MongoDB and categorized by selected hire type.

## Tech Stack
- Next.js (App Router)
- React + TypeScript
- Next.js API Routes (Node.js runtime)
- MongoDB Atlas + Mongoose
- Tailwind CSS

## Main Features
1. 4-step dynamic requirement form.
2. Conditional fields based on hire type.
3. Backend validation in API route.
4. Requirement persistence in MongoDB.
5. Responsive UI with modern design system.

## Important Files
- `app/page.tsx` - Main page and hero section.
- `app/components/RequirementForm.tsx` - Multi-step form UI and submit logic.
- `app/api/requirements/route.ts` - API endpoint for saving requirements.
- `models/Requirement.ts` - Mongoose schema/model.
- `lib/mongodb.ts` - MongoDB connection utility.
- `app/globals.css` - Global tokens and styles.

## Environment Variable
Create `.env` with:

```env
MONGODB_URI=your_mongodb_connection_string
```

## Run Project
```bash
npm install
npm run dev
```

Open: http://localhost:3000

## API
### POST `/api/requirements`
Stores requirement data with event details and selected hire type.
