# Aurum Estates — Backend (Express + MongoDB)

REST API for the Aurum Estates real estate platform. Pairs with the React frontend built in Lovable.

## Stack
- Node.js + Express
- MongoDB (use **MongoDB Compass** for local viewing) + Mongoose
- CORS, dotenv, morgan

## Folder structure
```
backend/
├── config/db.js              # Mongoose connection
├── controllers/              # Business logic
│   └── propertyController.js
├── models/Property.js        # Mongoose schema
├── routes/propertyRoutes.js  # REST routes
├── server.js                 # Entry point
├── seed.js                   # Sample data
├── .env.example
└── package.json
```

## Setup

1. **Install MongoDB locally** (or use MongoDB Compass to connect to a running instance)
   - Default URI: `mongodb://127.0.0.1:27017/realestateDB`

2. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # edit if needed — defaults work with MongoDB Compass local
   ```

4. **(Optional) Seed sample data**
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   npm start          # production
   npm run dev        # with auto-reload (nodemon)
   ```
   Server runs on `http://localhost:5000`.

## Connecting the frontend

In your Lovable project, set the env var:
```
VITE_API_URL=http://localhost:5000/api
```
The frontend automatically falls back to in-browser mock data if the backend is unreachable, so it always works.

## API endpoints

| Method | Path                      | Description                     |
|--------|---------------------------|---------------------------------|
| GET    | `/api/properties`         | List all (supports query filters: `q`, `type`, `status`, `minPrice`, `maxPrice`, `bedrooms`) |
| GET    | `/api/properties/:id`     | Get one                         |
| POST   | `/api/properties`         | Create                          |
| PUT    | `/api/properties/:id`     | Update                          |
| DELETE | `/api/properties/:id`     | Delete                          |

### Property schema
```js
{
  title, description, price, location,
  propertyType: "Villa" | "Apartment" | "House" | "Penthouse" | "Studio" | "Land",
  bedrooms, bathrooms, area,
  status: "sale" | "rent",
  image, contactNumber,
  createdAt, updatedAt
}
```

## Viewing data in MongoDB Compass

1. Open MongoDB Compass
2. Connect to `mongodb://127.0.0.1:27017`
3. Open the `realestateDB` database → `properties` collection
