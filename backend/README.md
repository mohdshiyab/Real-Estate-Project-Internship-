# Aurum Estates — Backend API (Express + MongoDB)

High-performance REST API for the Aurum Estates real estate platform. Pairs with the React + Vite frontend.

## Stack
- Node.js & Express.js
- MongoDB Atlas / Mongoose
- JWT (`jsonwebtoken`) & `bcryptjs`
- CORS, dotenv, morgan

## Directory Structure
```
backend/
├── config/
│   └── db.js                 # Mongoose connection with Google DNS resolver fallback
├── controllers/
│   ├── authController.js     # User registration, login, and profile fetching
│   ├── inquiryController.js  # Customer interest, seller leads & status updates
│   └── propertyController.js # Multi-estate CRUD, filtering, sorting & ownership
├── middleware/
│   └── auth.js               # JWT verification & role authorization (protect, authorizeRoles)
├── models/
│   ├── Inquiry.js            # Customer inquiry tracking schema
│   ├── Property.js           # Multi-estate schema (residential, land, commercial, GPS coordinates)
│   └── User.js               # User authentication schema with bcrypt password hashing
├── routes/
│   ├── authRoutes.js         # /api/auth routes
│   ├── inquiryRoutes.js      # /api/inquiries routes
│   └── propertyRoutes.js     # /api/properties routes
├── seed.js                   # Demo data seeder with properties, demo seller, demo buyer & inquiries
├── server.js                 # Server entry point
├── .env.example
└── package.json
```

## Setup & Running

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment (`.env`)**
   ```env
   PORT=5001
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.1nxgtjt.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=aurum_estates_super_secret_jwt_key_2026
   JWT_EXPIRES_IN=7d
   CLIENT_ORIGIN=http://localhost:5173
   ```

3. **Seed database**
   ```bash
   npm run seed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   API runs on `http://localhost:5001`.

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Seller / Dealer** | `dealer@aurumestates.com` | `password123` |
| **Buyer / Customer** | `buyer@aurumestates.com` | `password123` |

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register as a Seller or Buyer
- `POST /api/auth/login` — Sign in and obtain JWT
- `GET /api/auth/me` — Get profile (Protected)

### Properties
- `GET /api/properties` — Browse all estates (Filters: `q`, `category`, `type`, `status`, `minPrice`, `maxPrice`, `bedrooms`, `location`, `sort`)
- `GET /api/properties/my-listings` — List only logged-in seller's properties (Protected, Seller only)
- `GET /api/properties/:id` — Get one property
- `POST /api/properties` — Create property with GPS coordinates & category (Protected, Seller only)
- `PUT /api/properties/:id` — Update property (Protected, Owner only)
- `DELETE /api/properties/:id` — Delete property (Protected, Owner only)

### Inquiries & Leads
- `POST /api/inquiries` — Express customer interest (Protected)
- `GET /api/inquiries/seller` — Get inquiries for seller's properties (Protected, Seller only)
- `GET /api/inquiries/buyer` — Get inquiries made by buyer (Protected)
- `PATCH /api/inquiries/:id/status` — Update inquiry status (`pending`, `contacted`) (Protected, Seller only)
