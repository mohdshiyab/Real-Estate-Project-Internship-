# Aurum Estates — Luxury Real Estate Frontend

Premium React + Vite + Tailwind frontend for the Aurum Estates MERN backend.

## Stack
- React 18 + Vite 5
- React Router DOM 6
- Tailwind CSS 3 (custom emerald + gold luxury theme)
- Axios for API calls
- Framer Motion for animations
- React Icons + React Toastify

## Setup

```bash
npm install
npm run dev
```

The frontend runs at: **http://localhost:5173**

Make sure the backend is running on **http://localhost:5000** with MongoDB available.

## Environment

`.env` (already included):
```
VITE_API_URL=http://localhost:5000/api
```

Change this to point to a different backend URL if needed.

## Backend CORS

Set `CLIENT_ORIGIN=http://localhost:5173` in the backend `.env` so the frontend
can call the API from the browser.

## Pages
- `/` — Home (hero, featured, services, testimonials, stats, CTA)
- `/properties` — Listing with search, filters, sorting
- `/properties/:id` — Details with gallery, amenities, agent, related
- `/add` — Create property form (POST)
- `/edit/:id` — Edit property form (PUT)
- Delete handled with confirmation modal on the details page (DELETE)

## API Endpoints Consumed

All match the uploaded backend exactly:

| Method | Endpoint                     | Purpose                          |
|--------|------------------------------|----------------------------------|
| GET    | `/api/properties`            | list (q, type, status, minPrice, maxPrice, bedrooms) |
| GET    | `/api/properties/:id`        | get one                          |
| POST   | `/api/properties`            | create                           |
| PUT    | `/api/properties/:id`        | update                           |
| DELETE | `/api/properties/:id`        | delete                           |

## Build for production
```bash
npm run build
npm run preview
```
