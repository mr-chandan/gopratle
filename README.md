# GoPratle Requirement Posting

This project provides a working requirement posting flow using:

- Next.js App Router frontend
- Next.js API Routes backend (Node.js runtime)
- MongoDB Atlas with Mongoose

The flow is a dynamic 4-step form:

1. Basic event details
2. Date/date range and location
3. Hire type selection: planner, performer, or crew
4. Type-specific requirement details and submission

On submit, data is saved in MongoDB and categorized by `hireType`.

## Project Structure

- `app/page.tsx`: page shell and heading
- `app/components/RequirementForm.tsx`: multi-step frontend form
- `app/api/requirements/route.ts`: POST API for validation and persistence
- `lib/mongodb.ts`: Mongoose connection cache for Next.js
- `models/Requirement.ts`: requirement schema/model with planner/performer/crew buckets

## Environment

Create/update `.env`:

```env
MONGODB_URI=your_mongodb_atlas_connection
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## API

### POST `/api/requirements`

Request payload:

```json
{
	"event": {
		"name": "Spring Product Launch",
		"type": "Corporate",
		"dateMode": "single",
		"startDate": "2026-04-05",
		"endDate": null,
		"location": "Bengaluru, Karnataka",
		"venue": "Grand Forum Hall"
	},
	"hireType": "performer",
	"requirementDetails": {
		"performerCategory": "dj",
		"performerCount": 2
	}
}
```

Success response:

```json
{
	"success": true,
	"message": "Requirement posted successfully.",
	"data": {
		"id": "...",
		"hireType": "performer"
	}
}
```
